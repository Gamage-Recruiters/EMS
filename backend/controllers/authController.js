import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AppError from '../utils/AppError.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
  return { accessToken, refreshToken };
};


// Register a new user 

export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return next(new AppError('User already exists', 400));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword, 
      role: 'Unassigned',
    });

    if (user) {
      const tokens = generateTokens(user._id);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    }
  } catch (error) {
    next(error);
  }
};


//  User Login

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;

    if (isMatch) {
      const tokens = generateTokens(user._id);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } else {
      return next(new AppError('Invalid email or password', 401));
    }
  } catch (error) {
    next(error);
  }
};

// Google Auth

export const googleAuth = async (req, res, next) => {
  try {
    const { tokenId } = req.body; 
    
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    // Google provides given_name and family_name
    const { given_name, family_name, email, sub: googleId, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
      }
    } else {
      user = await User.create({
        firstName: given_name,
        lastName: family_name || '', 
        email,
        googleId,
        password: '', 
        role: 'Unassigned',
        profileImage: picture
      });
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

  } catch (error) {
    console.error(error); 
    next(new AppError('Google Authentication Failed', 400));
  }
};

// Refresh Access Token

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new AppError('No refresh token found', 401));

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError('Invalid refresh token', 403));
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken; 
    await user.save();

    res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
  } catch (error) {
    next(new AppError('Invalid refresh token', 403));
  }
};

// Update User Profile Image

export const uploadProfileImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError('User not found', 404));

    user.profileImage = `/${req.file.path.replace(/\\/g, '/')}`; 
    await user.save();

    res.json({ message: 'Image uploaded', filePath: user.profileImage });
  } catch (error) {
    next(error);
  }
};

// Assign Role 

export const assignRole = async (req, res, next) => {
    try {
        const { userId, newRole } = req.body;
        const actorRole = req.user.role;

        if (actorRole !== 'CEO' && actorRole !== 'SystemAdmin' && actorRole !== 'TL') {
            return next(new AppError('Not authorized to assign roles', 403));
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) return next(new AppError('User not found', 404));

        if (actorRole === 'TL') {
            if (targetUser.role !== 'Unassigned') {
                return next(new AppError('TL can only assign roles to Unassigned users', 403));
            }
            
        }
        if (actorRole === 'TL') {
             
             if (targetUser.role === 'CEO') {
                 return next(new AppError('TL cannot modify CEO role', 403));
             }
        }

        targetUser.role = newRole;
        await targetUser.save();
        res.json({ message: `User role updated to ${newRole}` });

    } catch (error) {
        next(error);
    }
}


// Update User Profile and Auto Refresh Token

export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update basic fields
      if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
      if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
      if (req.body.email !== undefined) user.email = req.body.email;

      // Update contact information
      if (req.body.contactNumber !== undefined) user.contactNumber = req.body.contactNumber;
      if (req.body.address !== undefined) user.address = req.body.address;
      if (req.body.city !== undefined) user.city = req.body.city;

      // Update education information
      if (req.body.education !== undefined) {
        if (req.body.education.institution !== undefined) user.education.institution = req.body.education.institution;
        if (req.body.education.department !== undefined) user.education.department = req.body.education.department;
        if (req.body.education.degree !== undefined) user.education.degree = req.body.education.degree;
        if (req.body.education.location !== undefined) user.education.location = req.body.education.location;
        if (req.body.education.startDate !== undefined) user.education.startDate = req.body.education.startDate ? new Date(req.body.education.startDate) : null;
        if (req.body.education.endDate !== undefined) user.education.endDate = req.body.education.endDate ? new Date(req.body.education.endDate) : null;
      }

      // Handle Password Update
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      // AUTO-REFRESH
      const tokens = generateTokens(user._id);

      // Update the refresh token in the database
      user.refreshToken = tokens.refreshToken;

      const updatedUser = await user.save();

      
      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        contactNumber: updatedUser.contactNumber,
        address: updatedUser.address,
        city: updatedUser.city,
        education: updatedUser.education,
        accessToken: tokens.accessToken,   
        refreshToken: tokens.refreshToken, 
      });
    } else {
      return next(new AppError('User not found', 404));
    }
  } catch (error) {
    next(error);
  }
};



// Delete User Profile 

export const deleteUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed successfully' });
    } else {
      return next(new AppError('User not found', 404));
    }
  } catch (error) {
    next(error);
  }
};