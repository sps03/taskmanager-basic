document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const popupContainer = document.getElementById('popup-container');

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToDOM(task.text, task.completed);
        });
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('.task-text').textContent,
                completed: taskItem.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function showPopup(message) {
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.textContent = message;
        popupContainer.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 3000);
    }

    function addTaskToDOM(taskText, completed = false) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (completed) {
            taskItem.classList.add('completed');
        }

        const taskTextNode = document.createElement('span');
        taskTextNode.classList.add('task-text');
        taskTextNode.textContent = taskText;

        const completeBtn = document.createElement('button');
        completeBtn.innerHTML = '&#10003;';
        completeBtn.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            if (taskItem.classList.contains('completed')) {
                taskItem.classList.add('checkmark');
                setTimeout(() => taskItem.classList.remove('checkmark'), 300);
                showPopup(`Task "${taskText}" completed`);
            }
            saveTasks();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&#10005;';
        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(taskItem);
            saveTasks();
            showPopup(`Task "${taskText}" deleted`);
        });

        taskItem.appendChild(taskTextNode);
        taskItem.appendChild(completeBtn);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);
    }

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTaskToDOM(taskText);
            taskInput.value = '';
            saveTasks();
            showPopup(`Task "${taskText}" added`);
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    loadTasks();
});
