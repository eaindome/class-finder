const pool = require('../../../database');

// Retrieve available lecture rooms from the database
const getAvailableLectureRooms = async () => {
  try {
    const query = `
      SELECT
        r.room_name,
        CURRENT_TIMESTAMP AS current_time
      FROM
        rooms AS r
      WHERE
        r.status = 'Available';
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
