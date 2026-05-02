Team Task Manager

Team Task Manager is a full stack web application developed for managing team projects, task assignments, and tracking work progress through a centralized system.

The purpose of this project is to provide a structured platform where users can create projects, assign tasks, and monitor the status of work efficiently. It helps teams stay organized, improve collaboration, and track productivity in real time.

This application is fully cloud deployed with separate frontend and backend hosting.

Live Project Links

Frontend Live Application:
https://your-netlify-link.netlify.app

Backend API Server:
https://team-task-manager-production-9f90.up.railway.app

GitHub Repository:
https://github.com/SaiTeja2417/Team-Task-Manager

Key Features
User Authentication (Signup/Login)
JWT Based Secure Authorization
Project Creation and Management
Task Creation and Assignment
Task Status Tracking (Pending / Completed)
Project-wise Task Filtering
REST API Integration
MongoDB Cloud Database Storage
Responsive User Interface
Full Stack Cloud Deployment
Technologies Used
Frontend
React (Vite)
Tailwind CSS
Material UI
JavaScript
Backend
Node.js
Express.js
Database
MongoDB Atlas (NoSQL Cloud Database)
Authentication
JSON Web Token (JWT)
Deployment
Netlify (Frontend Hosting)
Railway (Backend Hosting)
GitHub (Version Control)
Main Functional Modules
Authentication Module

Provides secure user registration and login functionality.
User credentials are verified using backend APIs and a JWT token is generated after successful authentication.

Project Management Module

Allows users to create and manage projects with details such as project name and description.
Projects act as containers for organizing tasks.

Task Management Module

Allows users to create tasks under specific projects with:

Task title
Description
Priority level
Status
Due date

Users can also update task status and details.

Task Tracking Module

Users can view all tasks or filter tasks based on projects.
This helps in monitoring progress and identifying pending work.

REST API Endpoints Used

The frontend communicates with backend using Express REST APIs:

/api/auth/signup
/api/auth/login
/api/projects
/api/tasks
/api/tasks/:id
/api/users

These APIs are consumed using Axios for smooth communication.

Database Collections

MongoDB Atlas is used to store application data.

Collections maintained:

Users Collection
Projects Collection
Tasks Collection

This ensures proper separation and management of data.

Demo Credentials

You can create a new account using the signup feature.

Local Setup Instructions
Clone the Repository
git clone https://github.com/SaiTeja2417/Team-Task-Manager.git
Backend Setup
cd backend
npm install
npm start

Create .env file:

PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Frontend Setup
cd frontend
npm install
npm run dev
Project Folder Structure
Team-Task-Manager/

backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── server.js

frontend/
├── src/
├── assets/
├── index.html
├── vite.config.ts

README.txt


Future Scope
Task deadlines and reminders
Notification system
Real-time collaboration (chat/comments)
Dashboard analytics

Project Status
Completed, deployed, and fully functional.