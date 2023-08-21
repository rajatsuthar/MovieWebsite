const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const { env } = require("process");

const db = mysql.createConnection({
    host : process.env.host,
    user : process.env.user,
    password : process.env.password,
    database : process.env.DATABASE_ROOT,
    multipleStatements : true
})



db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 






app.post('/search', (req, res) => {
  const searchQuery = req.body.s;

  
  axios.post(`http://www.omdbapi.com/?i=tt3896198&apikey=2de2605b`)
    .then(response => {
      const movies = response.data;
      console.log("movies",movies)
      res.send({'search': movies });
    })
    .catch(error => {
      console.error('Error fetching data from OMDB:', error);
      res.send({ error: 'An error occurred while fetching data from OMDB.' });
    });
});

app.post('/Setfavorite', (req, res) => {
  const { title, year, type, poster } = req.body;

  
  db.query(`INSERT INTO favorites (title, year, type, poster) VALUES (${title},${year},${type},${poster}`,
    [title, year, type, poster],
    (err, results) => {
      if (err) {
        console.error('Error saving favorite movie:', err);
        res.send({ success: false, message: 'Failed to save favorite movie.' });
      } else {
        res.send({ success: true, message: 'Favorite movie saved successfully.' });
      }
    }
  );
});


app.get('/favorites', (req, res) => {

  db.query('SELECT * FROM favorites', (err, results) => {
    if (err) {
      console.error('Error fetching favorite movies:', err);
      res.send('favorites', { error: 'An error occurred while fetching favorite movies.' });
    } else {
      const favoriteMovies = results;
      res.send('favorites', { favoriteMovies });
    }
  });
});


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
