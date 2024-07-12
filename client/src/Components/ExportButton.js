// import React from "react";
// import axios from "axios";
// import { google } from "googleapis";

// const CLIENT_ID = "YOUR_CLIENT_ID";
// const CLIENT_SECRET = "YOUR_CLIENT_SECRET";
// const REDIRECT_URI = "YOUR_REDIRECT_URI";

// const ExportButton = ({ displayedData }) => {
//   const handleExport = async () => {
//     const oauth2Client = new google.auth.OAuth2(
//       CLIENT_ID,
//       CLIENT_SECRET,
//       REDIRECT_URI
//     );

//     const authUrl = oauth2Client.generateAuthUrl({
//       access_type: "offline",
//       scope: ["https://www.googleapis.com/auth/spreadsheets"],
//     });

//     // Redirect user to authUrl
//     window.open(authUrl, "_self");

//     // After getting the code, set up the token
//     // This requires a separate process to handle the code callback

//     // Get the access token
//     const code = "YOUR_AUTH_CODE"; // Handle this through a redirect/callback
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     const sheets = google.sheets({ version: "v4", auth: oauth2Client });
//     const createResponse = await sheets.spreadsheets.create({
//       resource: {
//         properties: {
//           title: "Exported Records",
//         },
//       },
//     });

//     const spreadsheetId = createResponse.data.spreadsheetId;

//     const rows = displayedData.map(record => [
//       record._id,
//       ...(Array.isArray(record.groupName) ? record.groupName : [record.groupName]),
//       record.entityName,
//       record.personName,
//       record.email,
//       record.phoneNo,
//       record.pan,
//     ]);

//     await sheets.spreadsheets.values.append({
//       spreadsheetId,
//       range: "Sheet1!A1",
//       valueInputOption: "RAW",
//       resource: {
//         values: rows,
//       },
//     });

//     alert("Data exported successfully!");
//   };

//   return (
//     <button
//       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//       onClick={handleExport}
//     >
//       Export
//     </button>
//   );
// };

// export default ExportButton;
