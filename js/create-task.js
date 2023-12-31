const inputNewTask = document.querySelector('#input-create-new-task')
const conteinerInput = document.querySelector('.app--create-new-task-input-button')
const btnCreateNewTask = document.querySelector('.app--card-create-new-task-button')
const ulTasksList = document.querySelector('.app--card-tasks-list')
const textTaskProgress = document.querySelector('#task-in-progress')

let taskList = JSON.parse(localStorage.getItem('Tasks')) || []

const textDefault = 'Nenhuma tarefa selecionada'

let taskSelected = null
let liElementSelected = null

inputNewTask.addEventListener('focus', () => {
    conteinerInput.setAttribute('style', 'border: 2px solid var(--color-orange-top)')
})
inputNewTask.addEventListener('blur', () => {
    conteinerInput.setAttribute('style', '')
})

function createTaskElement(task) {
    const li = document.createElement("li")
    li.classList.add('app-card-task-item')
    const span = document.createElement('span')
    span.classList.add('app-card-task-description')
    const btnEdit = document.createElement('button')
    btnEdit.classList.add('app-card-task-button')
    const imgEdit = document.createElement('img')
    imgEdit.setAttribute('src', './images/edit.svg')
    const btnCheck = document.createElement('button')
    btnCheck.classList.add('app-card-task-button')
    const imgCheck = document.createElement('img')
    imgCheck.setAttribute('src', './images/check.svg')
    btnCheck.classList.add('hidden')
    
    btnCheck.append(imgCheck)
    btnEdit.append(imgEdit)
    
    const inputEdit = document.createElement('input')
    inputEdit.setAttribute('type', 'text')
    inputEdit.classList.add('app-card-task-item-input-edit')
    inputEdit.classList.add('hidden')
    
    span.textContent = task.description 
    
    if(task.complete) {
        li.classList.add('app-card-task-item-complete');
        li.classList.remove('app-card-task-item-active');
        li.classList.add('disabled')
        btnEdit.classList.add('hidden');
    }

    li.append(span)
    li.append(inputEdit)
    li.append(btnEdit)
    li.append(btnCheck)
    
    btnEdit.onclick = () => {
        inputEdit.classList.remove('hidden')
        span.style.display = 'none'
        btnCheck.classList.remove('hidden')
        btnEdit.classList.add('hidden')
        inputEdit.value = span.textContent
    }
    
    btnCheck.onclick = () => {
        changeDescription()
    }

    inputEdit.addEventListener('blur', () => changeDescription())

    inputEdit.addEventListener('keydown', event => {
        if(event.key === "Enter") {
            changeDescription()
        }
    })
    
    function changeDescription() {
        document.querySelector('.app-card-task-item').classList.add('app-card-task-item')
        inputEdit.classList.add('hidden')
        span.style.display = 'flex'
        btnCheck.classList.add('hidden')
        btnEdit.classList.remove('hidden')
        span.textContent = inputEdit.value
        task.description = inputEdit.value
        updateTasksStorage()
    }

    li.addEventListener('click', () => {
        if(span.style.display === 'none') {
            return
        }
        document.querySelectorAll('.app-card-task-item')
            .forEach(Element => {
                Element.classList.remove('app-card-task-item-active');
            })

        if(taskSelected == task) {
            textTaskProgress.textContent = textDefault
            taskSelected = null
            liElementSelected = null
            return
        }     
        taskSelected = task
        liElementSelected = li

        textTaskProgress.textContent = task.description
        li.classList.add('app-card-task-item-active');
    })
    
    return li
}

inputNewTask.addEventListener('keydown', event => event.code === 'Enter' ? submitNewTask() : false)
btnCreateNewTask.addEventListener('click', () => submitNewTask())


function submitNewTask() {
    if(inputNewTask.value) {
        const taksObject = {
            description: inputNewTask.value
        }
        taskList.push(taksObject)
        updateTasksStorage()
        const taskElement = createTaskElement(taksObject);
        ulTasksList.append(taskElement)
        inputNewTask.value = ''
    }
}

function updateTasksStorage() {
    localStorage.setItem('Tasks', JSON.stringify(taskList))
}

document.addEventListener('timeFinished', () => {
    if(taskSelected && liElementSelected) {
        liElementSelected.classList.add('app-card-task-item-complete');
        liElementSelected.classList.remove('app-card-task-item-active');
        liElementSelected.classList.add('disabled')
        liElementSelected.querySelector('button').classList.add('hidden');

        taskSelected.complete = true
        updateTasksStorage()
    }
})

document.addEventListener('Context-descanso', () => {
    ulTasksList.querySelectorAll('.app-card-task-item')
    .forEach(Element => {
        Element.classList.add('disabled')
        Element.classList.remove('app-card-task-item-active')
    })
})

document.addEventListener('Context-foco', () => {
    createTasks()
    textTaskProgress.textContent = textDefault
})

function createTasks() {
    taskList.forEach(task => {
        const taskElement = createTaskElement(task)
        ulTasksList.append(taskElement)
    });
}

createTasks()