const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import Mongoose for MongoDB connection
const { Schema } = mongoose;
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use(cors({
  origin: ["https://datafetchfrontend.onrender.com","https://zippy-elf-f5f304.netlify.app","http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// Connect to MongoDB
mongoose.connect('mongodb+srv://kiksymyguy:Michealanike123@cluster0.78vjdgj.mongodb.net/my_database')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

//1 Create a Mongoose schema for the data
const dataSchema = new Schema({
  id: String,
  title: String,
  category: String,
  desc: String,
  timestamp: { type: Date, default: Date.now }
});

//2 Create a Mongoose model for the data
const Data = mongoose.model('Data', dataSchema, 'datas');

//3 post New endpoint to save data to MongoDB
app.post('/api/saveData', async (req, res) => {
  try {
    const formData = req.body;
    const newData = new Data({
      id: formData.id,
      title: formData.title,
      category: formData.category,
      desc: formData.desc
    });
    const savedData = await newData.save();
    res.status(200).json(savedData);
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//4 get New endpoint to fetch data from MongoDB
app.get('/api/getData', async (req, res) => {
  try {
    const data = await Data.find();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//1 Create a Mongoose schema for the the upload pictures form
const pictureSchema = new mongoose.Schema({
  id: String,
  firstName: String,
  lastName: String,
  dob: Date,
  picturePath: String,
  timestamp: { type: Date, default: Date.now }
});

//2 Create a Mongoose model for the data
const Picture = mongoose.model('Picture', pictureSchema, 'pictures');

//3a Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const filename = uuidv4() + '.' + ext;
    cb(null, filename);
  }
});

//3b Multer upload configuration
const upload = multer({ storage: storage });

//4 save New endpoint to save data and upload picture to MongoDB
app.post('/api/savePicture', upload.single('picture'), async (req, res) => {
  try {
    const { firstName, lastName, dob } = req.body;
    const picturePath = req.file.path;
    const newPicture = new Picture({
      id: uuidv4(),
      firstName,
      lastName,
      dob,
      picturePath
    });
    const savedPicture = await newPicture.save();
    res.status(200).json(savedPicture);
  } catch (error) {
    console.error('Error saving picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//5 get New endpoint to fetch all pictures from MongoDB
app.get('/api/getPictures', async (req, res) => {
  try {
    const pictures = await Picture.find();
    res.status(200).json(pictures);
  } catch (error) {
    console.error('Error fetching pictures:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
