import mongoose from "mongoose";
import Team from "./models/Team.js";
import User from "./models/User.js";

import "dotenv/config";
import dns from "node:dns";
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const teams = await Team.find().populate("teamLead", "firstName lastName email").populate("members", "firstName lastName email");
  console.log(JSON.stringify(teams, null, 2));
  mongoose.disconnect();
}
run();
