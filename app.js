const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Database connection pool
const pool = new Pool({
  connectionString: 'postgres://username:password@localhost:5432/db_name',
}); // I'll have to replace username, password, localhost, port number (5432) and db_name with database that'll be used

// Routes

// Get timetable for a specific user
app.get('/users/:userId/timetable', (req, res) => {
  const userId = parseInt(req.params.userId);

  pool.query(
    'SELECT * FROM "Timetable" WHERE "UserID" = $1',
    [userId],
    (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(results.rows);
      }
    }
  );
});

// Get status of classes
app.get('/classes/status', (req, res) => {
  pool.query('SELECT "TimetableID", "Status" FROM "Timetable"', (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(results.rows);
    }
  });
});

// Book an empty class room (for Class Reps)
app.post('/classes/book', (req, res) => {
  const { userId, roomId } = req.body;

  // Check if the user has the role of Class Rep
  // Replace with your actual logic to determine the user's role
  const isClassRep = true; // Sample logic

  if (!isClassRep) {
    res.status(403).json({ error: 'Forbidden: Only Class Reps can book class rooms' });
    return;
  }

  pool.query(
    'SELECT * FROM "Timetable" WHERE "LectureRoomID" = $1 AND "Status" <> $2',
    [roomId, 'cancelled'],
    (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (results.rowCount > 0) {
        res.status(400).json({ error: 'The class room is already booked' });
      } else {
        // Perform the necessary database operations to book the class room

        res.status(200).json({ message: 'Class room booked successfully' });
      }
    }
  );
});

// Report a cancelled class (for Class Reps)
app.post('/classes/report', (req, res) => {
  const { timetableId } = req.body;

  // Check if the user has the role of Class Rep
  // Replace with your actual logic to determine the user's role
  const isClassRep = true; // Sample logic

  if (!isClassRep) {
    res.status(403).json({ error: 'Forbidden: Only Class Reps can report cancelled classes' });
    return;
  }

  pool.query(
    'UPDATE "Timetable" SET "Status" = $1 WHERE "TimetableID" = $2',
    ['cancelled', timetableId],
    (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (results.rowCount === 0) {
        res.status(404).json({ error: 'Timetable not found' });
      } else {
        res.status(200).json({ message: 'Class reported as cancelled' });
      }
    }
  );
});

// Book an empty class room for studies (for Class Reps)
app.post('/classes/book-for-studies', (req, res) => {
  const { userId, roomId } = req.body;

  // Check if the user has the role of Class Rep
  // Replace with your actual logic to determine the user's role
  const isClassRep = true; // Sample logic

  if (!isClassRep) {
    res.status(403).json({ error: 'Forbidden: Only Class Reps can book class rooms' });
    return;
  }

  pool.query(
    'SELECT * FROM "Timetable" WHERE "LectureRoomID" = $1 AND "Status" <> $2',
    [roomId, 'cancelled'],
    (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (results.rowCount > 0) {
        res.status(400).json({ error: 'The class room is already booked' });
      } else {
        // Perform the necessary database operations to book the class room for studies

        res.status(200).json({ message: 'Class room booked for studies' });
      }
    }
  );
});

// Send notifications based on class status (for all users)
app.get('/users/:userId/notifications', (req, res) => {
  const userId = parseInt(req.params.userId);

  pool.query(
    'SELECT "TimetableID", "Status" FROM "Timetable" WHERE "UserID" = $1',
    [userId],
    (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const notifications = results.rows.map((row) => ({
          timetableId: row.TimetableID,
          status: row.Status,
          message: `Class ${row.TimetableID} is ${row.Status}`,
        }));

        res.status(200).json(notifications);
      }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
