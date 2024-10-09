# Project Documentation

## File Structure

This project is organized into two main folders:

- Client: Contains the frontend code.
- Server: Contains the backend code.

### Getting Started

To download the essential packages, navigate to each folder and run the following command:

```bash
npm install
To start both the frontend and backend servers, run the following command in each folder:

bash
Copy code
npm start
The main file being rendered for the frontend is app.jsx located in the client folder.

Authentication
Authentication is implemented using the Clerk SDK. To connect your own Clerk dashboard:

Replace the REACT_APP_CLERK_PUBLISHABLE_KEY in the .env files with the key provided by Clerk (if built using npx create-react-app).
Set up two roles, Member and Admin, on the Clerk dashboard.
Ensure these roles are added to the metadata for the web application to read.
Environment Files
There are two .env files located in the client folder:

.env.development: For development environment settings.
.env.production: For production environment settings.
You need to manually add the following variables:

Clerk key
API path via REACT_APP_API_URL (different paths for localhost and the live project).
Additionally, in the server folder, there is a config.env file that contains:

PORT: The port number to run the server.
ATLAS_URI: The MongoDB connection string.
Exporting Files
Records and the overview page can export rows to Google Sheets using SheetDB.

To configure this:

Include your Google Sheets URL in the components folder.
Use ExportButton for the Records page and StaffSummary for the Overview page.
Architecture



![Screenshot 2024-10-09 123016](https://github.com/user-attachments/assets/990f8dc3-8bfc-44cb-848c-0ca96474a64d)
