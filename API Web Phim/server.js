const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3008;

// Add headers before the routes are defined
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Kết nối MongoDB
mongoose.connect('mongodb+srv://lenhathao280302:4wqHy8rKfHytAClc@cluster0.vwqwfmr.mongodb.net/?retryWrites=true&w=majority');

// Define the Movie model
const movieSchema = new mongoose.Schema({
  title: String,
  overview: String,
  poster_path: String,
  // Thêm các trường khác nếu cần
});

const Movie = mongoose.model('movies', movieSchema);


// API endpoint to get all movies
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// API endpoint to add a new movie



app.post('/api/addmovies', async (req, res) => {
  try {
    console.log('req.body:', req.body); // Kiểm tra dữ liệu được gửi từ client
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.json(savedMovie);
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// API endpoint to update a movie by ID
app.put('/api/movies/:id', async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint để tìm một bộ phim theo ID
app.get('/api/movies/:id', async (req, res) => {
  try {
    const foundMovie = await Movie.findById(req.params.id);

    // Kiểm tra xem bộ phim có tồn tại không
    if (!foundMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(foundMovie);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// API endpoint để xoá một bộ phim theo ID
// API endpoint để xoá một bộ phim theo ID
app.delete('/api/movies/:id', async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    // Kiểm tra xem bộ phim có tồn tại không
    if (!deletedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(deletedMovie);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Admin

// Định nghĩa Schema cho Admin
const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Tạo mô hình Admin từ Schema
const Admin = mongoose.model('Admin', adminSchema);

// API endpoint to get all admin data
app.get('/api/admins', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/admins/:email', async (req, res) => {
  try {
    const foundAdmin = await Admin.findOne({ email: req.params.email });

    // Kiểm tra xem admin có tồn tại không
    if (!foundAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(foundAdmin);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User
// Định nghĩa Schema cho User
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Tạo mô hình User từ Schema
const User = mongoose.model('User', userSchema);

// Middleware để parse JSON từ request body
app.use(express.json());

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// API endpoint để thêm user mới
app.post('/api/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint để xoá user theo ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint để sửa thông tin user theo ID
app.put('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint để tìm user theo email
app.get('/api/users/:email', async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.params.email });
    res.json(foundUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Bắt đầu server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
