const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const cron = require('node-cron');
const pgSession =  require('connect-pg-simple')(session);
const pool = require('./database');
const admin = require('./src/Firebase Database/firebase');
const path = require('path');


// Import routes
const userRoutes = require('./src/user/routes');
const classStatus = require('./src/classes/classStatus/routes');
const upcomingClasses = require('./src/classes/upcomingClasses/routes');
const updateClassStatus = require('./src/classes/updateClassStatus/routes');
const bookClass = require('./src/classes/bookClass/routes');
const displayTimetable = require('./src/timetable/routes');
const ongoingSessions = require('./src/classes/ongoingClasses/routes');
const availableLectureRooms = require('./src/classes/availableClasses/routes');
const searchLectureRooms = require('./src/classes/searchClasses/routes');
const notificationRoutes = require('./src/notifications/routes');
const { sendNotificationsForUpcomingClasses } = require('./src/notifications/controller');
const favorites = require('./src/favourites/routes');
const forgotPassword = require('./src/user/userforgetpassword/routes');


const app = express();
const port = 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(bodyParser.json());

// Configure session
app.use(
    session({
        secret: 'your-secret-session',
        resave: false,
        saveUninitialized: false,
        store: new pgSession({
            pool: pool,
            tableName: 'session',   // Name of the table to store sessions
        }),
    })
);

// Configure Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected.');

    // Emit a custom event to the client
    socket.emit('customEvent', 'Hello from the server!');

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

// Set the views directory
app.set('views', path.join(__dirname, './views'));

// Set the view engine to use EJS
app.set('view engine', 'ejs');


// Mount routes
app.use("/api/v1/src/user", userRoutes);
app.use("/api/v1/src/classes/classStatus", classStatus);
app.use("/api/v1/src/classes/upcomingClasses", upcomingClasses);
app.use("/api/v1/src/classes/updateClassStatus", updateClassStatus);
app.use("/api/v1/src/classes/bookClass", bookClass);
app.use("/api/v1/src/timetable", displayTimetable);
app.use("/api/v1/src/classes/ongoingClasses", ongoingSessions);
app.use("/api/v1/src/classes/availableClasses", availableLectureRooms);
app.use("/api/v1/src/classes/searchClasses", searchLectureRooms);
app.use('/api/v1/src/notifications', notificationRoutes);
app.use("/api/v1/src/favourites", favorites);
app.use("/api/v1/src/user/userforgotpassword", forgotPassword);

// Set up the scheduled task
cron.schedule('* * * * *', sendNotificationsForUpcomingClasses);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
});

/*
// Trigger the class status update every 5 minutes (adjust the interval as needed)
setInterval(() => {
    // Import the controller function
    const { updateClassStatus } = require('./src/classes/updateClassStatus/controller');
  
    // Call the class status update function
    updateClassStatus();
  }, 
  5 * 60 * 1000); // 5 minutes interval
*/