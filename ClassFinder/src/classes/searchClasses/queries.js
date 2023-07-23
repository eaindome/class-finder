const pool = require('../../../database');

// Search for lecture rooms based on the provided query
const searchLectureRooms = async (query) => {
  try {
    const searchQuery = `
      SELECT
        room_name,
        room_capacity,
        status,
        location
      FROM
        Rooms
      WHERE
        status = 'Available' AND room_name ILIKE $1;
    `;
    const searchParam = `%${query}%`;
    const { rows } = await pool.query(searchQuery, [searchParam]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getAllAvailableLectureRooms = async () => {
  try {
    const searchQuery = `
      SELECT
        room_name,
        room_capacity,
        status,
        location
      FROM
        Rooms
      WHERE
        status = 'Available';
    `;
    const { rows } = await pool.query(searchQuery);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  searchLectureRooms,
  getAllAvailableLectureRooms,
};


