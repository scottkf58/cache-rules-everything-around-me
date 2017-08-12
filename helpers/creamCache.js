const express = require('express');
const app = express();
const handlebars = require('express-handlebars');

const redis = require('redis');
const client = redis.createClient();

app.engine('.hbs', handlebars({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

client.on('error', (err) => {
  console.log("Error", err);
});

client.on('connect', () =>{
  console.log('connected to redis server!');
});

function creamCache (req, res, next){
  console.log('hit the cache');
  console.log(req.path);
  // check if the path exists in our redis db
  client.get(req.path, (err, reply) => {
    if (reply === null){
      // if it doesnt (null) then add that path and contents to the redis db

      // render the string of that template
      app.render('api/index', function  (err, html) {
        // set the rendered string into the redis db
        client.set(req.path, html, redis.print);
        next();
      });

    }else {
      // respond back to requester with contents of path in redis db
      res.send(reply);
    }
  });

}

module.exports = creamCache;