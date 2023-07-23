const { getOngoingSessions } = require('./queries');
const { getCurrentDay, getCurrentTime } = require('./utils'); 
const moment = require('moment');

// Get all ongoing sessions
const getAllOngoingSessions = async (req, res) => {
  try {
    const currentDay = getCurrentDay();
    const currentTime = getCurrentTime();

    const ongoingSessions = await getOngoingSessions(currentDay, currentTime);
    res.json(ongoingSessions);
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: 'An error occurred while fetching ongoing sessions.' });
  }
};


module.exports = {
  getAllOngoingSessions,
};

