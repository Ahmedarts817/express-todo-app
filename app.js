// require dependencies so they can be used throughout this code
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

// initialize Express.js server and save as a variable
// so it can be referred to as `app`
const app = express();

app.use(bodyParser.json());
let todos = require("./data.json"); // In-memory storage for todos
// Add this line near the top of your file, under the existing imports
const serveStatic = require("serve-static");
const { error } = require("console");

// Add this line after `app.use(bodyParser.json());`
app.use(serveStatic("public"));

// GET endpoint to fetch all todo items
app.get("/todos", (req, res) => {
  res.json(todos);
});

// POST endpoint to create a new todo item
// provide `title` and optionally `completed` in the request body as JSON
app.post("/todos", (req, res) => {
  const todo = {
    id: todos.length + 1,
    title: req.body.title,
    completed: req.body.completed || false,
  };
  try {
    todos.push(todo);

    fs.writeFileSync("./data.json", JSON.stringify(todos));
    res.status(201).json(todo);
  } catch (error) {
    console.log(error);
  }
});

// PUT endpiont to update an existing todo item with the specified `id`
// provide updated `title` and/or `completed` in the request body as JSON
app.put("/todos/:id", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log(data);

    //
    const id = parseInt(req.params.id);
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    todo.title = req.body.title || todo.title;
    todo.completed = req.body.completed || todo.completed;
    res.json(todo);

    //

    fs.writeFile("./data.json", JSON.stringify(todos), (err) => {
      if (err) {
        console.log("err");
        return;
      }
      console.log("success");
    });
  });
});

// DELETE endpoint to remove an existing todo item with the specified `id`
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  try {
    if (index === -1) {
      return res.status(404).json({ error: "Todo not found" });
    }
    todos.splice(index, 1);
    res.status(204).send();
    fs.writeFileSync("./data.json", JSON.stringify(todos));
  } catch (error) {
    console.log(error);
  }
});

// run the server on port 3000
// for example the app can run locally at this URL: http://localhost:3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
