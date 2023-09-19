const pool = require('../../../database');
const queries = require('../queries');

// Endpoint: Upcoming Classes
const upcomingClasses = (req, res) => {
  // Assume the user information is stored in the request object after successful login
  // Check if the user is authenticated (session validation)
  if (!req.session.userid) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  const userId = req.session.userid;

  // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
  const currentDay = new Date().getDay();

  // Check if it's Sunday (0) or Saturday (6)
  if (currentDay === 0 || currentDay === 6) {
    // If it's Sunday or Saturday, return an empty response
    return res.status(204).json();
  }

  // Query the database to get the upcoming classes for the user
  pool.query(queries.upcomingClasses, [userId], (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const upcomingClasses = results.rows;

    // Check if there are no upcoming classes for the current day
    if (upcomingClasses.length === 0) {
      // Return an empty response
      return res.status(204).json();
    }

    // Return the upcoming classes as a response
    res.status(200).json(upcomingClasses);
  });
};

module.exports = {
  upcomingClasses,
};