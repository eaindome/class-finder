const queries = require('./queries');
const { sendPushNotification } = require('./pushNotifications');

// Endpoint for updating notification preference
async function updateNotificationPreference(req, res) {
  // Check if the user is authenticated (session validation)
  if (!req.session.userid) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  const { preference } = req.body;
  const userId = req.session.userid;

  try {
    await queries.updateNotificationPreference(userId, preference);
    res.status(200).json({ message: 'Notification preference updated successfully.' });
  } catch (error) {
    console.error('Error updating notification preference:', error);
    res.status(500).json({ error: 'An error occurred while updating notification preference.' });
  }
}

// Function to check and send notifications for upcoming classes
async function sendNotificationsForUpcomingClasses() {
  try {
    const users = await queries.getUsersWithNotificationPreference();

    for (const user of users) {
      // Check if the user is authenticated (session validation)
      if (!user.sessionid) {
        //console.log(`User ${user.user_id} not logged in. Skipping notification.`);
        continue;
      }

      const timetable = await queries.getNextClassTimetable(user.programYearId);

      if (timetable) {
        // Check if the session ID matches the user's current session ID
        if (user.sessionid !== user.currentsessionid) {
          console.log(`User ${user.user_id} session expired. Skipping notification.`);
          continue;
        }

        const currentDate = new Date();
        const classStartTime = new Date(currentDate);
        classStartTime.setHours(timetable.start_time.getHours(), timetable.start_time.getMinutes(), 0, 0);

        // Send notification 15 minutes before the class start time
        const notificationTime = new Date(classStartTime.getTime() - 30 * 60000);
        if (currentDate < notificationTime) {
          sendPushNotification(user.deviceToken, 'Upcoming Class', 'Your class will start in 30 minutes.');
        }

        // Send notification 5 minutes before the class start time if the room is unavailable
        const roomStatus = await queries.getRoomStatus(timetable.room_id);
        const roomUnavailable = roomStatus === 'unavailable';

        const cancellationTime = new Date(classStartTime.getTime() - 5 * 60000);
        if (currentDate < cancellationTime && roomUnavailable) {
          sendPushNotification(user.deviceToken, 'Class Cancellation', 'Your class has been cancelled.');
        }
      }
    }
  } catch (error) {
    console.error('Error sending notifications for upcoming classes:', error);
  }
}

// Endpoint for receiving the device token
async function receiveDeviceToken(req, res) {
  // Check if the user is authenticated (session validation)
  if (!req.session.userid) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  const { deviceToken } = req.body;
  const userId = req.session.userid;

  try {
    await queries.updateDeviceToken(userId, deviceToken);
    res.status(200).json({ message: 'Device token received and stored successfully' });
  } catch (error) {
    console.error('Error storing device token:', error);
    res.status(500).json({ error: 'An error occurred while storing the device token' });
  }
}

module.exports = {
  updateNotificationPreference,
  sendNotificationsForUpcomingClasses,
  receiveDeviceToken,
};

