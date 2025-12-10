import Team from '../models/Team.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

// @desc    Create a new team
// @route   POST /api/team
// @access  Private (CEO, TL)
export const createTeam = async (req, res, next) => {
  try {
    const { teamName, description, teamLead, members } = req.body;

    // Check if team name already exists
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return next(new AppError('Team with this name already exists', 400));
    }

    // Verify team lead exists and has appropriate role
    const teamLeadUser = await User.findById(teamLead);
    if (!teamLeadUser) {
      return next(new AppError('Team lead user not found', 404));
    }

    if (!['CEO', 'TL', 'ATL'].includes(teamLeadUser.role)) {
      return next(new AppError('Team lead must have CEO, TL, or ATL role', 400));
    }

    // Verify all members exist if members array is provided
    if (members && members.length > 0) {
      const memberUsers = await User.find({ _id: { $in: members } });
      if (memberUsers.length !== members.length) {
        return next(new AppError('One or more member users not found', 404));
      }
    }

    // Create the team
    const team = await Team.create({
      teamName,
      description,
      teamLead,
      members: members || []
    });

    // Populate team lead and members before sending response
    await team.populate('teamLead', 'firstName lastName email role');
    await team.populate('members', 'firstName lastName email role');

    res.status(201).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new member to a team
// @route   PUT /api/team/:id/add-member
// @access  Private (CEO, TL)
export const addMemberToTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;

    if (!memberId) {
      return next(new AppError('Member ID is required', 400));
    }

    // Find the team
    const team = await Team.findById(id);
    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    // Verify member exists
    const member = await User.findById(memberId);
    if (!member) {
      return next(new AppError('User not found', 404));
    }

    // Check if member is already in the team
    if (team.members.includes(memberId)) {
      return next(new AppError('User is already a member of this team', 400));
    }

    // Add member to team
    team.members.push(memberId);
    await team.save();

    // Populate team lead and members before sending response
    await team.populate('teamLead', 'firstName lastName email role');
    await team.populate('members', 'firstName lastName email role');

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit team details
// @route   PUT /api/team/:id
// @access  Private (CEO, TL)
export const editTeamDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teamName, description, teamLead, members } = req.body;

    // Find the team
    const team = await Team.findById(id);
    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    // If teamName is being updated, check for duplicates
    if (teamName && teamName !== team.teamName) {
      const existingTeam = await Team.findOne({ teamName });
      if (existingTeam) {
        return next(new AppError('Team with this name already exists', 400));
      }
      team.teamName = teamName;
    }

    // Update description if provided
    if (description !== undefined) {
      team.description = description;
    }

    // If teamLead is being updated, verify the user exists and has appropriate role
    if (teamLead && teamLead !== team.teamLead.toString()) {
      const teamLeadUser = await User.findById(teamLead);
      if (!teamLeadUser) {
        return next(new AppError('Team lead user not found', 404));
      }
      if (!['CEO', 'TL', 'ATL'].includes(teamLeadUser.role)) {
        return next(new AppError('Team lead must have CEO, TL, or ATL role', 400));
      }
      team.teamLead = teamLead;
    }

    // If members are being updated, verify all members exist
    if (members) {
      const memberUsers = await User.find({ _id: { $in: members } });
      if (memberUsers.length !== members.length) {
        return next(new AppError('One or more member users not found', 404));
      }
      team.members = members;
    }

    // Save the updated team
    await team.save();

    // Populate team lead and members before sending response
    await team.populate('teamLead', 'firstName lastName email role');
    await team.populate('members', 'firstName lastName email role');

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a team
// @route   DELETE /api/team/:id
// @access  Private (CEO, TL)
export const deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);
    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    await Team.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team details by team name
// @route   GET /api/team/name/:teamName
// @access  Private
export const getTeamByName = async (req, res, next) => {
  try {
    const { teamName } = req.params;

    const team = await Team.findOne({ teamName })
      .populate('teamLead', 'firstName lastName email role profileImage')
      .populate('members', 'firstName lastName email role profileImage');

    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teams
// @route   GET /api/team
// @access  Private
export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find()
      .populate('teamLead', 'firstName lastName email role profileImage')
      .populate('members', 'firstName lastName email role profileImage')
      .sort({ createdDate: -1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single team by ID
// @route   GET /api/team/:id
// @access  Private
export const getTeamById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id)
      .populate('teamLead', 'firstName lastName email role profileImage')
      .populate('members', 'firstName lastName email role profileImage');

    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};
