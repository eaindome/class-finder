Timetable API - README
Welcome to the Timetable API! This API provides an endpoint to retrieve the timetable for a specific user's program year. Below, you will find information on how to navigate the code and understand its functionalities, as well as how to test the API using POSTMAN.

Setup and Dependencies
To run the Upcoming Class API, you need the following:

1. Node.js and npm installed on your machine.
2. PostgreSQL database set up with the necessary tables (Timetables, Courses, ProgramCourses, LecturerCourses, Lecturers, DaysOfWeek, ProgramYears, and Users).
3. The API's codebase, including the controller.js, queries.js, and routes.js files.

Ensure that you have updated the database connection details in the ../../../database file to match your PostgreSQL setup.

How to Navigate the Code
The Timetable API is organized into three main files: controller.js, queries.js, and routes.js. These files handle different aspects of the API's functionality:

controller.js: This file contains the controller functions that handle incoming HTTP requests and send appropriate responses. The primary endpoint, getTimetable, retrieves the timetable for a user based on their program year.

queries.js: In this file, the necessary SQL query, getUserTimetableQuery, is defined to retrieve the timetable for a specific user's program year. The query joins multiple tables (Timetables, ProgramYears, Programs, Years, ProgramCourses, Courses, LecturerCourses, Lecturers, Rooms, DaysOfWeek, and Users) to fetch the required timetable data.

routes.js: The routes.js file defines the Express router for the Timetable API. It specifies the HTTP method (GET) and the URL path ('/'), associating it with the getTimetable function from controller.js.

How to Test with POSTMAN
To test the Timetable API using POSTMAN, follow these steps:

Start the API server by running the command npm start. The server will listen on port 3000 by default.

Open POSTMAN and create a new request:

Request Method: GET
URL: http://localhost:3000/api/v1/src/timetable
If the API requires authentication (session validation), ensure that you are logged in and that the required session information is available in the request. If not, the API will respond with a status code of 401 (Unauthorized) and an error message indicating that the user is not logged in.

Send the GET request to retrieve the timetable for the user. The API will respond with a status code of 200 (OK) and the timetable data in the response body in JSON format.

Example Response:
json
{
  "timetable": [
    {
      "course_name": "Introduction to Computer Science",
      "lecturer_name": "Dr. John Doe",
      "room_name": "Room 101",
      "start_time": "09:00",
      "end_time": "11:00",
      "day_name": "Monday",
      "program_name": "Computer Science",
      "year_name": "Year 3"
    },
    {
      "course_name": "Data Structures and Algorithms",
      "lecturer_name": "Prof. Jane Smith",
      "room_name": "Room 202",
      "start_time": "14:00",
      "end_time": "16:00",
      "day_name": "Tuesday",
      "program_name": "Computer Science",
      "year_name": "Year 3"
    },
    ...
  ]
}
Please note that the actual timetable data in the response will vary based on the user's program year and the availability of classes for that specific day.

Note
Ensure that the database and session configurations are correctly set up for the API to function properly. Additionally, consider securing the API with appropriate authentication mechanisms before deploying it to production.