import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Attendance from './models/Attendance.js';

dotenv.config();

const seedAttendance = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const employeeEmail = 'grdev@gmail.com';
    const employee = await User.findOne({ email: employeeEmail });
    if (!employee) {
      throw new Error(`Employee not found: ${employeeEmail}`);
    }

    const records = [
      {
        employee: employee._id,
        date: new Date('2026-04-27T00:00:00.000Z'),
        checkInTime: new Date('2026-04-27T09:00:00.000Z'),
        checkOutTime: new Date('2026-04-27T17:15:00.000Z'),
        status: 'Present',
        workingHours: 8.25,
      },
      {
        employee: employee._id,
        date: new Date('2026-04-28T00:00:00.000Z'),
        checkInTime: new Date('2026-04-28T09:45:00.000Z'),
        checkOutTime: new Date('2026-04-28T17:30:00.000Z'),
        status: 'Late',
        workingHours: 7.75,
      },
      {
        employee: employee._id,
        date: new Date('2026-04-29T00:00:00.000Z'),
        checkInTime: new Date('2026-04-29T00:00:00.000Z'),
        checkOutTime: new Date('2026-04-29T00:00:00.000Z'),
        status: 'On Leave',
        workingHours: 0,
        isLeaveDay: true,
      },
    ];

    for (const record of records) {
      const existing = await Attendance.findOne({ employee: employee._id, date: record.date });
      if (!existing) {
        await Attendance.create(record);
        console.log(`Attendance record created for ${record.date.toISOString().slice(0, 10)}`);
      } else {
        existing.checkInTime = record.checkInTime;
        existing.checkOutTime = record.checkOutTime;
        existing.status = record.status;
        existing.workingHours = record.workingHours;
        existing.isLeaveDay = !!record.isLeaveDay;
        await existing.save();
        console.log(`Attendance record updated for ${record.date.toISOString().slice(0, 10)}`);
      }
    }

    console.log('Attendance seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedAttendance();