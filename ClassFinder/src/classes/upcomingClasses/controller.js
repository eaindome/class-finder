const moment = require('moment');
const pool = require('../../../database');
const queries = require('./queries');
const { getCurrentDay, getCurrentTime } = require('../ongoingClasses/utils'); 

// Endpoint: Get Upcoming Class
const getUpcomingClass = async (req, res) => {
  try {
    // Check if the user is authenticated (session validation)
    if (!req.session.userid) {
      return res.status(401).json({ error: 'User not logged in' });
    }

    const userId = req.session.userid;

    // Get the current date and time
    const currentDate = getCurrentDay();
    const currentTime = getCurrentTime();

    // Query the database to get the user's timetable for the day
    const timetable = await pool.query(queries.getTimetable, [userId, currentDate]);

    if (timetable.rowCount === 0) {
      return res.send('You have no classes scheduled for today');
    }

    const firstClassTime = moment(timetable.rows[0].start_time, 'HH:mm');
    const lastClassTime = moment(timetable.rows[timetable.rowCount - 1].end_time, 'HH:mm');

    let status, classItem;

    // Check if the current time is within the range of the first and last class on the timetable
    if (moment(currentTime, 'HH:mm').isBetween(firstClassTime, lastClassTime)) {
      // Query the database to get the upcoming class for the user
      const upcomingClass = await pool.query(queries.upcomingClass, [userId, currentDate, currentTime]);

      if (upcomingClass.rowCount === 0) {
        // If no upcoming class, set the classItem to the next class in the timetable
        classItem = timetable.rows[0];
        status = 'Upcoming';
      } else {
        classItem = upcomingClass.rows[0];
        status = 'Ongoing';
      }
    } else {
      // User is done for the day
      return res.send('You are done for the day');
    }

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


