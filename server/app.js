const express = require('express');
const cors = require('cors');

import { createApi } from "unsplash-js";
import nodeFetch from "node-fetch";

const unsplashApi = createApi({
  // Don't forget to set your access token here!
  // See https://unsplash.com/developers 
  accessKey: "",
  fetch: nodeFetch,
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/unsplash-proxy/search/photos', (req, res) => {
  unsplashApi.search.getPhotos(req.query)
   .then(response => {
     res.status(200).json(response.response);
   })
   .catch(err => {
     res.status(500).json({err});
   });

app.post('/unsplash-proxy/track-downloads', (req, res) => {
  if (req.body && req.body.downloadLocation) {
    unsplashApi.photos
      .trackDownload({downloadLocation: req.body.downloadLocation})
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  } else {
    res.status(400).json({error: 'downloadLocation is required.'});
  }
});
});

app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});

