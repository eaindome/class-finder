const addFavorite = 'INSERT INTO Favorites (user_id, room_id) VALUES ($1, $2)';
const addBookmark = 'INSERT INTO Bookmarks (user_id, room_id) VALUES ($1, $2)';

module.exports = {
  addFavorite,
  addBookmark,
};

