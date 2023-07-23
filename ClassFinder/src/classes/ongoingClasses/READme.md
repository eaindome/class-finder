Lecture Room Ongoing Sessions API - README
Welcome to the Lecture Room Ongoing Sessions API! This API provides an endpoint to retrieve all ongoing sessions in lecture rooms. It allows you to get a list of ongoing sessions based on the current day and time. The API makes use of PostgreSQL database queries and utility functions to provide real-time session information.

Setup and Dependencies
To run the Lecture Room Ongoing Sessions API, you need the following:

1. Node.js and npm installed on your machine.
2. PostgreSQL database set up with the necessary tables (Rooms, Timetables, Courses, ProgramCourses, BookedClasses, Users, and DaysOfWeek).
3. The API's codebase, including the controller.js, queries.js, routes.js, and utils.js files.

Ensure that you have updated the database connection details in the ../../../database file to match your PostgreSQL setup.

Endpoints
Get All Ongoing Sessions
Endpoint: GET /api/v1/src/lecture-rooms/ongoing-sessions

Description: This endpoint allows you to get all ongoing sessions in lecture rooms based on the current day and time.

Response:
[  {    "room_name": "Room1",    
        "course_name": "Mathematics",    
        "start_time": "10:00",    
        "end_time": "11:30"  
    },  
    {   "room_name": "Room2",    
        "course_name": "Physics",    
        "start_time": "11:00",    
        "end_time": "12:30"  
    }
]

Controller.js
The controller.js file contains the main logic for handling the API endpoint. It includes a function to get all ongoing sessions in lecture rooms. The code is well-documented to guide you through the implementation.

Queries.js
The queries.js file contains SQL queries used by the API to interact with the PostgreSQL database. It includes a query to retrieve all ongoing sessions based on the current day and time.

Utils.js
The utils.js file includes utility functions required by the API. Specifically, it provides functions to get the current day and current time in a specific format.

Routes.js
The routes.js file defines the API route and associates it with the corresponding controller function. It provides a clear overview of the available endpoint and its functionality.