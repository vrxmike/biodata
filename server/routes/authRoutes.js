const express = require('express');
const router = express.Router();

/**
 * Controller for handling authentication related operations.
 * @type {Object}
 */
const authController = require('../controllers/authController');

/**
 * Route for user login.
 * @name POST /login
 * @function
 * @memberof module:routes/authRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.post('/login', authController.login);

/**
 * Route for user logout.
 * @name POST /logout
 * @function
 * @memberof module:routes/authRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.post('/logout', authController.logout);

/**
 * Route for refreshing user token.
 * @name POST /refresh-token
 * @function
 * @memberof module:routes/authRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * Route for requesting password reset.
 * @name POST /request-password-reset
 * @function
 * @memberof module:routes/authRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.post('/request-password-reset', authController.requestPasswordReset);

/**
 * Route for resetting user password.
 * @name POST /reset-password
 * @function
 * @memberof module:routes/authRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.post('/reset-password', authController.resetPassword);

// Add other relevant auth routes here

module.exports = router;
