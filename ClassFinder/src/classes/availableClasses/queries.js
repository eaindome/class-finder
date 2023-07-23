const pool = require('../../../database');

// Retrieve available lecture rooms from the database
const getAvailableLectureRooms = async () => {
  try {
    const query = `
      SELECT
        room_name,
        room_capacity,
        status,
        location,
        CURRENT_TIMESTAMP AS current_time
      FROM
        Rooms AS r
      WHERE
        status = 'Available';
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAvailableLectureRooms,
};
