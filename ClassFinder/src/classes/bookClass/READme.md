Class Booking API - README
Welcome to the Class Booking API! This API provides endpoints to book, cancel, and view class/lecture room bookings for class representatives. Before you begin, make sure you have the necessary setup and dependencies.

Setup and Dependencies
To run the Class Booking API, you need the following:

1. Node.js and npm installed on your machine.
2. PostgreSQL database set up with necessary tables (Rooms, Users, Courses, Timetables, DaysOfWeek, BookedClasses).
3. The API's codebase, including the controller.js, queries.js, and routes.js files.

Make sure to update the database connection details in the ../../../database file according to your PostgreSQL setup.

Endpoints
1. Book a Class/Lecture Room Now
Endpoint: POST /api/v1/src/classes/bookNow/:roomName

Description: This endpoint allows a class representative to book a class/lecture room for a specific day and duration.

Request Body:
json
{
  "day": "Monday",    // Day of the week
  "course": "Math",   // Course name
  "duration": 2       // Duration of the class in hours
}

Response:
json
{
  "message": "Class booked successfully.",
  "bookingId": 1,
  "selectedRoom": "Room {roomName}",
  "day": "Monday",
  "course": "Math",
  "duration": 2
}

2. Book a Class/Lecture Room for a Future Event
Endpoint: POST /api/v1/src/classes/bookLater/:roomName

Description: This endpoint allows a class representative to book a class/lecture room for a future event on a specific day and time.

Request Body:
json
{
  "day": "Tuesday",         // Day of the week
  "course": "Science",      // Course name
  "duration": 3,            // Duration of the class in hours
  "startTime": "14:00:00"   // Start time of the class in HH:mm:ss format
}

Response:
json
{
  "message": "Class booked successfully.",
  "selectedRoom": "Room {roomName}",
  "day": "Tuesday",
  "course": "Science",
  "duration": 3
}

3. Book a Class/Lecture Room for a Future Event on the Current Day
Endpoint: POST /api/v1/src/classes/bookLaterDay/:roomName

Description: This endpoint allows a class representative to book a class/lecture room for a future event on the current day.

Request Body:
json
{
  "course": "History",       // Course name
  "duration": 2,             // Duration of the class in hours
  "startTime": "15:30:00"    // Start time of the class in HH:mm:ss format
}

Response:
json
{
  "message": "Class booked successfully.",
  "selectedRoom": "Room {roomName}",
  "day": "CurrentDay",
  "course": "History",
  "duration": 2
}

4. Cancel a Room Booking
Endpoint: PUT /api/v1/src/classes/cancel/:roomName

Description: This endpoint allows a class representative to cancel a previously booked class/lecture room.

Response:
json
{
  "message": "Class booking cancelled successfully."
}

5. Get All Booked Rooms
Endpoint: GET /api/v1/src/classes/getBookedRooms

Description: This endpoint retrieves a list of all currently booked rooms.

Response:
json
{
  "bookedRooms": [
    {
      "room_name": "Room1",
      "room_capacity": 30,
      "status": "Booked",
      "location": "Building A, Floor 2"
    },
    {
      "room_name": "Room2",
      "room_capacity": 25,
      "status": "Booked",
      "location": "Building B, Floor 1"
    }
  ]
}

6. Get Available Times of a Lecture Room
Endpoint: GET /api/v1/src/classes/bookClass/availableTimes/:roomName/:day

Description: This endpoint retrieves the available times for booking a specific lecture room on a particular day.

Response:
json
{
  "availableTimes": [
    {
      "start_time": "08:01:00",
      "end_time": "09:30:00"
    },
    {
      "start_time": "10:30:00",
      "end_time": "12:00:00"
    }
  ]
}

7. Get Available Times of a Lecture Room for the Current Day
Endpoint: GET /api/v1/src/classes/bookClass/getAvailableTimesCurrent/:roomName

Description: This endpoint retrieves the available times for booking a specific lecture room on the current day.

Response:
json
{
  "availableTimes": [
    {
      "start_time": "08:01:00",
      "end_time": "09:30:00"
    },
    {
      "start_time": "10:30:00",
      "end_time": "12:00:00"
    }
  ]
}

Testing in Postman
To test the API endpoints using Postman, follow these steps:

Open Postman and import the provided routes.js file.

Set the base URL to http://localhost:3000/api/v1/src/classes.

Use the provided sample request bodies for each endpoint and send requests to the respective endpoints.

Review the responses to verify the API's functionality.

Controller.js
The controller.js file contains the main logic for handling the API endpoints. It includes functions for booking, canceling, and getting available times for lecture rooms. The code is well-documented to guide you through the implementation.

Queries.js
The queries.js file contains SQL queries used by the API to interact with the PostgreSQL database. It includes queries for booking classes, updating room status, and getting available rooms and booked rooms.

Routes.js
The routes.js file defines the API routes and associates them with the corresponding controller functions. It provides a clear overview of the available endpoints and their functionality.