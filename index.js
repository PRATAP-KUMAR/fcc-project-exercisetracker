require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.DB_URL);

const UserSchema = new Schema({
  username: String,
})

const User = mongoose.model("User", UserSchema);

const ExerciseSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  description: String,
  duration: Number,
  date: Date
})

const Exercise = mongoose.model("Exercise", ExerciseSchema);

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// solution
app.post('/api/users', async (req, res) => {
  const { username } = req.body
  const userObj = new User({
    username
  })

  try {
    const user = await userObj.save();
    res.json(user);
  } catch (e) {
    console.log(e);
  }
})

app.get('/api/users', async (req, res) => {
  const users = await User.find({})
  res.json(users);
})

app.post('/api/users/:_id/exercises', async (req, res) => {
  const { description, duration } = req.body;
  const date = req.body.date || null;
  const { _id } = req.params;
  const user = await User.findById(_id);

  const obj = {
    username: user.username,
    user_id: user._id,
    description,
    duration,
    date: new Date(date).toDateString(),
  }

  const exerciseObj = new Exercise(obj)

  const exercise = await exerciseObj.save();

  res.json({
    _id: user._id,
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: new Date(date).toDateString(),
  });
})

app.get('/api/users:_id/logs', async(req, res) => {
  const {from, to, limit} = req.query;
  const {_id} = req.params;
  const user = await User.findById(_id);
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
