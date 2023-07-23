Room Status Update API - README
Welcome to the Room Status Update API! This API provides an endpoint to automatically update the status of rooms based on the timetable data. It uses PostgreSQL database queries and scheduling to update the room statuses periodically.

Setup and Dependencies
To run the Room Status Update API, you need the following:

1. Node.js and npm installed on your machine.
2. PostgreSQL database set up with the necessary tables (Rooms, Timetables, DaysOfWeek).
3. The API's codebase, including the controller.js, queries.js, and routes.js files.
Ensure that you have updated the database connection details in the ../../../database file to match your PostgreSQL setup.

Endpoint
Update Room Statuses
Endpoint: GET /api/v1/src/update-room-status

Description: This endpoint is used to automatically update the status of rooms based on the timetable data for the current day and time. The API checks ongoing and non-ongoing timetables to determine the availability status of each room and updates their status accordingly.

Note: The status of rooms can be manually updated by providing specific timetable IDs in the manuallyUpdatedRoomIds array.

Controller.js
The controller.js file contains the main logic for handling the API endpoint. It includes functions to update the class status for multiple rooms, update class status for all rooms, and automatically update room statuses based on the timetable data. The code is well-documented to guide you through the implementation.

Queries.js
The queries.js file contains SQL queries used by the API to interact with the PostgreSQL database. It includes queries to update the class status for multiple rooms, update class status for all rooms, get ongoing timetables based on the current day and time, and get non-ongoing timetables based on the current day and time.

Routes.js
The routes.js file defines the API route and associates it with the corresponding controller function. It provides a clear overview of the available endpoint and its functionality.

Automatic Status Update
The Room Status Update API automatically updates room statuses at regular intervals. It uses the setInterval method to trigger the updateRoomStatuses function every 5 minutes by default (you can modify the interval if needed). The room statuses are updated based on the timetable data for the current day and time.

Manual Room Status Update
If you need to manually update the status of specific rooms, you can provide the relevant timetable IDs in the manuallyUpdatedRoomIds array in the bookClass/controller.js file. Rooms with these timetable IDs will not be affected by the automatic status update.