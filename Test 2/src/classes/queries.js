// Query: Get upcoming Classes for the day
const upcomingClasses = `
                        SELECT c.course_name, t.start_time, t.end_time, r.room_name, d.day_name
                        FROM timetables t
                        INNER JOIN courses c ON t.course_id = c.course_id
                        INNER JOIN rooms r ON t.room_id = r.room_id
                        INNER JOIN daysofweek d ON t.day_id = d.day_id
                        WHERE t.program_year_id = (
                            SELECT program_year_id FROM Users WHERE user_id = $1
                        )
                        AND (
                            (d.day_id = EXTRACT(DOW FROM CURRENT_DATE) + 1 AND t.start_time > CURRENT_TIME)      -- Adding 1 to match day_id values
                            OR d.day_id > EXTRACT(DOW FROM CURRENT_DATE) + 1
                        )
                        ORDER BY d.day_id ASC, t.start_time ASC
                        LIMIT 1;
`;

// Query: Get Class Status on a specific day
const getClassStatus = `
                        SELECT c.course_name, t.start_time, t.end_time, r.room_name, l.lecturer_name
                        FROM timetables t
                        INNER JOIN courses c ON t.course_id = c.course_id
                        INNER JOIN rooms r ON t.room_id = r.room_id
                        INNER JOIN lecturers l ON t.lecturer_id = l.lecturer_id
                        INNER JOIN daysofweek d ON t.day_id = d.day_id
                        WHERE d.day_id = EXTRACT(DOW FROM CURRENT_DATE)::integer
                        AND (t.start_time > CURRENT_TIME OR t.day_id <> (SELECT day_id FROM daysofweek WHERE day_name = to_char(CURRENT_DATE, 'Day')))
                        ORDER BY t.start_time ASC;
`;

// Query: Check Class Availability
const checkClassAvailability = `
                                SELECT status
                                FROM ClassStatus
                                WHERE timetable_id = $1
`;

// Query: Book Class
const bookClass = `
                    INSERT INTO BookedClasses (timetable_id, user_id, booking_time)
                    VALUES ($1, $2, NOW())
`;


module.exports = {
    upcomingClasses,
    getClassStatus,
    checkClassAvailability,
    bookClass,
};