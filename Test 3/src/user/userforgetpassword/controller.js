const pool = require('../../../database');
const queries = require('./queries');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { generateResetToken } = require('./utils');
const path = require('path');
const { renderResetPasswordPage } = require('../../../render');

/*
let email = '';
let resetToken = '';*/

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query(queries.getUserByEmail, [email]);
    if (user.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = generateResetToken();
    console.log('Email:', email);
    console.log('Token:', resetToken);

    await saveResetToken(user.rows[0].user_id, resetToken);

    // Send the email with the reset instructions
    sendResetEmail(email, resetToken);

    // Render the reset password page with the email and reset token values
    renderResetPasswordPage(req, res, email, resetToken);

    //res.status(200).json({ message: 'Password reset instructions sent' });
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const confirmResetToken = async (req, res) => {
  const { email, token } = req.params;

  try {
    const isValidToken = await validateResetToken(email, token);
    if (!isValidToken) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    res.redirect(`/reset-password/${encodeURIComponent(email)}/${encodeURIComponent(token)}`);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const validateResetToken = async (email, token) => {
  try {
    const user = await pool.query(queries.getUserByEmail, [email]);
    if (user.rowCount === 0) {
      return false;
    }

    const { user_id } = user.rows[0];

    const resetTokenData = await pool.query(queries.getResetToken, [user_id]);
    if (resetTokenData.rowCount === 0) {
      return false;
    }

    const { token: storedToken, expiration } = resetTokenData.rows[0];

    if (storedToken !== token) {
      return false;
    }

    const currentTime = new Date().getTime();
    if (currentTime > expiration.getTime()) {
      return false;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

const updatePassword = async (email, newPassword) => {
  try {
    await pool.query(queries.updatePassword, [newPassword, email]);
  } catch (error) {
    throw error;
  }
};

const saveResetToken = async (userId, resetToken) => {
  try {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    await pool.query(queries.saveResetToken, [userId, resetToken, expiration]);
  } catch (error) {
    throw error;
  }
};

const sendResetEmail = (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'eaindome@gmail.com',
      pass: 'vtjbnnzhtmemsjcc',
    },
    secure: true,
  });

  const resetPasswordUrl = `https://eaindome.github.io/Reset-webpage/reset-password.ejs?email=${email}&token=${resetToken}`;

  const mailOptions = {
    from: 'eaindome@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `Click on the link below to reset your password:\n\n${resetPasswordUrl}`,
    html: `<p>Click on the link below to reset your password:</p><p><a href="${resetPasswordUrl}">Reset Password</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending reset email:', error);
    } else {
      console.log('Reset email sent:', info.response);
    }
  });
};

const resetPasswordPage = async (req, res) => {
  const { email, token } = req.params;

  try {
    const user = await pool.query(queries.getUserByEmail, [email]);
    if (user.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetTokenData = await pool.query(queries.getResetToken, [user.rows[0].user_id]);
    if (resetTokenData.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    const { token: storedToken } = resetTokenData.rows[0];

    if (storedToken !== token) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    res.render('reset-password', { email, token });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const resetPassword = async (req, res) => {
  const { email, token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    const isValidToken = await validateResetToken(email, token);
    if (!isValidToken) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await updatePassword(email, hashedPassword);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  forgotPassword,
  confirmResetToken,
  resetPasswordPage,
  resetPassword,
  updatePassword,
};




// vtjbnnzhtmemsjcc
/*
const resetPassword = async (req, res) => {
  const { email, token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    const isValidToken = await validateResetToken(email, token);
    if (!isValidToken) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await updatePassword(email, hashedPassword);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};*/