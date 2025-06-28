// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
  try {
    // Your Google Apps Script URL
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyEvhxQh7kuu7iK-Tq-CCyQiBBGxelCd2Jb9mmqfU2mrYucTN6S12f1NBHGyqRkJOu8/exec';

    // Build form data
    const params = new URLSearchParams();
    params.append('username', req.body.username);
    params.append('name', req.body.name);

    // Send as POST with proper headers
    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    // Redirect user to your bit.ly link
    res.redirect('https://sites.google.com/view/uk49freepredict/home');
  } catch (err) {
    console.error('Error forwarding to Google Script:', err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
