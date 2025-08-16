const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validatePasswordReset,
  validateNewPassword,
  handleValidationErrors
} = require('../middleware/validation');

router.post('/register', 
  upload.single('profileImage'),
  validateRegistration,
  handleValidationErrors,
  authController.register
);

router.get('/verify-email', authController.verifyEmail);

router.post('/login',
  validateLogin,
  handleValidationErrors,
  authController.login
);

router.post('/refresh-token', authController.refreshToken);

router.post('/forgot-password',
  validatePasswordReset,
  handleValidationErrors,
  authController.forgotPassword
);

router.post('/reset-password',
  validateNewPassword,
  handleValidationErrors,
  authController.resetPassword
);

router.post('/logout', authenticateToken, authController.logout);

module.exports = router;