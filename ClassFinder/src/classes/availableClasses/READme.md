Lecture Room Availability API - README
Welcome to the Lecture Room Availability API! This API provides an endpoint to retrieve all available lecture rooms. Before you begin, make sure you have the necessary setup and dependencies.

Setup and Dependencies
To run the Lecture Room Availability API, you need the following:

1. Node.js and npm installed on your machine.
2. PostgreSQL database set up with the necessary tables (Rooms).
3. The API's codebase, including the controller.js, queries.js, and routes.js files.

Make sure to update the database connection details in the ../../../database file according to your PostgreSQL setup.

Endpoint
Get All Available Lecture Rooms
Endpoint: GET /api/v1/src/lecture-rooms

Description: This endpoint retrieves a list of all currently available lecture rooms.

Response:
[  {    "room_name": "Room1",
        "room_capacity": 30,    
        "status": "Available",    
        "location": "Building A, Floor 2",    
        "current_time": "2023-07-22T10:30:15.123Z"  
    },  
    {   "room_name": "Room2",    
        "room_capacity": 25,    
        "status": "Available",    
        "location": "Building B, Floor 1",    
        "current_time": "2023-07-22T10:30:15.123Z"  
    }
]

Controller.js
The controller.js file contains the main logic for handling the API endpoint. It includes a function to get all available lecture rooms. The code is well-documented to guide you through the implementation.

Queries.js
The queries.js file contains an SQL query used by the API to interact with the PostgreSQL database. It includes a query to retrieve available lecture rooms from the database.

Routes.js
The routes.js file defines the API route and associates it with the corresponding controller function. It provides a clear overview of the available endpoint and its functionality.