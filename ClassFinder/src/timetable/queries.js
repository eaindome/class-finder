// Query to retrieve timetable for a specific user's program year
const getUserTimetableQuery = `
  SELECT 
      c.course_name,
      l.lecturer_name,
      r.room_name,
      t.start_time,
      t.end_time,
      d.day_name,
      prog.program_name,
      yr.year_name
  FROM
      Timetables t
      INNER JOIN ProgramYears py ON t.program_year_id = py.program_year_id
      INNER JOIN Programs prog ON py.program_id = prog.program_id
      INNER JOIN Years yr ON py.year_id = yr.year_id
      INNER JOIN ProgramCourses pc ON t.program_course_id = pc.program_course_id
      INNER JOIN Courses c ON pc.course_id = c.course_id
      INNER JOIN LecturerCourses lc ON t.lecturer_course_id = lc.lecturer_course_id
      INNER JOIN Lecturers l ON lc.lecturer_id = l.lecturer_id
      INNER JOIN Rooms r ON t.room_id = r.room_id
      INNER JOIN DaysOfWeek d ON t.day_id = d.day_id
      INNER JOIN Users u ON py.program_year_id = u.program_year_id
  WHERE
      u.user_id = $1;`
;

module.exports = {
  getUserTimetableQuery,
};
