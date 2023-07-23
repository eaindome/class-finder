Lecture Room Search API - README
Welcome to the Lecture Room Search API! This API provides an endpoint to search for available lecture rooms based on a query. Whether you want to find specific rooms or explore all available rooms, this API has got you covered.

Setup and Dependencies
To run the Lecture Room Search API, you need the following:

1. Node.js and npm installed on your machine.
2. PostgreSQL database set up with the necessary tables (Rooms).
3. The API's codebase, including the controller.js, queries.js, and routes.js files.

Ensure that you have updated the database connection details in the ../../../database file to match your PostgreSQL setup.

Endpoints
Search for Lecture Rooms
Endpoint: GET /api/v1/src/lecture-rooms/search

Description: This endpoint allows you to search for available lecture rooms based on a query. If no query is provided, it returns a list of all available lecture rooms.

Parameters:

query (optional): The search query to find lecture rooms. The search is case-insensitive and looks for a partial match in the room name.

Response:
[  {    "room_name": "Room1",    
        "room_capacity": 30,    
        "status": "Available",    
        "location": "Building A, Floor 2"  
    },  
    {   "room_name": "Room2",    
        "room_capacity": 25,    
        "status": "Available",    
        "location": "Building B, Floor 1"  
    }
]

Controller.js
The controller.js file contains the main logic for handling the API endpoint. It includes functions to search for lecture rooms and get all available lecture rooms. The code is well-documented to guide you through the implementation.

Queries.js
The queries.js file contains SQL queries used by the API to interact with the PostgreSQL database. It includes queries to search for lecture rooms based on the provided query and to get all available lecture rooms.

Routes.js
The routes.js file defines the API route and associates it with the corresponding controller function. It provides a clear overview of the available endpoint and its functionality.