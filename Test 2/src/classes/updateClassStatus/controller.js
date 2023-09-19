const pool = require('../../../database');
const queries = require('./queries');

// Endpoint: Update Class Status
const updateClassStatus = async () => {
  const currentDay = new Date().getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)

  // Check if it's Sunday (0) or Saturday (6)
  if (currentDay === 0 || currentDay === 6) {
    // If it's Sunday or Saturday, set the class status to "Empty" for all timetables
    await pool.query(queries.updateAllClassStatus, ['Empty']);
    return;
  }

  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false }); // Get the current time in 24-hour format (e.g., "12:00:00")

  // Get the timetables that are currently ongoing
  const ongoingTimetables = await pool.query(queries.getOngoingTimetables, [currentDay, currentTime]);

  const ongoingTimetableIds = ongoingTimetables.rows.map((timetable) => timetable.timetable_id);

  if (ongoingTimetableIds.length > 0) {
    // Set the class status to "Ongoing" for the ongoing timetables
    await pool.query(queries.updateClassStatus, ['Ongoing', ongoingTimetableIds]);
  }

  // Get the timetables that are not ongoing
  const nonOngoingTimetables = await pool.query(queries.getNonOngoingTimetables, [currentDay, currentTime]);

  const nonOngoingTimetableIds = nonOngoingTimetables.rows.map((timetable) => timetable.timetable_id);

  if (nonOngoingTimetableIds.length > 0) {
    // Set the class status to "Empty" for the non-ongoing timetables
    await pool.query(queries.updateClassStatus, ['Empty', nonOngoingTimetableIds]);
  }

  // Log the updated class statuses
  console.log('Class statuses updated at:', currentTime);
};

module.exports = {
  updateClassStatus,
};
