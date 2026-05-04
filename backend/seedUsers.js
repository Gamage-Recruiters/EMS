import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';
import dns from "node:dns";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "";
const dnsServers = process.env.DNS_SERVERS 
  ? process.env.DNS_SERVERS.split(",").map(s => s.trim()).filter(Boolean)
  : [];

if (mongoUri.startsWith("mongodb+srv://") && dnsServers.length) {
  dns.setServers(dnsServers);
}

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const users = [
      {
        firstName: 'CEO',
        lastName: 'User',
        email: 'grceo@gmail.com',
        password: 'grceo@gmail.com',
        role: 'CEO',
      },
      {
        firstName: 'Team',
        lastName: 'Lead',
        email: 'grlead@gmail.com',
        password: 'grlead@gmail.com',
        role: 'TL',
      },
      {
        firstName: 'Dev',
        lastName: 'User',
        email: 'grdev@gmail.com',
        password: 'grdev@gmail.com',
        role: 'Developer',
      },
    ];

    for (const u of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      
      const existingUser = await User.findOne({ email: u.email });
      if (!existingUser) {
        await User.create({
          ...u,
          password: hashedPassword,
          status: 'Active',
        });
        console.log(`User ${u.email} created.`);
      } else {
        existingUser.password = hashedPassword;
        existingUser.status = 'Active';
        await existingUser.save();
        console.log(`User ${u.email} updated (password reset).`);
      }
    }

    console.log('Seeding complete!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedUsers();
