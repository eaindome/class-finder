User Authentication API - README
Welcome to the User Authentication API! This API provides endpoints for user login, user profile retrieval, user logout, and user sign up. Below, you will find important information about the API, including its setup, endpoints, and how to test using Postman.

Setup and Dependencies
To run the User Authentication API, you need the following:

1. Node.js and npm installed on your machine.
2. PostgreSQL database set up with the necessary tables (Users, ProgramYears, Programs, etc.).
3. The API's codebase, including the controller.js, queries.js, and routes.js files.

Ensure that you have updated the database connection details in the database.js file to match your PostgreSQL setup.

Endpoints
The User Authentication API exposes the following endpoints:

User Login:

bash
Copy code
POST /api/v1/login
This endpoint allows users to log in with their reference number and password.

User Profile:

bash
Copy code
GET /api/v1/profile
This endpoint allows authenticated users to retrieve their profile information.

User Logout:

bash
Copy code
POST /api/v1/logout
This endpoint logs out the authenticated user.

User Sign Up:

bash
Copy code
POST /api/v1/signup
This endpoint allows users to sign up by providing their reference number, first name, surname, password, email, program, and year.

Controller.js and Queries.js
The controller.js file contains the business logic for each endpoint. It handles user login, user profile retrieval, user logout, and user sign up. Passwords are securely hashed before storing them in the database, and user authentication is managed using sessions.

The queries.js file contains the SQL queries used by the controller to interact with the database. It includes queries to check if a user exists, retrieve user profiles, insert new users, get program and year IDs, and more.

Server.js
The server.js file is the main entry point of the User Authentication API. It sets up the Express server, configures middleware, connects to the database, and mounts the user route.

Routes.js
The routes.js file defines the routes for each of the user authentication endpoints. It mounts the functions from the controller.js file to their respective HTTP methods.

Testing with Postman
You can test the User Authentication API using Postman or any other API testing tool.

User Login:
Send a POST request to /api/v1/login with the following JSON 

body:
json
{
  "reference_number": "YOUR_REFERENCE_NUMBER",
  "password": "YOUR_PASSWORD"
}
If the credentials are correct, you will receive a 200 response with a success message.

User Profile:
Send a GET request to /api/v1/profile. Make sure to include the session cookie from the successful login response in the request headers. If the user is authenticated, you will receive their profile information in the response.

User Logout:
Send a POST request to /api/v1/logout. Make sure to include the session cookie from the successful login response in the request headers. If the logout is successful, you will receive a success message.

User Sign Up:
Send a POST request to /api/v1/signup with the following JSON 

body:
json
{
  "reference_number": "YOUR_REFERENCE_NUMBER",
  "firstname": "YOUR_FIRST_NAME",
  "surname": "YOUR_SURNAME",
  "password": "YOUR_PASSWORD",
  "email": "YOUR_EMAIL",
  "program": "YOUR_PROGRAM_NAME",
  "year": "YOUR_YEAR_NAME"
}
If the sign-up is successful, you will receive a 201 response with a success message.

Note: Before testing the login and profile endpoints, ensure that you have already signed up a user with the "User Sign Up" endpoint.

Note
Please ensure proper security measures are implemented, including HTTPS, input validation, and error handling, before deploying this API to production.

Feel free to explore and modify the code to s