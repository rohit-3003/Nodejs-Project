document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addTodoButton = document.getElementById('add-todo');
    const todoList = document.getElementById('todo-list');

    addTodoButton.addEventListener('click', () => {
        const text = todoInput.value.trim();
        if (text) {
            fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            })
            .then(response => response.json())
            .then(todo => {
                renderTodo(todo);
                todoInput.value = '';
            });
        }
    });

    function renderTodo(todo) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
            <button class="toggle" data-id="${todo.id}">Toggle</button>
            <button class="delete" data-id="${todo.id}">Delete</button>
        `;
        todoList.appendChild(li);

        const toggleButton = li.querySelector('.toggle');
        toggleButton.addEventListener('click', () => {
            const completed = !todo.completed;
            fetch(`/api/todos/${todo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: todo.text, completed })
            })
            .then(response => response.json())
            .then(updatedTodo => {
                li.querySelector('span').classList.toggle('completed', updatedTodo.completed);
            });
        });

        const deleteButton = li.querySelector('.delete');
        deleteButton.addEventListener('click', () => {
            fetch(`/api/todos/${todo.id}`, { method: 'DELETE' })
            .then(() => li.remove());
        });
    }

    // Fetch initial todos
    fetch('/api/todos')
    .then(response => response.json())
    .then(todos => {
        todos.forEach(todo => renderTodo(todo));
    });
});
