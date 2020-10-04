const helpers = {};


export async function toggleLike(task) {
  const url = `/api/posts/${task._id}/likes`;
  let postConLikeActualizado;
  if (task.estaLike) {
    await Axios.delete(url, {});
    postConLikeActualizado = {
      ...task,
      estaLike: false,
      numLikes: task.numLikes - 1
    };
  } else {
    await Axios.post(url, {});
    postConLikeActualizado = {
      ...task,
      estaLike: true,
      numLikes: task.numLikes + 1
    };
  }
  return postConLikeActualizado;
}



module.exports = helpers;
