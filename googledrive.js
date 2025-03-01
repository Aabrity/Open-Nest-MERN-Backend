import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Setup OAuth2 client
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  '439737253853-7ad524thmra59jf6i14qovq7v2bi36g4.apps.googleusercontent.com', // Replace with your client ID
  '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', // Replace with your client secret
  'http://localhost:5173/profile' // Replace with your redirect URL
);

// Generate a URL for the user to sign in with Google
const getAuthUrl = () => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });
  return authUrl;
};

// Exchange the authorization code for tokens
const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

// Upload a file to Google Drive
const uploadFile = async (filePath) => {
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  const fileMetadata = {
    name: 'your-image.jpg', // Change file name
  };
  const media = {
    mimeType: 'image/jpeg', // Adjust to the image type
    body: fs.createReadStream(filePath),
  };

  try {
    const res = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    return res.data.id; // Return file ID from Google Drive
  } catch (err) {
    console.error('Error uploading file to Google Drive', err);
  }
};

// Export the functions
export { uploadFile, getAuthUrl, getTokens };
