import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};
