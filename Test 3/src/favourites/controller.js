const pool = require('../../database');
const queries = require('./queries');

// Endpoint: Favorite a Room
const favoriteRoom = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.userid) {
      return res.status(401).json({ error: 'User not logged in' });
    }

    const userId = req.session.userid;
    const { room_id } = req.body;

    // Insert a new favorite record into the Favorites table
    await pool.query(queries.addFavorite, [userId, room_id]);

    res.status(200).json({ message: 'Room favorited successfully' });
  } catch (error) {
    console.error('Error favoriting room:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Endpoint: Bookmark a Room
const bookmarkRoom = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.userid) {
      return res.status(401).json({ error: 'User not logged in' });
    }

    const userId = req.session.userid;
    const { room_id } = req.body;

    // Insert a new bookmark record into the Bookmarks table
    await pool.query(queries.addBookmark, [userId, room_id]);

    res.status(200).json({ message: 'Room bookmarked successfully' });
  } catch (error) {
    console.error('Error bookmarking room:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  favoriteRoom,
  bookmarkRoom,
};

  