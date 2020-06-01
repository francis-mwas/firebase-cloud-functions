const { db } = require("../util/admin");

// get all todo items
exports.getAllTodos = (req, res) => {
  db.collection("todos")
    .where("username", "==", req.user.username)
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let todos = [];

      data.forEach((doc) => {
        console.log("Hello there:", doc);
        todos.push({
          todoId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(todos);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// // get one todo
// exports.getOneTodo = (req, res) => {
//   const document = db.doc(`/todos/${req.params.todoId}`);
//   let todo = [];
//   document.get.then((data) => {
//     if (data) {
//       todo.push(data);
//     }
//   });
//   return res.json(todo);
// };

// create a todo item
exports.postOneTodo = (req, res) => {
  const { title, body } = req.body;

  if (title.trim() === "") {
    return res.status(400).json({
      title: "Title must be provided",
    });
  }

  if (body.trim() === "") {
    res.status(400).json({ body: "Body must not be empty" });
  }

  const newTodoItem = {
    username: req.user.username,
    title,
    body,
    createdAt: new Date().toString(),
  };

  db.collection("todos")
    .add(newTodoItem)
    .then((doc) => {
      const responseTodoItem = newTodoItem;
      responseTodoItem.id = doc.id;
      return res.json({
        status: true,
        message: "Todo item added successsfully",
        responseTodoItem,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};

// delete a todo item
exports.deleteTodo = (req, res) => {
  const document = db.doc(`/todos/${req.params.todoId}`);

  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        if (doc.data().username !== req.user.username) {
          return res.status(403).json({ error: "UnAuthorized" });
        }
        return res.status(404).json({ error: "Todo not found" });
      }
      return document.delete();
    })
    .then(() => {
      res.json({ message: "Todod item delete successfull" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// edit a todo item

exports.editTodo = (req, res) => {
  if (req.body.todoId || req.body.createdAt) {
    res.status(403).json({ message: "Not allowed to edit" });
  }
  let document = db.collection("todos").doc(`${req.params.todoId}`);
  document
    .update(req.body)
    .then(() => {
      res.json({ message: "Todo item updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code,
      });
    });
};
