global.fetch = require('node-fetch');

const express = require('express');
const cors = require('cors');
const Unsplash = require('unsplash-js').default;
const toJson = require('unsplash-js').toJson;
const keys = require('./Keys.js');

// init an express obj so that we can access express funcs thru app.
const app = express();

// use cors to allow remote websites to access this server
app.use(cors({
   origin: '*'
}));

// init an unsplash obj with the api access keys for authentication purpose
const unsplash = new Unsplash({
   accessKey: keys.accessKey
});

// creating routes/endpoints for the server
/* app.get('/api/getPhotos', (req, res) => {
   unsplash.photos
      .listPhotos(1, 3)
      .then(toJson)
      .then(json => res.json(json));
}); */

// creating routes/endpoints for the server
app.get('/api/getPhotos', (req, res) => {
   unsplash.search
      .photos(req.query.tag, req.query.page, req.query.perPage, { orientation: req.query.orientation})
      .then(toJson)
      .then(json => res.json(json));
});

//TO-DO later
//get a list of pictures satisfying a tag
//pick a picture randomly 

// define port for the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log("Server started on port " + PORT);
});

