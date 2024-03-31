const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable or default to port 3000

app.use(express.json());
app.use(cors());

// New endpoint to save data
app.post('/api/saveData', async (req, res) => {
  try {
    const formData = req.body;
    const newData = {
      id: formData.id,
      title: formData.title,
      category: formData.category,
      desc: formData.desc,
      timestamp: new Date().toISOString() // Generate timestamp automatically
    };

    let existingData = [];
    try {
      existingData = require('./data.js');
    } catch (error) {
      console.error("Error reading existing data:", error);
    }

    existingData.push(newData);

    await fs.writeFile('./data.js', `module.exports = ${JSON.stringify(existingData, null, 2)};`);

    res.status(200).json(newData);
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// New endpoint to fetch data
app.get('/api/getData', async (req, res) => {
  try {
    const data = require('./data.js');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
