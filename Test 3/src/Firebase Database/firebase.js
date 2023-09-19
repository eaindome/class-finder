const admin = require('firebase-admin');

// Replace 'path/to/serviceAccountKey.json' with the actual path to your service account key JSON file
const serviceAccount = require('path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;


/*
so now with this new database structure, I want you to write an endpoint code such that, users are allowed to decide whether to receive notifications or not and if users want notifications, users should receive notifications based on their upcoming classes and also on the status of the room for which the upcoming course will be taken in, so let's say user 1 presses receive notification button, then based on user 1's timetable, the current date and time, when it's 15mins to time for a course to be taken, a notification is sent to user1 and when it's 5mins to time and the class has been cancelled, based on the room status a notification is sent to user 1. The logic should be in controller.js, the queries in queries.js and the routes in routes.js. Database structure */
