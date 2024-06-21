const express = require('express');
const router = express.Router();

/**
 * Controller for handling user-related operations.
 * @type {Object}
 */
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * Route for handling the request to update the user's email.
 * @name POST /request-email-update
 * @function
 * @memberof module:userRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
router.post('/request-email-update', authMiddleware, userController.requestEmailUpdate);

/**
 * Route for handling the verification of the email update request.
 * @name GET /verify-email-update/:token
 * @function
 * @memberof module:userRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
router.get('/verify-email-update/:token', authMiddleware, userController.verifyEmailUpdate);

module.exports = router;
