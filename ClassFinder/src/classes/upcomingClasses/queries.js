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
  SELECT c.course_name, t.start_time, t.end_time, l.lecturer_name, d.day_name
  FROM Timetables t
  INNER JOIN ProgramCourses pc ON t.program_course_id = pc.program_course_id
  INNER JOIN Courses c ON pc.course_id = c.course_id
  INNER JOIN LecturerCourses lc ON t.lecturer_course_id = lc.lecturer_course_id
  INNER JOIN Lecturers l ON lc.lecturer_id = l.lecturer_id
  INNER JOIN DaysOfWeek d ON t.day_id = d.day_id
  INNER JOIN ProgramYears py ON t.program_year_id = py.program_year_id
  INNER JOIN Users u ON py.program_year_id = u.program_year_id
  WHERE u.user_id = $1
    AND d.day_name = $2
    AND t.start_time > $3
  ORDER BY t.start_time ASC
  LIMIT 1;
`;

// Query: Get Timetable for the user
const getTimetable = `
  SELECT c.course_name, t.start_time, t.end_time, l.lecturer_name, d.day_name
  FROM Timetables t
  INNER JOIN ProgramCourses pc ON t.program_course_id = pc.program_course_id
  INNER JOIN Courses c ON pc.course_id = c.course_id
  INNER JOIN LecturerCourses lc ON t.lecturer_course_id = lc.lecturer_course_id
  INNER JOIN Lecturers l ON lc.lecturer_id = l.lecturer_id
  INNER JOIN DaysOfWeek d ON t.day_id = d.day_id
  INNER JOIN ProgramYears py ON t.program_year_id = py.program_year_id
  INNER JOIN Users u ON py.program_year_id = u.program_year_id
  WHERE u.user_id = $1
    AND d.day_name = $2
  ORDER BY t.start_time ASC;
`;

module.exports = {
  upcomingClass,
  getTimetable,
};


