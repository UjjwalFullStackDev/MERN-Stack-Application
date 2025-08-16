const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/profile', authenticateToken, userController.getProfile);

router.put('/profile',
  authenticateToken,
  upload.single('profileImage'),
  userController.updateProfile
);

router.get('/', authenticateToken, userController.getAllUsers);

router.get('/:id', authenticateToken, userController.getUserById);

router.delete('/:id',
  authenticateToken,
  authorizeRole('admin'),
  userController.deleteUser
);

module.exports = router;