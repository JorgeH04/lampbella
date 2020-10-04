const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const likeSchema = new mongoose.Schema(
  {
    task: {
      type: ObjectId,
      required: [true, 'Like debe estar asociado a un post'],
      ref: 'task',
      index: true
    },
    usuario: {
      type: ObjectId,
      required: [true, 'Like debe estar asociada a un usuario'],
      ref: 'usuario'
    }
  },
  { timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' } }
);

likeSchema.index({ post: 1, usuario: 1 });

const Like = mongoose.model('like', likeSchema);

module.exports = {
  Like
};
