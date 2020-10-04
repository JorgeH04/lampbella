const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({

  views: { type: Number, default: 0 }

});

module.exports = mongoose.model('Index', NoteSchema);
