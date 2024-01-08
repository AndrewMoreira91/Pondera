// Selecting DOM elements
const inputNewTask = document.querySelector('#input-create-new-task');
const conteinerInput = document.querySelector('.app--create-new-task-input-button');
const btnCreateNewTask = document.querySelector('.app--card-create-new-task-button');
const ulTasksList = document.querySelector('.app--card-tasks-list');
const textTaskProgress = document.querySelector('#task-in-progress');
const btnClearConcludedTasks = document.querySelector('.btn-clear-task-concluded')
const btnClearAllTasks= document.querySelector('.btn-clear-all-task')
const modalAlert = document.querySelector('#modal-alert')
const btnModalAlertConfirm = document.querySelector('.modal-alert-button-confirm')
const btnModalAlertCancel = document.querySelector('.modal-alert-button-cancel')

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
    const btnDelete = document.createElement('button');
    btnDelete.classList.add('app-card-task-button');
    const imgDelete = document.createElement('img');
    imgDelete.setAttribute('src', './images/icons/delete.svg');
    const btnEdit = document.createElement('button');
    btnEdit.classList.add('app-card-task-button');
    const imgEdit = document.createElement('img');
    imgEdit.setAttribute('src', './images/icons/edit.svg');
    const btnCheck = document.createElement('button');
    btnCheck.classList.add('app-card-task-button', 'hidden');
    const imgCheck = document.createElement('img');
    imgCheck.setAttribute('src', './images/icons/check.svg');

    const btnsConteiner = document.createElement('div');
    btnsConteiner.classList.add('app-card-task-buttons-conteiner');
    btnsConteiner.append(btnDelete);
    btnsConteiner.append(btnEdit);
    btnsConteiner.append(btnCheck);
    // Appending child elements
    btnDelete.append(imgDelete);
    btnEdit.append(imgEdit);
    btnCheck.append(imgCheck);

    const inputEdit = document.createElement('input');
    inputEdit.setAttribute('type', 'text');
    inputEdit.classList.add('app-card-task-item-input-edit', 'hidden');

    span.textContent = task.description;

    li.append(span);
    li.append(inputEdit);
    li.append(btnsConteiner);

    // Adjusting styles based on the completion status of the task
    if (task.complete) {
        li.classList.add('app-card-task-item-complete', 'disabled');
        li.classList.remove('app-card-task-item-active');
        btnDelete.classList.add('hidden');
        btnEdit.classList.add('hidden');
    }

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

    btnDelete.onclick = () => {
        li.remove();
        taskList = taskList.filter(taskItem => taskItem !== task);
        updateTasksStorage();
        textTaskProgress.textContent = textDefault;
    }

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

// Function to create and display tasks in the UI
function createTasks() {
    taskList.forEach(task => {
        const taskElement = createTaskElement(task);
        ulTasksList.append(taskElement);
    });
}

btnClearConcludedTasks.addEventListener('click', () => {
    // Removing completed tasks from the list
    taskList = taskList.filter(task => !task.complete);
    updateTasksStorage();
    ulTasksList.querySelectorAll('.app-card-task-item-complete').forEach(Element => {
        Element.remove();
    });
});

function closeModalAlert() { 
    modalAlert.classList.remove('visible');
    fadeModal.classList.remove('visible');
    console.log('closeModalAlert');
}

function clearAllTasks() {
    // Removing all tasks from the list
    taskList = [];
    updateTasksStorage();
    ulTasksList.querySelectorAll('.app-card-task-item').forEach(Element => {
        Element.remove();
    })
};

btnModalAlertConfirm.onclick = () => {
    closeModalAlert();
    clearAllTasks();
}

btnModalAlertCancel.onclick = () => {
    closeModalAlert();
}

btnClearAllTasks.addEventListener('click', () => {
    fadeModal.classList.add('visible');
    modalAlert.classList.add('visible');
});

// Event listener for timeFinished event
document.addEventListener('timeFinished', () => {
    if (taskSelected && liElementSelected) {
        // Updating the completed status of the selected task
        liElementSelected.classList.add('app-card-task-item-complete', 'disabled');
        liElementSelected.classList.remove('app-card-task-item-active');
        liElementSelected.querySelector('button').classList.add('hidden');
        taskSelected.complete = true;
        updateTasksStorage();
        moveCompletedTasksToFront()
    }
});

function moveCompletedTasksToFront() {
    ulTasksList.querySelectorAll('.app-card-task-item-complete').forEach(Element => {
        ulTasksList.prepend(Element);
    });
    let newList = taskList.filter(task => task.complete);
    newList = newList.concat(taskList.filter(task => !task.complete));
    taskList = newList;
    updateTasksStorage();
}

// Function to update tasks in local storage
function updateTasksStorage() {
    localStorage.setItem('Tasks', JSON.stringify(taskList));
}

// Initial creation and display of tasks when the page loads
createTasks();
moveCompletedTasksToFront()