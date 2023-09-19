const pool = require('../../database');
const queries = require('./queries');

// Endpoint: Get Timetable for a User
const getTimetable = (req, res) => {
  // Assume the user information is stored in the request object after successful login
  // Check if the user is authenticated (session validation)
  if (!req.session.userid) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  const userId = req.session.userid;

  // Retrieve the user's timetable based on their program year
  pool.query(queries.getUserTimetableQuery, [userId], (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const timetable = results.rows;
    res.status(200).json({ timetable });
  });
};

module.exports = {
  getTimetable,
};
