import "./style.css";

const addTodoDialog = document.querySelector("#add-todo-dialog");
const editTodoDialog = document.querySelector("#edit-todo-dialog");
const addTodoBtn = document.querySelector("#add-todo-btn");
const dialogCloseBtn = document.querySelector("#dialog-close-btn");
const editDialogCloseBtn = document.querySelector("#edit-dialog-close-btn");
const addTodoForm = document.querySelector("#add-todo-form");
const todoList = document.querySelector("#todo-list");
const deleteTodoBtn = document.querySelector("#delete-todo-btn");
const editTodoForm = document.querySelector("#edit-todo-form");

let todos = localStorage.getItem("todos")
  ? JSON.parse(localStorage.getItem("todos"))
  : [];

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

  const todoItem = { todoName, isDone: false, todoID: crypto.randomUUID() };

  addTodo(todoItem);
  if (todos.length > 0) {
    todoList.previousElementSibling.classList.add("hidden");
  } else {
    todoList.previousElementSibling.classList.remove("hidden");
  }
  addTodoDialog.close();
  addTodoForm.reset();
});
todoList.addEventListener("click", (e) => {
  if (e.target.parentNode.id === "todo-edit-btn") {
    const todoID =
      e.target.parentNode.previousElementSibling.children.item(0).id;
    openEditModal(todoID);
  }
  if (e.target.type === "checkbox") {
    todos = todos.map((todo) => {
      if (todo.todoID === e.target.id) {
        return { ...todo, isDone: !todo.isDone };
      }
      return todo;
    });
    renderTodo(todos);
  }
});

deleteTodoBtn.addEventListener("click", deleteTodo);
editTodoForm.addEventListener("submit", editTodo);

function addTodo(todo) {
  todos = [...todos, todo];
  renderTodo(todos);
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
  const editTodo = todos.find((todo) => todo.todoID === id);
  editForm.children.item(0).value = editTodo.todoName;
  editTodoDialog.showModal();
}

function deleteTodo(e) {
  const editId = e.target.parentNode.dataset.editId;
  todos = todos.filter((todo) => todo.todoID !== editId);
  renderTodo(todos);
  if (todos.length > 0) {
    todoList.previousElementSibling.classList.add("hidden");
  } else {
    todoList.previousElementSibling.classList.remove("hidden");
  }
  editTodoDialog.close();
}
function editTodo(event) {
  event.preventDefault();
  const editValue = event.target["edited-todo-name"].value;
  const editId = event.target.dataset.editId;
  todos = todos.map((todo) => {
    if (todo.todoID === editId) {
      return { ...todo, todoName: editValue };
    } else {
      return todo;
    }
  });

  renderTodo(todos);
  editTodoDialog.close();
}

function saveTodos(todos) {
  localStorage.setItem("todos", todos);
}
