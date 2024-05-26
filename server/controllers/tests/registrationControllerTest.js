const nodemailer = require('nodemailer');
const registerUser = require('../controllers/registrationController').registerUser;

describe('registerUser', () => {
  it('should send a verification email', async () => {
    // Mock the nodemailer.createTransport function to use Mailtrap
    jest.spyOn(nodemailer, 'createTransport').mockReturnValue({
      sendMail: () => Promise.resolve({ message: 'Email sent' })
    });

    // Mock the request and response objects
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password',
        role: 'standard_user'
      },
      headers: {
        host: 'localhost'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Call the function
    await registerUser(req, res);

    // Check that the email was sent
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'your-mailtrap-user',
        pass: 'your-mailtrap-pass'
      }
    });
    expect(res.json).toHaveBeenCalledWith({ message: 'Registration successful!' });

    // Restore the original function
    jest.restoreAllMocks();
  });
});