ClassFinder API - README
Welcome to the ClassFinder API! This API provides various endpoints to manage class information, user details, ongoing and upcoming classes, room availability, and more. It also includes functionality to send notifications for upcoming classes and manage user favorites.

Setup and Dependencies
To run the ClassFinder API, you need the following:

1. Node.js and npm installed on your machine.
2. PostgreSQL database set up with the necessary tables (Rooms, Timetables, Users, etc.).
3. The API's codebase, including the server.js, database.js, controller.js, queries.js, and routes.js files.

Ensure that you have updated the database connection details in the database.js file to match your PostgreSQL setup.

Package Dependencies
The ClassFinder API relies on the following NPM packages:

1. axios: HTTP client used for making API requests.
2. bcrypt: Library for hashing passwords for user authentication.
3. connect-pg-simple: PostgreSQL session store for Express.js.
4. ejs: Template engine used for rendering views.
5. express: Web framework for handling API routes and middleware.
6. express-session: Middleware for managing user sessions.
7. firebase-admin: Firebase Admin SDK for integrating with Firebase services.
8. http: HTTP server used for Socket.IO.
9. ical-generator: Library for generating iCalendar files for calendar events.
10. moment: Date and time manipulation library.
11. node-cron: Library for scheduling tasks at specific intervals.
12. nodemailer: Library for sending email notifications.
13. pg: PostgreSQL client library for Node.js.
14. pg-promise: Library for simplifying PostgreSQL database access.
15. socket.io: Real-time communication library using WebSocket.

Endpoints
The ClassFinder API exposes various endpoints to handle user authentication, class status updates, upcoming classes, timetables, notifications, favorites, and more. Each endpoint serves specific functionalities and has its own URL path.

Below are the key endpoints:

1. /api/v1/src/user: User-related endpoints (login, registration, etc.)
2. /api/v1/src/classes/classStatus: Class status endpoints (get class status)
3. /api/v1/src/classes/upcomingClasses: Upcoming class endpoints (get upcoming classes)
4. /api/v1/src/classes/updateClassStatus: Update class status endpoint (update room statuses based on timetable data)
5. /api/v1/src/classes/bookClass: Book class endpoint (book a class)
6. /api/v1/src/timetable: Timetable endpoints (display timetable, ongoing sessions)
7. /api/v1/src/classes/availableClasses: Available lecture rooms endpoints (get available lecture rooms)
8. /api/v1/src/classes/searchClasses: Search lecture rooms endpoints (search for available lecture rooms)
9. /api/v1/src/notifications: Notification endpoints (send notifications for upcoming classes)
10. /api/v1/src/favourites: Favorites endpoints (manage favorite classes)

Controller.js and Queries.js
Each endpoint has its own corresponding controller.js and queries.js files, which handle the business logic and interact with the PostgreSQL database, respectively.

Server.js
The server.js file is the main entry point of the ClassFinder API. It sets up the Express server, configures middleware, connects to the database, and mounts the various routes. Additionally, the file includes Socket.IO configuration for real-time communication and utilizes the node-cron package to schedule the automatic update of room statuses based on timetable data.

Endpoint Overview
1. User Routes: Endpoints for managing user details and authentication.
2. Class Status Routes: Endpoints for getting class status information.
3. Upcoming Classes Routes: Endpoints for getting upcoming classes.
4. Update Class Status Routes: Endpoint for automatically updating room statuses based on timetable data.
5. Book Class Routes: Endpoints for booking classes and managing class bookings.
6. Timetable Routes: Endpoints for displaying class timetables.
7. Ongoing Classes Routes: Endpoint for getting ongoing class information.
8. Available Lecture Rooms Routes: Endpoint for getting available lecture rooms.
9. Search Lecture Rooms Routes: Endpoint for searching available lecture rooms.
10. Notification Routes: Endpoint for managing notifications and sending upcoming class notifications.
11. Favorites Routes: Endpoints for managing user favorites.
12. Starting the Server

To start the server, run the following command in the project directory:
npm start
The API will be accessible at http://localhost:3000/.

Socket.IO Integration
The API includes Socket.IO integration, allowing real-time communication with connected clients. It emits a custom event "customEvent" when a client connects to the server. The API also handles client disconnects and logs related events.

Scheduled Task
The ClassFinder API uses the node-cron library to schedule a task every minute (you can modify the interval) for sending notifications about upcoming classes. This functionality can be found in the notifications/controller.js file.

Note
Please make sure to secure your API with proper authentication and authorization mechanisms before deploying it to production.
