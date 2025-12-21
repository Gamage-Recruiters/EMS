import AvailabilityCache from '../models/AvailabilityCache.js';
import Attendance from '../models/Attendance.js';

const TTL_HOURS = 12;

/**
 * POST /api/availability
 * Set AVAILABLE / UNAVAILABLE
 */
export const setAvailability = async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!['AVAILABLE', 'UNAVAILABLE'].includes(status)) {
      return res.status(400).json({ message: 'Invalid availability status' });
    }

    // Check if employee is checked in and NOT checked out
    const attendance = await Attendance.findOne({
      employee: req.user._id,
      checkInTime: { $exists: true },
      checkOutTime: { $exists: false },
    });

    if (!attendance) {
      return res.status(403).json({
        message: 'You must be checked in to update availability',
      });
    }

    const expiresAt = new Date(
      Date.now() + TTL_HOURS * 60 * 60 * 1000
    );

    const availability = await AvailabilityCache.findOneAndUpdate(
      { user: req.user._id },
      {
        status,
        reason: reason || '',
        lastUpdatedAt: new Date(),
        expiresAt,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: 'Availability updated successfully',
      availability,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/availability/me
 */
export const getMyAvailability = async (req, res) => {
  try {
    const availability = await AvailabilityCache.findOne({
      user: req.user._id,
    });

    res.status(200).json(
      availability || { status: 'UNAVAILABLE' }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/availability/team
 */
export const getTeamAvailability = async (req, res) => {
  try {
    const availabilityList = await AvailabilityCache.find()
      .populate(
        'user',
        'firstName lastName role department designation'
      )
      .sort({ lastUpdatedAt: -1 });

    res.status(200).json(availabilityList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Utility: Clear availability on checkout
 */
export const clearAvailabilityOnCheckout = async (userId) => {
  await AvailabilityCache.findOneAndDelete({ user: userId });
};
