// Selecting DOM elements
const inputNewTask = document.querySelector('#input-create-new-task');
const conteinerInput = document.querySelector('.app--create-new-task-input-button');
const btnCreateNewTask = document.querySelector('.app--card-create-new-task-button');
const ulTasksList = document.querySelector('.app--card-tasks-list');
const textTaskProgress = document.querySelector('#task-in-progress');

// Initializing variables from local storage or using defaults
let taskList = JSON.parse(localStorage.getItem('Tasks')) || [];

const textDefault = 'Nenhuma tarefa selecionada';

// Variables to track the selected task and its corresponding DOM element
let taskSelected = null;
let liElementSelected = null;

// Event listeners for input focus and blur
inputNewTask.addEventListener('focus', () => {
    conteinerInput.setAttribute('style', 'border: 2px solid var(--color-orange-top)');
});
inputNewTask.addEventListener('blur', () => {
    conteinerInput.setAttribute('style', '');
});

// Function to create a task element in the DOM
function createTaskElement(task) {
    // Creating HTML elements
    const li = document.createElement("li");
    li.classList.add('app-card-task-item');
    const span = document.createElement('span');
    span.classList.add('app-card-task-description');
    const btnEdit = document.createElement('button');
    btnEdit.classList.add('app-card-task-button');
    const imgEdit = document.createElement('img');
    imgEdit.setAttribute('src', './images/icons/edit.svg');
    const btnCheck = document.createElement('button');
    btnCheck.classList.add('app-card-task-button', 'hidden');
    const imgCheck = document.createElement('img');
    imgCheck.setAttribute('src', './images/icons/check.svg');

    // Appending child elements
    btnCheck.append(imgCheck);
    btnEdit.append(imgEdit);

    const inputEdit = document.createElement('input');
    inputEdit.setAttribute('type', 'text');
    inputEdit.classList.add('app-card-task-item-input-edit', 'hidden');

    span.textContent = task.description;

    // Adjusting styles based on the completion status of the task
    if (task.complete) {
        li.classList.add('app-card-task-item-complete', 'disabled');
        li.classList.remove('app-card-task-item-active');
        btnEdit.classList.add('hidden');
    }

    li.append(span);
    li.append(inputEdit);
    li.append(btnEdit);
    li.append(btnCheck);

    // Event listeners for edit and check buttons
    btnEdit.onclick = () => {
        inputEdit.classList.remove('hidden');
        span.style.display = 'none';
        btnCheck.classList.remove('hidden');
        btnEdit.classList.add('hidden');
        inputEdit.value = span.textContent;
    };

    btnCheck.onclick = () => {
        changeDescription();
    };

    inputEdit.addEventListener('blur', () => changeDescription());

    inputEdit.addEventListener('keydown', event => {
        if (event.key === "Enter") {
            changeDescription();
        }
    });

    // Function to handle changes in task description
    function changeDescription() {
        document.querySelector('.app-card-task-item').classList.add('app-card-task-item');
        inputEdit.classList.add('hidden');
        span.style.display = 'flex';
        btnCheck.classList.add('hidden');
        btnEdit.classList.remove('hidden');
        span.textContent = inputEdit.value;
        task.description = inputEdit.value;
        updateTasksStorage();
    }

    // Event listener for selecting a task
    li.addEventListener('click', () => {
        if (span.style.display === 'none') {
            return;
        }

        // Deselecting other tasks
        document.querySelectorAll('.app-card-task-item').forEach(Element => {
            Element.classList.remove('app-card-task-item-active');
        });

        // Deselecting the current task if it's already selected
        if (taskSelected == task) {
            textTaskProgress.textContent = textDefault;
            taskSelected = null;
            liElementSelected = null;
            return;
        }

        // Selecting the current task
        taskSelected = task;
        liElementSelected = li;
        textTaskProgress.textContent = task.description;
        li.classList.add('app-card-task-item-active');
    });

    return li;
}

// Event listener for input's Enter key and button click to submit a new task
inputNewTask.addEventListener('keydown', event => event.code === 'Enter' ? submitNewTask() : false);
btnCreateNewTask.addEventListener('click', () => submitNewTask());

// Function to submit a new task
function submitNewTask() {
    if (inputNewTask.value) {
        // Creating a task object and adding it to the list
        const taskObject = {
            description: inputNewTask.value
        };
        taskList.push(taskObject);
        updateTasksStorage();

        // Creating a task element and appending it to the task list
        const taskElement = createTaskElement(taskObject);
        ulTasksList.append(taskElement);
        inputNewTask.value = '';
    }
}

// Function to update tasks in local storage
function updateTasksStorage() {
    localStorage.setItem('Tasks', JSON.stringify(taskList));
}

// Event listener for timeFinished event
document.addEventListener('timeFinished', () => {
    if (taskSelected && liElementSelected) {
        // Updating the completed status of the selected task
        liElementSelected.classList.add('app-card-task-item-complete', 'disabled');
        liElementSelected.classList.remove('app-card-task-item-active');
        liElementSelected.querySelector('button').classList.add('hidden');
        taskSelected.complete = true;
        updateTasksStorage();
    }
});

// Event listener for Context-descanso event
document.addEventListener('Context-rest', () => {
    // Disabling task items during rest context
    ulTasksList.querySelectorAll('.app-card-task-item').forEach(Element => {
        Element.classList.add('disabled');
        Element.classList.remove('app-card-task-item-active');
    });
});

// Function to create and display tasks in the UI
function createTasks() {
    taskList.forEach(task => {
        const taskElement = createTaskElement(task);
        ulTasksList.append(taskElement);
    });
}

// Initial creation and display of tasks when the page loads
createTasks();