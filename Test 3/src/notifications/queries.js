const db = require('../../database');

// Update the notification preference for a user
async function updateNotificationPreference(userId, preference) {
  const query = 'UPDATE Users SET notification_preference = $1 WHERE user_id = $2';
  const values = [preference, userId];
  await db.query(query, values);
}

// Get all users with notification preference enabled
async function getUsersWithNotificationPreference() {
  const query = 'SELECT * FROM Users WHERE notification_preference = true';
  const result = await db.query(query);
  return result.rows;
}

// Get the next upcoming class timetable for a program year
async function getNextClassTimetable(programYearId) {
  const currentDate = new Date();
  const query = `
    SELECT * FROM Timetables
    WHERE program_year_id = $1
      AND start_time >= $2
    ORDER BY start_time ASC
    LIMIT 1
  `;
  const values = [programYearId, currentDate];
  const result = await db.query(query, values);
  return result.rows[0];
}

// Get the status of a room
async function getRoomStatus(roomId) {
  const query = 'SELECT status FROM Rooms WHERE room_id = $1';
  const values = [roomId];
  const result = await db.query(query, values);
  return result.rows[0].status;
}

// Update the device token for a user
async function updateDeviceToken(userId, deviceToken) {
  const query = 'UPDATE Users SET device_token = $1 WHERE user_id = $2';
  const values = [deviceToken, userId];
  await db.query(query, values);
}

module.exports = {
  updateNotificationPreference,
  getUsersWithNotificationPreference,
  getNextClassTimetable,
  getRoomStatus,
  updateDeviceToken,
};
