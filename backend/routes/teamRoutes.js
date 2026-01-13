import express from 'express';
import {
  createTeam,
  addMemberToTeam,
  editTeamDetails,
  deleteTeam,
  getTeamByName,
  getAllTeams,
  getTeamById
} from '../controllers/teamController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all teams (accessible to all authenticated users)
router.get('/', protect, getAllTeams);

// Get team by name (accessible to all authenticated users)
router.get('/name/:teamName', protect, getTeamByName);

// Get team by ID (accessible to all authenticated users)
router.get('/:id', protect, getTeamById);

// Create a new team (CEO, SystemAdmin and TL only)
router.post('/', protect, authorize('CEO', 'SystemAdmin', 'TL'), createTeam);

// Add a member to a team (CEO, SystemAdmin and TL only)
router.put('/:id/add-member', protect, authorize('CEO', 'SystemAdmin', 'TL'), addMemberToTeam);

// Edit team details (CEO, SystemAdmin and TL only)
router.put('/:id', protect, authorize('CEO', 'SystemAdmin', 'TL'), editTeamDetails);

// Delete a team (CEO, SystemAdmin and TL only)
router.delete('/:id', protect, authorize('CEO', 'SystemAdmin', 'TL'), deleteTeam);

export default router;
