const { searchLectureRooms, getAllAvailableLectureRooms } = require('./queries');

// Search for lecture rooms
const searchRooms = async (req, res) => {
  try {
    const { query } = req.query;
    let lectureRooms;
    
    if (!query) {
      lectureRooms = await getAllAvailableLectureRooms();
    } else {
      lectureRooms = await searchLectureRooms(query);
    }

    res.json(lectureRooms);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for lecture rooms.' });
  }
};

module.exports = {
  searchRooms,
};


