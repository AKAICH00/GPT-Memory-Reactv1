// server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS

app.get('/api/completions', async (req, res) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: req.query.prompt,
      max_tokens: 60,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calling OpenAI API' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
