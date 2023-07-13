# Fast Credit Limited Backend Code Challenge

## Task Summary:
Design and build a RESTful User Management API with the following CRUD functions:
- User registration: Clients should be able to register new users to the database (create route)
- User authentication: Clients with valid user credentials should be able to login, recieve a valid JWT for session management, and view their user information as a response (private routing functionality)
- User profile retrieval: Clients with a valid jwt should be able to view their user information as a response (Read route, auth protected)
- User profile update: Clients with a valid jwt should be able to edit and update their user information on the database and get their updated credentials back as a response - consider adding password update functionality (Update route)

### Stretch Goals:
- Password change functionality
- Logout functionality

## Implementation constraints and considerations:
Use secure industry standard password storage and authentication.
Implement validation to ensure properly formatted payloads and check for duplicate usernames and email addresses
Ensure thorough documentation and testing of endpoints using jest/supertest and Swagger