const inputNewTask = document.querySelector('#input-create-new-task')
const conteinerInput = document.querySelector('.app--create-new-task-input-button')
const btnCreateNewTask = document.querySelector('.app--card-create-new-task-button')
const ulTasksList = document.querySelector('.app--card-tasks-list')

let taskList = JSON.parse(localStorage.getItem('Tasks')) || []

taskList.forEach(task => {
    const taskElement = createTaskElement(task)
    ulTasksList.append(taskElement)
});

inputNewTask.addEventListener('focus', () => {
    conteinerInput.setAttribute('style', 'border: 1.5px solid var(--color-orange-top)')
})
inputNewTask.addEventListener('blur', () => {
    conteinerInput.setAttribute('style', '')
})

function createTaskElement(task) {
    const li = document.createElement("li")
    li.classList.add('app-card-task-item')
    const span = document.createElement('span')
    span.classList.add('app-card-task-description')

    span.textContent = task.description
    
    li.append(span)

    return li
}

btnCreateNewTask.addEventListener('click', () => {
    const taksObject = {
        description: inputNewTask.value
    }
    taskList.push(taksObject)
    localStorage.setItem('Tasks', JSON.stringify(taskList))
    const taskElement = createTaskElement(taksObject);
    ulTasksList.append(taskElement)
    inputNewTask.value = ''
})