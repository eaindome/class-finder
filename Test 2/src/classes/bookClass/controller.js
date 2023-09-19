const pool = require('../../../database');
const queries = require('./queries');

// Endpoint: Book a Class
const bookClass = (req, res) => {
  // Assume the user information is stored in the request object after successful login
  // Check if the user is authenticated (session validation)
  if (!req.session.userid) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  const userId = req.session.userid;
  const timetableId = req.params.timetableId;
  const bookingTime = new Date(); // Get the current booking time

  // Verify the user's role is "Class Rep"
  pool.query(queries.getUserRole, [userId], (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const userRole = results.rows[0].role;

    if (userRole !== 'Class Rep') {
      return res.status(403).json({ error: 'Access denied. Only Class Reps can book classes.' });
    }

    // Check if the class is available
    pool.query(queries.getClassStatus, [timetableId], (error, results) => {
      if (error) {
        console.error('Error executing query: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const classStatus = results.rows[0].status;

      if (classStatus !== 'Empty') {
        return res.status(409).json({ error: 'The class is not available for booking.' });
      }

      // Update the class status to "Booked" and save the booking time
      pool.query(queries.updateClassStatus, ['Booked', timetableId], (error, results) => {
        if (error) {
          console.error('Error executing query: ', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Set a timer to automatically change the class status to "Ongoing" after 5 minutes
        setTimeout(() => {
          // Check if the class status is still "Booked" before updating it to "Ongoing"
          pool.query(queries.getClassStatus, [timetableId], (error, results) => {
            if (error) {
              console.error('Error executing query: ', error);
            }

            const currentStatus = results.rows[0].status;

            if (currentStatus === 'Booked') {
              pool.query(queries.updateClassStatus, ['Ongoing', timetableId], (error, results) => {
                if (error) {
                  console.error('Error executing query: ', error);
                }
              });
            }
          });
        }, 5 * 60 * 1000); // 5 minutes (converted to milliseconds)

        // Return a success response with booking information
        res.status(200).json({ message: 'Class booked successfully.', bookingTime });
      });
    });
  });
};


module.exports = {
  bookClass,
};

