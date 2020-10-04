const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  resetPasswordToken: { type: String },
  resetPasswordExpires:{ type: String },
  direccion: String,
  telefono: Number,
  date: { type: Date, default: Date.now },
  gender: String,
    pic: String,
    uid: String,
    token: String,
});

UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
