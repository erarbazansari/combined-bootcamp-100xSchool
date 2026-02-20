const todos = document.getElementById("todos");
const submit = document.getElementById("submit");
const inputValue = document.getElementById("todoContent");

submit.addEventListener("click", (e) => {
    e.preventDefault();
    if (!inputValue.value) return;

    const value = inputValue.value;
    const paraEle = document.createElement("p");
    paraEle.innerText = value;
    todos.appendChild(paraEle);
    inputValue.value = "";
});
