const { Like } = require('./likes.model');
//const { Post } = require('../posts/posts.model');
const { Task } = require('../task/task.model');

function obtenerTodosLosLikes() {
  return Like.find({});
}

function obtenerLikes(postId) {
  return Like.find({
    task: tasktId
  });
}

function obtenerLike(postId, usuarioId) {
  return Like.findOne({
    task: taskId,
    usuario: usuarioId
  });
}

async function agregarLike(postId, usuarioId) {
  const likeYaExiste = await Like.findOne({
    task: taskId,
    usuario: usuarioId
  });

  if (likeYaExiste) {
    let err = new Error(
      `Usuario con id [${usuarioId}] ya tiene un like grabado en post con id [${taskId}].`
    );
    err.status = 409;
    throw err;
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId },
    {
      $inc: { numLikes: 1 }
    }
  );

  if (!task) {
    let err = new Error(`Post con id [${taskId}] no existe.`);
    err.status = 404;
    throw err;
  }

  return new Like({
    task: taskId,
    usuario: usuarioId
  }).save();
}

async function quitarLike(taskId, usuarioId) {
  const like = await Like.findOneAndRemove({
    task: taskId,
    usuario: usuarioId
  });

  if (!like) {
    let err = new Error(
      `Usuario con id [${usuarioId}] no dejo un like en post con id [${taskId}].`
    );
    err.status = 404;
    throw err;
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId },
    {
      $inc: { numLikes: -1 }
    }
  );

  if (!task) {
    let err = new Error(`Post con id [${taskId}] no existe.`);
    err.status = 404;
    throw err;
  }

  return like;
}

module.exports = {
  obtenerTodosLosLikes,
  obtenerLikes,
  obtenerLike,
  agregarLike,
  quitarLike
};
