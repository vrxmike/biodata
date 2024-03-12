const express = require('express');
const router = express.Router();

/**
 * Controller for registration functionality.
 * @type {Object}
 */
const registrationController = require('../controllers/registrationController');

/**
 * Route for registering a new user.
 * @name POST /register
 * @function
 * @memberof module:routes/registrationRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
router.post('/register', registrationController.registerUser);

/**
 * Route for verifying email.
 * @name GET /verify-email
 * @function
 * @memberof module:routes/registrationRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
router.get('/verify-email', registrationController.verifyEmail);

/**
 * Route for getting a user and their profile.
 * @name GET /user/:userId
 * @function
 * @memberof module:routes/registrationRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
router.get('/user/:userId', registrationController.getUserAndProfile);

/**
 * Route for deleting a user and their profile.
 * @name DELETE /user/:userId
 * @function
 * @memberof module:routes/registrationRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
router.delete('/user/:userId', registrationController.deleteUserAndProfile);

module.exports = router;
