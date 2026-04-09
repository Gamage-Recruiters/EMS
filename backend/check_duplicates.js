import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function checkDuplicates() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const Task = mongoose.model('Task', new mongoose.Schema({}, { strict: false }), 'tasks');
    
    // Get all tasks
    const allTasks = await Task.find().lean();
    console.log(`\nTotal tasks in DB: ${allTasks.length}`);
    
    // Find tasks with duplicate titles
    const titleMap = {};
    allTasks.forEach(t => {
      const title = t.title || '';
      if (!titleMap[title]) titleMap[title] = [];
      titleMap[title].push({ _id: t._id, status: t.status, assignedTo: t.assignedTo });
    });

    console.log('\n--- Duplicate titles ---');
    let foundDuplicates = false;
    for (const [title, entries] of Object.entries(titleMap)) {
      if (entries.length > 1) {
        foundDuplicates = true;
        console.log(`\nTitle: "${title}" (${entries.length} copies)`);
        entries.forEach(e => {
          console.log(`  _id: ${e._id}, status: ${e.status}, assignedTo: ${e.assignedTo}`);
        });
      }
    }

    if (!foundDuplicates) {
      console.log('No duplicate titles found.');
    }

    // Also check for duplicate _ids (shouldn't happen but let's be sure)
    const idSet = new Set();
    let dupIds = 0;
    allTasks.forEach(t => {
      const id = t._id.toString();
      if (idSet.has(id)) dupIds++;
      idSet.add(id);
    });
    console.log(`\nDuplicate _id entries: ${dupIds}`);

    // Print all tasks for reference
    console.log('\n--- All tasks ---');
    allTasks.forEach(t => {
      console.log(`  _id: ${t._id}, title: "${t.title}", status: "${t.status}"`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkDuplicates();
