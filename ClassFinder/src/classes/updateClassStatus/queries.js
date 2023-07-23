// Update class status for multiple rooms
const updateClassStatus = `
  UPDATE Rooms SET status = $1 WHERE room_id = ANY($2);
`;

// Update class status for all rooms
const updateAllClassStatus = `
  UPDATE Rooms SET status = $1;
`;

// Get ongoing timetables based on current day and time
const getOngoingTimetables = `
  SELECT timetable_id FROM Timetables t
  JOIN DaysOfWeek AS d ON d.day_id = t.day_id
  WHERE d.day_name = $1 AND start_time <= $2 AND end_time >= $2;
`;

// Get non-ongoing timetables based on current day and time
const getNonOngoingTimetables = `
  SELECT timetable_id FROM Timetables t
  JOIN DaysOfWeek AS d ON d.day_id = t.day_id
  WHERE d.day_name = $1 AND (start_time > $2 OR end_time < $2);
`;

module.exports = {
    updateClassStatus,
    updateAllClassStatus,
    getOngoingTimetables,
    getNonOngoingTimetables,
};