# An Image Processing Web App

Using this web application, user can apply image filters on device uploaded images or images fetched from Unsplash (Using <b>Unsplash API</b>) and download those images.
Image filters are used from <b>PixelsJs</b> image filtering library.

Note: All the Unsplash API usage guidelines have been followed.

<b>Front-End</b> - React.js

<b>Back-End</b> - Node.js, Express.js

Below are the steps to run this web app locally.

1. To run this app, Unsplash API `accessKey` is required. You can have `accessKey` after registering to Unsplash as a developer. For more details,
visit https://unsplash.com/developers
2. Once you have Unsplash API accessKey, assign it to the `accessKey` property on `app.js` file inside `server` directory.
3. Open terminal window and navigate to `server` folder.
4. Run command `npm install` (Make sure Node.js is installed in your system before running this command).
5. Run command `npm start`.
6. Open another terminal window and navigate to `client` folder.
7. Run command `npm install`.
8. Run command `npm start`. (To run in production mode, use command `npm run build` instead.)
9. Open browser and go to http://localhost:3000 (For production mode, go to http://localhost:5000 instead) to see the app running.










