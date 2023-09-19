// Get the user's role
const getUserRole = `
  SELECT role FROM Users WHERE user_id = $1;
`;

// Get the class status for a specific timetable
const getClassStatus = `
  SELECT status FROM ClassStatus WHERE timetable_id = $1;
`;

// Update the class status for a specific timetable
const updateClassStatus = `
  UPDATE ClassStatus SET status = $1 WHERE timetable_id = $2;
`;

module.exports = {
    getUserRole,
    getClassStatus,
    updateClassStatus,
};