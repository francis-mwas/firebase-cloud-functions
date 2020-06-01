const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./util/auth");

const {
  getAllTodos,
  postOneTodo,
  deleteTodo,
  editTodo,
  // getOneTodo,
} = require("./API/todos");
const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails,
} = require("./API/users");
// const { getAllTodos } = require("./API/todo");

// todo routes
app.get("/todos", auth, getAllTodos);
// app.get("/todo/:todoId", auth, getOneTodo);
app.post("/todo", auth, postOneTodo);
app.delete("/todo/:todoId", auth, deleteTodo);
app.put("/todo/:todoId", auth, editTodo);

// user routes
app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, getUserDetail);
app.post("/user", auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
