Upcoming Class API - README
Welcome to the Upcoming Class API! This API provides an endpoint to get information about the upcoming class for a user based on their timetable. It uses PostgreSQL database queries and moment.js for time-related operations to provide real-time class information.

Setup and Dependencies
To run the Upcoming Class API, you need the following:

1. Node.js and npm installed on your machine.
2. PostgreSQL database set up with the necessary tables (Timetables, Courses, ProgramCourses, LecturerCourses, Lecturers, DaysOfWeek, ProgramYears, and Users).
3. The API's codebase, including the controller.js, queries.js, and routes.js files.

Ensure that you have updated the database connection details in the ../../../database file to match your PostgreSQL setup.

Endpoint
Get Upcoming Class
Endpoint: GET /api/v1/src/upcoming-classes

Description: This endpoint allows an authenticated user to get information about their upcoming class based on their timetable for the current day and time. The API checks the user's timetable and returns details about the next scheduled class or ongoing class if the user is currently attending a class.

Response:
{
  "status": "Upcoming",
  "class": "Mathematics",
  "time": "10:00"
}

or

{
  "status": "Ongoing",
  "class": "Physics",
  "time": "11:00"
}
or

"You have no classes scheduled for today"
or

"You are done for the day"


Controller.js
The controller.js file contains the main logic for handling the API endpoint. It includes a function to get the upcoming class for an authenticated user based on their timetable. The code is well-documented to guide you through the implementation.

Queries.js
The queries.js file contains SQL queries used by the API to interact with the PostgreSQL database. It includes queries to get the upcoming class for a user and the user's timetable for the current day.

Routes.js
The routes.js file defines the API route and associates it with the corresponding controller function. It provides a clear overview of the available endpoint and its functionality.

Utility Function
The getCurrentDay and getCurrentTime utility functions are imported from the ../ongoingClasses/utils.js file. These functions are used to get the current day and time in the API's logic.