# User Instructions

## Build summary
This project is a RESTful user management API built with the following endpoints functions:
- [POST] `/api/register` - Able to submit a user object containing username, email and password fields that are validated (password is encrypted) and added to a remote MongoDB collection. Responds with a status code and message.
- [POST] `/api/login` - Able to submit a request with a user object containing a username or email and password, then compare credentials with collection entries to return a valid token if an exact match exists in the database. Responds with a status code and authorisation token.
- [GET] `/api/profile/:id` - Able to authenticate authorisation token and return a user object from the database which corresponds to the provided id parameter. Responds with a status code and user object.
- [PUT] `/api/profile/:id/update` - Able to update any of the user information fields of an existing user object in the database as long as authorisation token is valid and id exists in collection. Responds with a status code updated user object.

## Executable
The server can be started using the command `npm run start` in your terminal, after which HTTP requests can be dispatched using a client of your choice to the various endpoints accessible via the base URL `http://localhost:1337/`.

While the server is running, documentation for each endpoint can be viewed via a web browser using `http://localhost:1337/docs`.

## Build notes & justifications
Passwords are hashed using the bcrypt algorithm with an adjustable factor for enhanced security. Salting was considered in addition to this, however hashing proved most expedient to implement on its own within the given timeframe.

Authentication and session management are handled using signed JWTs that are issued on successful login request and remain valid for up to 3 hours. Endpoints for both fetching and updating user information then validate the the token before responding to any requests. 

Environment variables are stored in a hidden file that will not be published publicly when code is being pushed to avoid exposing endpoints when application enters staging and prodution.