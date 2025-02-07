import "./style.css";

const BASE_URL = "https://www.omidfaryabi.ir/api/todo";

const addTodoDialog = document.querySelector("#add-todo-dialog");
const editTodoDialog = document.querySelector("#edit-todo-dialog");
const addTodoBtn = document.querySelector("#add-todo-btn");
const dialogCloseBtn = document.querySelector("#dialog-close-btn");
const editDialogCloseBtn = document.querySelector("#edit-dialog-close-btn");
const addTodoForm = document.querySelector("#add-todo-form");
const todoList = document.querySelector("#todo-list");
const deleteTodoBtn = document.querySelector("#delete-todo-btn");
const editTodoForm = document.querySelector("#edit-todo-form");

async function getTodos() {
  if (!localStorage.getItem("userId")) return [];
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      "x-user-id": localStorage.getItem("userId"),
    },
  });
  const data = await res.json();

  return data.map((todo) => ({
    todoName: todo.title,
    todoID: todo.id,
    isDone: todo.is_done,
  }));
}

let todos = localStorage.getItem("userId") ? await getTodos() : [];

renderTodo(todos);
if (todos.length > 0) {
  todoList.previousElementSibling.classList.add("hidden");
} else {
  todoList.previousElementSibling.classList.remove("hidden");
}
addTodoBtn.addEventListener("click", () => {
  addTodoDialog.showModal();
});
dialogCloseBtn.addEventListener("click", () => {
  addTodoDialog.close();
});
editDialogCloseBtn.addEventListener("click", () => {
  editTodoDialog.close();
});
addTodoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const todoName = e.target["todo-name"].value;
  if (!todoName) return;

  // const todoItem = { todoName, isDone: false, todoID: crypto.randomUUID() };

  addTodo(todoName);

  addTodoDialog.close();
  addTodoForm.reset();
});
todoList.addEventListener("click", async (e) => {
  if (e.target.parentNode.id === "todo-edit-btn") {
    const todoID =
      e.target.parentNode.previousElementSibling.children.item(0).id;
    openEditModal(todoID);
  }
  if (e.target.type === "checkbox") {
    const res = await fetch(BASE_URL, {
      method: "PATCH",
      body: JSON.stringify({
        id: e.target.id,
        is_done: !todos.find((todo) => todo.todoID === +e.target.id).isDone,
      }),
      headers: {
        "x-user-id": localStorage.getItem("userId"),
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (res.ok) {
      todos = todos.map((todo) => {
        if (todo.todoID === +e.target.id) {
          return { ...todo, isDone: !todo.isDone };
        }
        return todo;
      });
      renderTodo(todos);
    } else {
      alert(data.error);
    }
  }
});

deleteTodoBtn.addEventListener("click", deleteTodo);
editTodoForm.addEventListener("submit", editTodo);

async function postTodo(todo) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (localStorage.getItem("userId")) {
    headers["x-user-id"] = localStorage.getItem("userId");
  }

  const response = await fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({ title: todo, description: "" }),
    headers,
  });
  const data = await response.json();

  todos = [
    ...todos,
    {
      todoName: localStorage.getItem("userId") ? data.title : data.todo.title,
      isDone: false,
      todoID: localStorage.getItem("userId") ? data.id : data.todo.id,
    },
  ];

  if (!localStorage.getItem("userId")) {
    localStorage.setItem("userId", data.userId);
  }
  console.log(data);

  console.log(data);
}

async function addTodo(todo) {
  await postTodo(todo);
  renderTodo(todos);
  if (todos.length > 0) {
    todoList.previousElementSibling.classList.add("hidden");
  } else {
    todoList.previousElementSibling.classList.remove("hidden");
  }
}
function renderTodo(todos) {
  todoList.innerHTML = "";
  todos.map((todo) => {
    todoList.innerHTML += `
    <li class="flex justify-between" >
              <div class="flex items-center justify-center gap-4">
                <input type="checkbox" class="peer hidden" id=${todo.todoID} ${
      todo.isDone ? "checked" : ""
    } />
                <label
                  for=${todo.todoID}
                  class="size-10 rounded-full border-4 border-gray-500 peer-checked:bg-gray-500 cursor-pointer"
                >
                  <img src="./src/assets/icons/checkmark-outline.svg" />
                </label>
                <label for=${todo.todoID} class="${
      todo.isDone ? "line-through text-3xl text-gray-400" : "text-3xl"
    }">${todo.todoName}</label>
              </div>

              <button class="w-12" id="todo-edit-btn">
                <img src="./src/assets/icons/ellipsis-horizontal-sharp.svg" />
                <span class="sr-only">options</span>
              </button>
            </li>
    `;
  });

  // Array.from(todoList.querySelectorAll("button")).map((btn) =>
  //   btn.addEventListener("click", () => openEditModal())
  // );
  saveTodos(JSON.stringify(todos));
}

function openEditModal(id) {
  const editForm = editTodoDialog.children.item(1);
  editForm.dataset.editId = id;
  console.log(id);
  const editTodo = todos.find((todo) => todo.todoID === +id);
  console.log(todos);
  console.log(editTodo);
  editForm.children.item(0).value = editTodo.todoName;
  editTodoDialog.showModal();
}

async function deleteTodo(e) {
  const editId = e.target.parentNode.dataset.editId;

  const res = await fetch(BASE_URL, {
    method: "DELETE",
    body: JSON.stringify({ id: editId }),
    headers: {
      "x-user-id": localStorage.getItem("userId"),
    },
  });
  const data = await res.json();

  if (res.ok) {
    console.log(data);
    console.log(todos);
    todos = todos.filter((todo) => todo.todoID !== +editId);

    renderTodo(todos);
    if (todos.length > 0) {
      todoList.previousElementSibling.classList.add("hidden");
    } else {
      todoList.previousElementSibling.classList.remove("hidden");
    }
    editTodoDialog.close();
  } else {
    alert(data.error);
  }
}
async function editTodo(event) {
  event.preventDefault();
  const editValue = event.target["edited-todo-name"].value;
  const editId = event.target.dataset.editId;

  const res = await fetch(BASE_URL, {
    method: "PATCH",
    body: JSON.stringify({ id: editId, title: editValue }),
    headers: {
      "x-user-id": localStorage.getItem("userId"),
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (res.ok) {
    todos = todos.map((todo) => {
      if (todo.todoID === +editId) {
        return { ...todo, todoName: editValue };
      } else {
        return todo;
      }
    });

    renderTodo(todos);
    editTodoDialog.close();
  } else {
    alert(data.error);
  }
}

function saveTodos(todos) {
  localStorage.setItem("todos", todos);
}
