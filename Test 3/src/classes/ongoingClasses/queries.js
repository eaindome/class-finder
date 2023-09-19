const pool = require('../../../database');

const getOngoingSessions = async (currentDay, currentTime) => {
  try {
    const query = `
      SELECT
        room_name,
        course_name,
        start_time,
        end_time
      FROM
        (
          SELECT
            r.room_name,
            c.course_name,
            t.start_time,
            t.end_time
          FROM
            Timetables AS t
            JOIN Rooms AS r ON r.room_id = t.room_id
            JOIN Courses AS c ON c.course_id = t.course_id
            JOIN DaysOfWeek AS d ON d.day_id = t.day_id
          WHERE
            r.status = 'Ongoing'
            AND d.day_name = $1
        ) AS timetable_sessions
      UNION
      SELECT
        r.room_name,
        b.course_name,
        b.booking_time::time AS start_time,
        (b.booking_time + b.duration)::time AS end_time
      FROM
        Rooms AS r
        JOIN BookedClasses AS b ON r.room_id = b.room_id
      WHERE
        r.status = 'Ongoing'
        AND (
          date(b.booking_time) = date(current_timestamp)
          AND (b.booking_time::time) <= $2
          AND (b.booking_time::time) + b.duration::interval >= $2
        );
    `;
    const { rows } = await pool.query(query, [currentDay, currentTime]);
    return rows;
  } catch (error) {
    console.error(error); // Log the error
    throw error;
  }
};

module.exports = {
  getOngoingSessions,
};
