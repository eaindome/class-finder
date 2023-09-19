// Query: Get User's program year id
const getUserProgramYearId = 'SELECT program_year_id FROM Users WHERE user_id = $1';

// Query: Get User's Schedule
const getUserSchedule = `
  SELECT t.start_time, t.end_time, c.course_name, r.room_name
  FROM Timetables t
  INNER JOIN Courses c ON t.course_id = c.course_id
  INNER JOIN Rooms r ON t.room_id = r.room_id
  WHERE t.program_year_id = $1;
`;

module.exports = {
  getUserProgramYearId,
  getUserSchedule,
};
