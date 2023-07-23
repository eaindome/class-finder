const getResetToken = 'SELECT token, expiration FROM ResetTokens WHERE user_id = $1';

const updatePassword = async (email, password) => {
  try {
    await pool.query('UPDATE Users SET password = $1 WHERE email = $2', [password, email]);
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = 'SELECT * FROM Users WHERE email = $1'

const saveResetToken = 'INSERT INTO ResetTokens (user_id, token, expiration) VALUES ($1, $2, $3)';

module.exports = {
  getResetToken,
  updatePassword,
  saveResetToken,
  getUserByEmail,
};
