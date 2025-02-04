import "./style.css";

const addTodoDialog = document.querySelector("#add-todo-dialog");
const editTodoDialog = document.querySelector("#edit-todo-dialog");

const addTodoBtn = document.querySelector("#add-todo-btn");
const dialogCloseBtn = document.querySelector("#dialog-close-btn");
const editDialogCloseBtn = document.querySelector("#edit-dialog-close-btn");
const addTodoForm = document.querySelector("#add-todo-form");
const todoList = document.querySelector("#todo-list");

// {todoName: "" , isDone: "" , todoID: ""}
let todos = [];

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

function addTodo(todo) {
  todos = [...todos, todo];
  renderTodo(todos);
}
function renderTodo(todos) {
  todoList.innerHTML = "";
  todos.map((todo) => {
    todoList.innerHTML += `
    <li class="flex justify-between" id=${todo.todoID}>
              <div class="flex items-center justify-center gap-4">
                <input type="checkbox" class="peer hidden" id="todo-status" />
                <label
                  for="todo-status"
                  class="size-10 rounded-full border-4 border-gray-500 peer-checked:bg-gray-500 cursor-pointer"
                >
                  <img src="./src/assets/icons/checkmark-outline.svg" />
                </label>
                <label for="todo-status" class="text-3xl">${todo.todoName}</label>
              </div>

              <button class="w-12">
                <img src="./src/assets/icons/ellipsis-horizontal-sharp.svg" />
                <span class="sr-only">options</span>
              </button>
            </li>
    `;
  });

  Array.from(todoList.querySelectorAll("button")).map((btn) =>
    btn.addEventListener("click", () => openEditModal())
  );
}

function openEditModal() {
  editTodoDialog.showModal();
  console.log("Sefasef");
}

function deleteTodo(todoId) {}
function saveTodos(todos) {}
function editTodo(params) {}
