// server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

app.get('/api/messages', async (req, res) => {
  const { data: messages, error } = await supabase.from('messages').select('*').order('id', true);
  if (error) {
    console.log('Error fetching messages: ', error);
    res.status(500).json({ error: 'Error fetching messages' });
  } else {
    res.json(messages);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
