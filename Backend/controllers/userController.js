const { Op } = require('sequelize');
const User = require('../models/User');
const redisClient = require('../config/redis');

const getProfile = async (req, res) => {
  try {
    // Try to get from cache first
    const cachedUser = await redisClient.get(`user_${req.user.id}`);
    
    if (cachedUser) {
      return res.json({ user: JSON.parse(cachedUser) });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'emailVerificationToken', 'passResetToken', 'passResetExpires'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cache the user data
    await redisClient.setEx(`user_${user.id}`, 3600, JSON.stringify(user));

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    
    if (req.file) {
      user.profileImage = req.file.filename;
    }

    await user.save();

    // Update cache
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    };
    
    await redisClient.setEx(`user_${user.id}`, 3600, JSON.stringify(userData));

    res.json({
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    // search condition
    const whereClause = search ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    // Try to get from cache first
    const cacheKey = `users_${page}_${limit}_${search}`;
    const cachedResult = await redisClient.get(cacheKey);
    
    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password', 'emailVerificationToken', 'passResetToken', 'passResetExpires'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);
    
    const result = {
      users: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers: count,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };

    // Cache result for 5 minutes
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));

    res.json(result);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to get from cache first
    const cachedUser = await redisClient.get(`user_${id}`);
    
    if (cachedUser) {
      return res.json({ user: JSON.parse(cachedUser) });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'emailVerificationToken', 'passResetToken', 'passResetExpires'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cache user data
    await redisClient.setEx(`user_${user.id}`, 3600, JSON.stringify(user));

    res.json({ user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    
    // Remove from cache
    await redisClient.del(`user_${id}`);
    
    // Clear users list cache
    const keys = await redisClient.keys('users_*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser
};