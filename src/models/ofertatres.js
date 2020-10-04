const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
  name: String,
  title: String,
  image: String,
  imagedos: String,
  imagetres: String,
  description: String,
  price: Number,
  amount: Number,
  status: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Ofertatres', NoteSchema);
