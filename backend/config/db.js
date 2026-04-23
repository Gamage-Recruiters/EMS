import mongoose from "mongoose";
import dns from "node:dns";

// Some local/corporate DNS resolvers reject SRV lookups used by mongodb+srv.
// Only override DNS when using mongodb+srv and DNS_SERVERS is explicitly configured.
const mongoUri = process.env.MONGO_URI || "";
const shouldOverrideDns =
  mongoUri.startsWith("mongodb+srv://") && !!process.env.DNS_SERVERS;
const dnsServers = shouldOverrideDns
  ? process.env.DNS_SERVERS.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : [];

if (shouldOverrideDns && dnsServers.length) {
  dns.setServers(dnsServers);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas Connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
