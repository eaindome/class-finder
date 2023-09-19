/*// Query: Get Upcoming Class for the user
const upcomingClass = `
  SELECT c.course_name, t.start_time, t.end_time
  FROM timetables t
  INNER JOIN users u ON t.program_year_id = u.program_year_id
  INNER JOIN courses c ON t.course_id = c.course_id
  WHERE u.user_id = $1
    AND t.day_id = EXTRACT(DOW FROM $2::date)
    AND t.start_time > $3::time
  ORDER BY t.start_time ASC
  LIMIT 1;
`;*/

// Query: Get Upcoming Class for the user
const upcomingClass = `
  SELECT c.course_name, t.start_time, t.end_time
  FROM timetables t
  INNER JOIN users u ON t.program_year_id = u.program_year_id
  INNER JOIN courses c ON t.course_id = c.course_id
  INNER JOIN DaysOfWeek AS d ON d.day_id = t.day_id
  WHERE u.user_id = $1
    AND d.day_name = $2
    AND t.start_time > $3
  ORDER BY t.start_time ASC
  LIMIT 1;
`;

// Query: Get Timetable for the user
const getTimetable = `
  SELECT c.course_name, t.start_time, t.end_time
  FROM timetables t
  INNER JOIN users u ON t.program_year_id = u.program_year_id
  INNER JOIN courses c ON t.course_id = c.course_id
  INNER JOIN DaysOfWeek AS d ON d.day_id = t.day_id
  WHERE u.user_id = $1
    AND d.day_name = $2
  ORDER BY t.start_time ASC;
`;

module.exports = {
  upcomingClass,
  getTimetable,
};


