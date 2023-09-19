const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const userRoutes = require('./src/user/routes');
const classRoutes = require('./src/classes/routes');
const classStatus = require('./src/classes/classStatus/routes');
const upcomingClasses = require('./src/classes/upcomingClasses/routes');
const updateClassStatus = require('./src/classes/updateClassStatus/routes');
const bookClass = require('./src/classes/bookClass/routes');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Configure session
app.use(
    session({
        secret: 'your-secret-session',
        resave: false,
        saveUninitialized: false,
    })
);

// Mount userRoutes and classRoutes
app.use("/api/v1/src/user", userRoutes);
app.use("/api/v1/src/classes", classRoutes);
app.use("/api/v1/src/classes/classStatus", classStatus);
app.use("/api/v1/src/classes/upcomingClasses", upcomingClasses);
app.use("/api/v1/src/classes/updateClassStatus", updateClassStatus);
app.use("/api/v1/src/classes/bookClass", bookClass);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
});

// Trigger the class status update every 5 minutes (adjust the interval as needed)
setInterval(() => {
    // Import the controller function
    const { updateClassStatus } = require('./src/classes/updateClassStatus/controller');
  
    // Call the class status update function
    updateClassStatus();
  }, 
  5 * 60 * 1000); // 5 minutes interval