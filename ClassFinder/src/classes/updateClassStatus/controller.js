const pool = require('../../../database');
const queries = require('./queries');
const { manuallyUpdatedRoomIds } = require('../bookClass/controller'); // Import the manuallyUpdatedRoomIds array
const { getCurrentDay, getCurrentTime } = require('../ongoingClasses/utils');

// Update class status for multiple rooms
const updateClassStatus = async (status, roomIds) => {
  await pool.query(queries.updateClassStatus, [status, roomIds]);
};

// Update class status for all rooms
const updateAllClassStatus = async (status) => {
  await pool.query(queries.updateAllClassStatus, [status]);
};

// Update room statuses based on timetable data
const updateRoomStatuses = async () => {
  const currentDay = getCurrentDay();//new Date().getDay();
  //console.log(currentDay);
  const currentTime = getCurrentTime();//new Date().toLocaleTimeString('en-US', { timeZone: 'GMT', hour12: false });
  //console.log(currentTime);

  // Check if it's Sunday (0) or Saturday (6)
  if (currentDay === 'Sunday' || currentDay === 'Saturday') {
    // If it's Sunday or Saturday, set the class status to "Empty" for all rooms
    await updateAllClassStatus('Available');
    return;
  }

  // Get the ongoing timetables
  const ongoingTimetables = await pool.query(queries.getOngoingTimetables, [currentDay, currentTime]);
  const ongoingTimetableIds = ongoingTimetables.rows.map((timetable) => timetable.timetable_id);

  if (ongoingTimetableIds.length > 0) {
    // Set the class status to "Ongoing" for the ongoing timetables
    await updateClassStatus('Ongoing', ongoingTimetableIds.filter(id => !manuallyUpdatedRoomIds.includes(id)));
  }

  // Get the non-ongoing timetables
  const nonOngoingTimetables = await pool.query(queries.getNonOngoingTimetables, [currentDay, currentTime]);
  const nonOngoingTimetableIds = nonOngoingTimetables.rows.map((timetable) => timetable.timetable_id);

  if (nonOngoingTimetableIds.length > 0) {
    // Set the class status to "Available" for the non-ongoing timetables
    await updateClassStatus('Available', nonOngoingTimetableIds.filter(id => !manuallyUpdatedRoomIds.includes(id)));
  }

  // Log the updated class statuses
  console.log('Class statuses updated at:', currentTime);
};

// Automatically update room statuses at regular intervals
const interval = setInterval(async () => {
  await updateRoomStatuses();
}, 10 * 60 * 1000); // Update every 5 minutes or if you want for 1 minute (60000)

// Stop updating room statuses when the application exits
process.on('SIGINT', () => {
  clearInterval(interval);
  process.exit(0);
});



module.exports = {
  updateRoomStatuses,
};
