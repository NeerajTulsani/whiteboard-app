# Application Description

The whiteboard application is designed for users to collaboratively create and share art in real-time.

User Authentication:
  Users must log in using their username and password to access the application.
  
Room Selection:
  Once logged in, users can choose to join an existing room or create a new shared room.

App Feature:
  Users can draw on the board. They can select the color and size of the brush.

Real-Time Collaboration:
  Users in the same room can draw and see each other's changes in real-time.
  
Leave Room:
  Users have the option to leave the room at any time.
  When a user leaves, they are redirected back to the room selection page.
  
Logout:
  Users can log out from the application to end their session.
  
Session Persistence:
  The application saves the drawing session data, allowing users to resume from where they left off when they rejoin the room. 


# Project Setup

Follow these steps to set up and run the whiteboard application. This project requires Node.js version 16.10.0 for both the backend and frontend.

Prerequisites
  Node.js version 16.10.0
  PostgreSQL database
  
Backend Setup
  1. cd backend
  2. npm install
  
  3. vim config.js
     (update it with your PostgreSQL database connection details)
  
  Create a user to login into the application:
  Run the following script to add a new user:
    4. node scripts/addUser.js 'username' 'password' 
      (Replace 'username' and 'password' with your desired credentials. These parameters are optional)

  5. node server.js

Frontend Setup
  1. cd whiteboard-app
  2. npm install
  3. npm start
  
Navigate to http://localhost:3000 in your web browser.

Login to the application:
  4. Use the username and password you created earlier to log in.
