// Query: Get Class Status on a specific day
const getClassStatus = `
  SELECT c.course_name, t.start_time, t.end_time, r.room_name, l.lecturer_name
  FROM Timetables t
  INNER JOIN ProgramCourses pc ON t.program_course_id = pc.program_course_id
  INNER JOIN Courses c ON pc.course_id = c.course_id
  INNER JOIN Rooms r ON t.room_id = r.room_id
  INNER JOIN LecturerCourses lc ON t.lecturer_course_id = lc.lecturer_course_id
  INNER JOIN Lecturers l ON lc.lecturer_id = l.lecturer_id
  INNER JOIN DaysOfWeek d ON t.day_id = d.day_id
  WHERE d.day_id = EXTRACT(DOW FROM CURRENT_DATE)::integer
    AND (t.start_time > CURRENT_TIME OR t.day_id <> (SELECT day_id FROM DaysOfWeek WHERE day_name = to_char(CURRENT_DATE, 'Day')))
  ORDER BY t.start_time ASC;
`;


module.exports = {
    getClassStatus,
};