require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const Url = require('./models/url');
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;

  

  let urls;
  try {
    urls = new URL(url);
  } catch (err) {
    return res.json({"error": "invalid url"});
  }

  if (urls.protocol !== 'http:' && urls.protocol !== 'https:') {
    return res.json({"error": "invalid url"});
  }

  const validateUrl = (url, callback) => {
    dns.lookup(url.hostname, (err) => {
      if (err) {
        return callback(false);
      }
      return callback(true);
    });
  };

  if (!validateUrl(urls, (isValid) => {
    if (!isValid) {
      return res.json({"error": "invalid url"});
    }
  }));

  let short_url = Math.floor(Math.random() * 1000);
  const newUrl = new Url({
    original_url: url,
    short_url: short_url
  });

  newUrl.save();
  console.log(newUrl);
  res.json({ original_url: url, short_url: short_url });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = req.params.short_url;
  Url.findOne({short_url: short_url}).then((data) => {
    if (!data) {
      return res.json({ error: 'invalid url' });
    }
    res.redirect(data.original_url);
  }).catch((err) => {
    return res.json({ error: 'invalid url' });
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


   