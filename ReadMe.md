# User Instructions

## Build summary
This project is a RESTful user management API built with the following endpoints functions:
- [POST] `/api/register` - Able to submit a user object containing username, email and password fields that are validated (password is encrypted) and added to a remote MongoDB collection.
- [POST] `/api/login` - Able to submit a request with a user object containing a username or email and password, then compare credentials with collection entries to return a valid token if an exact match exists in the database
- [GET] `/api/profile/:id` - Able to authenticate authorisation token and return a user object from the database which corresponds to the provided id parameter
- [PUT] `/api/profile/:id/update` - Able to update any of the user information fields of an existing user object in the database as long as authorisation token is valid and id exists in collection.

## Executables
The server can be started using the command `npm run start` in your terminal, after which HTTP requests can be dispatched to the 