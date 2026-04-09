import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function cleanupDuplicates() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const Task = mongoose.model('Task', new mongoose.Schema({}, { strict: false }), 'tasks');
    
    const allTasks = await Task.find().lean();
    console.log(`Total tasks before cleanup: ${allTasks.length}`);

    // Group tasks by title
    const titleMap = {};
    allTasks.forEach(t => {
      const title = t.title || '';
      if (!titleMap[title]) titleMap[title] = [];
      titleMap[title].push(t);
    });

    const idsToDelete = [];

    for (const [title, entries] of Object.entries(titleMap)) {
      if (entries.length > 1) {
        console.log(`\nDuplicate title: "${title}" (${entries.length} copies)`);
        // Keep the first (oldest) entry, delete the rest
        const [keep, ...remove] = entries;
        console.log(`  Keeping: _id=${keep._id}, status=${keep.status}`);
        remove.forEach(r => {
          console.log(`  Deleting: _id=${r._id}, status=${r.status}`);
          idsToDelete.push(r._id);
        });
      }
    }

    if (idsToDelete.length === 0) {
      console.log('\nNo duplicates to clean up.');
    } else {
      console.log(`\nDeleting ${idsToDelete.length} duplicate documents...`);
      const result = await Task.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`Deleted ${result.deletedCount} documents.`);
    }

    // Verify
    const remaining = await Task.find().lean();
    console.log(`\nTotal tasks after cleanup: ${remaining.length}`);
    remaining.forEach(t => {
      console.log(`  _id: ${t._id}, title: "${t.title}", status: "${t.status}"`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

cleanupDuplicates();
