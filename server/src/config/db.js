import mongoose from 'mongoose';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isConnecting = false;

const autoSeedBrokersIfEmpty = async () => {
  try {
    const { Broker } = await import('../models/Broker.js');
    const count = await Broker.countDocuments();
    if (count === 0) {
      const jsonPath = path.resolve(__dirname, '../../../agent-service/seed/ca_broker_registry.json');
      if (fs.existsSync(jsonPath)) {
        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        const brokersData = JSON.parse(rawData);
        await Broker.insertMany(brokersData);
        console.log(`[MongoDB] Auto-seeded ${brokersData.length} brokers into database.`);
      }
    }
  } catch (err) {
    console.warn('[MongoDB] Auto-seed check notice:', err.message);
  }
};

export const connectDB = async (retryCount = 0) => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (isConnecting && retryCount === 0) return;

  isConnecting = true;
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[MongoDB] Error: MONGODB_URI is not defined in server/.env');
    isConnecting = false;
    return;
  }

  // Attempt 1: Connect with standard URI
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host} / ${conn.connection.name}`);
    isConnecting = false;
    await autoSeedBrokersIfEmpty();
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error with SRV: ${error.message}`);

    // Attempt 2: Direct replica set URI (bypasses Windows SRV DNS resolution issues)
    if (uri.startsWith('mongodb+srv://') && uri.includes('.mongodb.net')) {
      try {
        console.log('[MongoDB] Attempting direct replica set connection (bypassing SRV lookup)...');
        const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)(.*)$/);
        if (match) {
          const [, user, pass, host, dbName, query] = match;
          const hostParts = host.split('.');
          const clusterName = hostParts[0];
          const clusterDomain = hostParts.slice(1).join('.');
          const directUri = `mongodb://${user}:${pass}@${clusterName}-shard-00-00.${clusterDomain}:27017,${clusterName}-shard-00-01.${clusterDomain}:27017,${clusterName}-shard-00-02.${clusterDomain}:27017/${dbName}?ssl=true&authSource=admin&retryWrites=true&w=majority`;

          const directConn = await mongoose.connect(directUri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
          });
          console.log(`[MongoDB] Connected successfully via Direct Replica Set: ${directConn.connection.host} / ${directConn.connection.name}`);
          isConnecting = false;
          await autoSeedBrokersIfEmpty();
          return directConn;
        }
      } catch (directErr) {
        console.error(`[MongoDB] Direct replica set connection failed: ${directErr.message}`);
      }
    }

    // Attempt 3: Public DNS Fallback
    if (error.message.includes('querySrv') || error.message.includes('ENOTFOUND') || error.message.includes('SERVFAIL')) {
      try {
        console.log('[MongoDB] Retrying with Google/Cloudflare public DNS (8.8.8.8, 1.1.1.1)...');
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 10000,
        });
        console.log(`[MongoDB] Connected successfully via DNS fallback: ${conn.connection.host} / ${conn.connection.name}`);
        isConnecting = false;
        await autoSeedBrokersIfEmpty();
        return conn;
      } catch (dnsErr) {
        console.error(`[MongoDB] Public DNS attempt failed: ${dnsErr.message}`);
      }
    }

    // Attempt 4: Try Local MongoDB fallback
    if (retryCount >= 2 && !uri.includes('localhost') && !uri.includes('127.0.0.1')) {
      try {
        console.log('[MongoDB] Checking for local MongoDB service (mongodb://127.0.0.1:27017/footprintzero)...');
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/footprintzero', {
          serverSelectionTimeoutMS: 2000,
        });
        console.log(`[MongoDB] Connected to local MongoDB instance: ${localConn.connection.host}`);
        isConnecting = false;
        await autoSeedBrokersIfEmpty();
        return localConn;
      } catch (localErr) {
        // Local MongoDB not running, continue retrying Atlas
      }
    }

    isConnecting = false;
    console.warn('[MongoDB] Database is retrying connection in 5s...');
    setTimeout(() => connectDB(retryCount + 1), 5000);
  }
};



