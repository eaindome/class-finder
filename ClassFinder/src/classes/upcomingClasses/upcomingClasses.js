const moment = require('moment');
const pool = require('../../../database');
const queries = require('./queries');

// Endpoint: Get Upcoming Class
const getUpcomingClass = async (req, res) => {
  try {
    // Check if the user is authenticated (session validation)
    if (!req.session.userid) {
      return res.status(401).json({ error: 'User not logged in' });
    }

    const userId = req.session.userid;

    // Get the current date and time in GMT
    const currentDate = moment().utc().format('YYYY-MM-DD');
    const currentTime = moment().utc().format('HH:mm');

    // Query the database to get the upcoming class for the user
    const upcomingClass = await pool.query(queries.upcomingClass, [userId, currentDate, currentTime]);

    if (upcomingClass.rowCount === 0) {
      return res.send('You are done for the day');
    }

    const classItem = upcomingClass.rows[0];

    // Check if the class is ongoing
    const isOngoing = moment(currentTime, 'HH:mm').isBetween(
      moment(classItem.start_time, 'HH:mm'),
      moment(classItem.end_time, 'HH:mm')
    );

    const status = isOngoing ? 'Ongoing' : 'Upcoming';

    return res.json({
      status,
      class: classItem.course_name,
      time: classItem.start_time,
    });
  } catch (error) {
    console.error('Error executing query: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getUpcomingClass,
};

/**
 * this check "
    if (upcomingClass.rowCount === 0) {
      return res.send('You are done for the day');
    }" returns a statement that's doesn't really work, can you add a check to that checks if its 
 */
