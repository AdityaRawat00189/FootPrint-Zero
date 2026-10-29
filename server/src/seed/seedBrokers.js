import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';
import { Broker } from '../models/Broker.js';

// Ensure SRV records resolve cleanly on all Windows DNS configurations
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // ignore if not permitted
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedBrokers = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || mongoUri.includes('<ask-user>')) {
      console.error('[Seeder] Error: MONGODB_URI is not properly configured in server/.env');
      process.exit(1);
    }

    console.log('[Seeder] Connecting to MongoDB...');
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    } catch (err) {
      console.log('[Seeder] Retrying with Google/Cloudflare public DNS (8.8.8.8, 1.1.1.1)...');
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      } catch (dnsErr) {
        throw new Error(`MongoDB connection failed: ${dnsErr.message}`);
      }
    }
    console.log('[Seeder] Connected successfully.');

    // Read seed json
    const jsonPath = path.resolve(__dirname, '../../../agent-service/seed/ca_broker_registry.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const brokersData = JSON.parse(rawData);

    console.log(`[Seeder] Loaded ${brokersData.length} brokers from dataset. Upserting records...`);

    let inserted = 0;
    let updated = 0;

    for (const broker of brokersData) {
      const existing = await Broker.findOne({ name: broker.name });
      if (existing) {
        await Broker.updateOne({ name: broker.name }, { $set: broker });
        updated++;
      } else {
        await Broker.create(broker);
        inserted++;
      }
    }

    console.log(`[Seeder] Seeding completed: ${inserted} inserted, ${updated} updated.`);
    const total = await Broker.countDocuments();
    console.log(`[Seeder] Total brokers in database: ${total}`);

    await mongoose.disconnect();
    console.log('[Seeder] Disconnected from MongoDB. Done.');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Seeding error:', error);
    process.exit(1);
  }
};

seedBrokers();
