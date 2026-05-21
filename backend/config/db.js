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
  dns.setServers(dnsServers); // Enabled custom DNS to fix SRV resolution issues
}

const seedNoticeChannels = async () => {
  try {
    const Channel = (await import("../models/Channel.js")).default;
    const User = (await import("../models/User.js")).default;

    let ceo = await User.findOne({ email: "grceo@gmail.com" });
    if (!ceo) {
      ceo = await User.findOne({ role: "CEO" });
    }

    if (!ceo) {
      console.log("⚠️ No CEO found to seed notice channels under.");
      return;
    }

    const requiredChannels = [
      { name: "🧪 QA Testing Channel", type: "notice" },
      { name: "💻 Fullstack Channel", type: "notice" },
      { name: "🛡️ Admin Channel", type: "notice" },
      { name: "🎨 UI/UX Channel", type: "notice" },
      { name: "🔧 Maintenance Channel", type: "notice" }
    ];

    for (const channelData of requiredChannels) {
      const existing = await Channel.findOne({ name: channelData.name, type: "notice" });
      if (!existing) {
        await Channel.create({
          name: channelData.name,
          type: "notice",
          createdBy: ceo._id,
          members: [ceo._id],
          description: `Official ${channelData.name.replace(/[^\w\s/]/g, "").trim()} notices sent by the CEO.`,
          isActive: true
        });
        console.log(`✅ Seeded notice channel: ${channelData.name}`);
      } else if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        console.log(`✅ Activated notice channel: ${channelData.name}`);
      }
    }
  } catch (error) {
    console.error("❌ Error seeding notice channels:", error);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas Connected!");
    await seedNoticeChannels();
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
