// Update class status for multiple timetables
const updateClassStatus = `
  UPDATE ClassStatus SET status = $1 WHERE timetable_id = ANY($2);
`;

// Update class status for all timetables
const updateAllClassStatus = `
  UPDATE ClassStatus SET status = $1;
`;

// Get ongoing timetables based on current day and time
const getOngoingTimetables = `
  SELECT timetable_id FROM Timetables
  WHERE day_id = $1 AND start_time <= $2 AND end_time >= $2;
`;

// Get non-ongoing timetables based on current day and time
const getNonOngoingTimetables = `
  SELECT timetable_id FROM Timetables
  WHERE day_id = $1 AND (start_time > $2 OR end_time < $2);
`;

module.exports = {
    updateClassStatus,
    updateAllClassStatus,
    getOngoingTimetables,
    getNonOngoingTimetables,
};