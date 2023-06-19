// server.cjs

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

app.use(cors()); // Enable CORS

app.get('/api/completions', async (req, res) => {
  try {
    console.log('Prompt: ', req.query.prompt);
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: req.query.prompt,
      max_tokens: 60,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`,
      },
    });
    console.log('Response from OpenAI API: ', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling OpenAI API: ', error);
    res.status(500).json({ error: 'Error calling OpenAI API' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    console.log('Fetching messages from Supabase');
    const { data: messages, error } = await supabase.from('messages').select('*').order('id', true);
    if (error) {
      console.error('Error fetching messages: ', error);
      res.status(500).json({ error: 'Error fetching messages' });
    } else {
      console.log('Fetched messages: ', messages);
      res.json(messages);
    }
  } catch (error) {
    console.error('Error in /api/messages route: ', error);
    res.status(500).json({ error: 'Error in /api/messages route' });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
