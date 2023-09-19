const pool = require('../../database');
const queries = require('./queries');
const ical = require('ical-generator');
const fs = require('fs');

// Endpoint: Generate Calendar File
const generateCalendarFile = async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.session.userid) {
        return res.status(401).json({ error: 'User not logged in' });
      }
  
      const userId = req.session.userid;
  
      // Get the user's schedule
      const schedule = await getUserSchedule(userId);
  
      // Generate the iCal calendar
      const calendar = ical({
        domain: 'your-domain.com',
        prodId: { company: 'Your Company', product: 'Your Product', language: 'EN' },
        events: schedule,
      });
  
      // Set the response headers
      res.setHeader('Content-Type', 'text/calendar');
      res.setHeader('Content-Disposition', 'attachment; filename=calendar.ics');
  
      // Send the calendar file as a response
      res.send(calendar.toString());
    } catch (error) {
      console.error('Error generating calendar file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Helper function: Fetch user's schedule
const getUserSchedule = async (userId) => {
    try {
      // Fetch the user's program year ID
      const programYearIdQuery = await pool.query(queries.getUserProgramYearId, [userId]);
      const programYearId = programYearIdQuery.rows[0].program_year_id;
  
      // Fetch the user's schedule from the Timetables table
      const scheduleQuery = await pool.query(queries.getUserSchedule, [programYearId]);
      const schedule = scheduleQuery.rows;
  
      // Convert the schedule into iCal events
      const events = schedule.map((entry) => {
        return {
          start: entry.start_time,
          end: entry.end_time,
          summary: entry.course_name,
          description: entry.room_name,
          location: entry.room_name,
        };
      });
  
      return events;
    } catch (error) {
      throw error;
    }
};
  
module.exports = {
    generateCalendarFile,
    getUserSchedule,
};
  