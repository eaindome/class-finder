const { getAvailableLectureRooms } = require('./queries');

// Get all available lecture rooms
const getAllAvailableLectureRooms = async (req, res) => {
  try {
    const availableLectureRooms = await getAvailableLectureRooms();
    res.json(availableLectureRooms);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching available lecture rooms.' });
  }
};

module.exports = {
  getAllAvailableLectureRooms,
};
