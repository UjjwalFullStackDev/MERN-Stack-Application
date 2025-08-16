# MERN Stack User Profile Management App

## Features
- User Registration with email verification and profile image upload (with preview).
- Login & Authentication using **JWT + Refresh Tokens**.
- Password Reset functionality via email.
- Role-Based Access Control (RBAC):
  - Admin can be created via **Postman**.
  - Admin can perform actions like deleting any user.
- User can view all users, search users, and view/edit their own profile.
- Pagination & Search functionality for listing users.
- Form validation using **React-Hook-Form**.
- Responsive design for desktop, tablet, and mobile.

## Backend
- MySQL with Sequelize ORM.
- Redis for caching.
- Multer for file uploads.
- Express-validation for request validation.

## Frontend
- React.js with Axios.
- Image upload with preview.
- React-Hook-Form for validation.
- Pagination and search.
- Responsive design.

## Run Redis (Standalone)
```sh
redis-server.exe
