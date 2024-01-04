// DOM elements
const html = document.querySelector('html')
const btnPlayPause = document.querySelector('.app--card-button-play-pause');
const numberMinutes = document.querySelector('#timer-minutes');
const numberSeconds = document.querySelector('#timer-seconds');
const imgBtnPlayPause = document.querySelector('.img-card-button-play');
const textTimeProgress = document.querySelector('#text-time-progress');
const btnReset = document.querySelector('.app--card-button-reset');
const progressBar = document.querySelector('#progress-content');
const textProgressYesteday = document.querySelector('#time-progress-yesterday');
const numberSequence = document.querySelector('#number-sequence-day');
const textTargetTime = document.querySelector('#text-target-time');
const btnNext = document.querySelector('.app--card-button-next');
const fadeModal = document.querySelector('#fade-modal');
const modal = document.querySelector('#modal');
const timerModal = document.querySelector("#timer-modal");
const btnModal = document.querySelector('#button-modal')
const textErroModal = document.querySelector('#text-erro')
const btnDropdown = document.querySelector('#button-dropdown')

// Audio Elements
const audioAlert = new Audio('./sounds/alert.wav');
const audioPlay = new Audio('./sounds/play.mp3');
const audioPause = new Audio('./sounds/pause.wav');
audioAlert.volume = 0.6;
audioPlay.volume = 0.3;
audioPause.volume = 0.2;

// Initial Settings
let timeFocus = 3;
let timeRest = 300;
let targetDailyTime = JSON.parse(localStorage.getItem('Target-time')) || 0;
let timeConcluded = JSON.parse(localStorage.getItem('Time-concluded')) || 0;
let listTimesCocludeds = JSON.parse(localStorage.getItem('List-time-concluded')) || [];
let sequenceConcludeds = JSON.parse(localStorage.getItem('Sequence-day'))
let intervalRest = null
const title = 'Pondera'

let timeInSeconds = timeFocus

let completedGoal = false;  // 

// Calculate the speed of progress based on the target daily time
let speed = 1 / (targetDailyTime / 100);
// Calculate the initial progress based on the speed and time already concluded
// The progress represents the completion percentage towards the daily goal
let progress = speed * timeConcluded;

let dateToday = new Date();
dateToday =  dateToday.toLocaleDateString(); // Get today's date
let dateInLocalStorage = JSON.parse(localStorage.getItem('Date-today')) || dateToday // Check if exist a date in local storage
updateLocalStorage('Date-today', dateToday)

const openModal = () => [fadeModal, modal].forEach(element => element.classList.toggle('hide'))

// Check if there s a target daily time set, if not, show the modal.
!targetDailyTime ? openModal() : false

btnDropdown.onclick = () => openModal()

// Event listeners
btnPlayPause.addEventListener('click', start);
btnNext.addEventListener('click', changeContext)
btnReset.addEventListener('click', () => {
    timeInSeconds = timeFocus;

    showTimer();
})
document.addEventListener('notificationClickRest', start);

// Function to handle modal button click
btnModal.addEventListener('click', () => {
    const [hour, minutes] = timerModal.value.split(':').map(Number);
    if( hour >= 0 && minutes) {
        targetDailyTime =  hour * 3600 + minutes * 60
        updateLocalStorage('Target-time', targetDailyTime)

        fadeModal.classList.add('hide')
        modal.classList.add('hide')

        speed = 1 / (targetDailyTime / 100)
        progress = speed * timeConcluded

        changeTextGoal()
        showProgressText()
        changeProgressBar()
    } else {
        textErroModal.classList.remove('hidden', 'hide')
    }
})

// Function for change the context
//The context changes when the clock time changes between focus or rest session
function changeContext() {
    if (checkContext()) {
        timeInSeconds = timeRest;
        
        const event = new CustomEvent('Context-rest')
        document.dispatchEvent(event)
        html.setAttribute('data-contexto', 'descanso')
        updateRestIndicator()
        showTimer()
    } else {
        timeInSeconds = timeFocus

        textTaskProgress.textContent = textDefault;
        html.setAttribute('data-contexto', 'foco')
        clearInterval(intervalRest)
        showTimer()
    }
}

// Checks the context, if it is focus it returns true, if it is rest it returns false
function checkContext() {
    return html.getAttribute('data-contexto') === 'foco'
}

// Function to start the timer
let intervalTimer = null; 
function start() {
    if(intervalTimer) {
        // audioPause.play()
        imgBtnPlayPause.setAttribute('src', './images/icons/play.svg')
        resetTimer()
        document.title = title
        return
    }
    audioPlay.play()
    imgBtnPlayPause.setAttribute('src', './images/icons/pause.svg')
    intervalTimer = setInterval(countDown, 1000)
}

/**
 * Countdown function that decrements the timer and performs actions when the timer reaches zero.
 * It updates the UI, checks if the timer has finished, and triggers context changes if necessary.
 */
function countDown() {
    if (timeInSeconds <= 0) {
        imgBtnPlayPause.setAttribute('src', './images/icons/play.svg')
        // audioAlert.play()
        timeInSeconds = changeContext ? timeFocus : timeRest
        const event = new CustomEvent('timeFinished')
        document.dispatchEvent(event)
        resetTimer()
        // If in focus context, switch context and start countdown, if in rest context, only switch context
        checkContext() ? changeContext() + start() : changeContext()

        showTimer();
        return
    }
    console.log('Tempo decorrido em segundos:', timeInSeconds);
    // Decrement the timer
    timeInSeconds--;
    // Increment timeConcluded if in rest context
    checkContext() ? timeConcluded ++ : updateRestIndicator();
    updateLocalStorage('Time-concluded', timeConcluded)

    // Update UI elements
    changeProgressBar()
    showProgressText()
    showTimer()
}

// Function to reset the timer
function resetTimer() {
    clearInterval(intervalTimer)
    intervalTimer = null
}

/**
 * Updates the UI elements displaying the remaining time on the timer.
 * It converts the timeInSeconds to a formatted string and updates the corresponding HTML elements.
 */
function showTimer() {
    const timeDate = new Date(timeInSeconds * 1000)
    let timeMinute = timeDate.toLocaleTimeString('pt-br',{minute: '2-digit'})
    timeMinute = timeMinute <= 9 ? '0'+ timeMinute : timeMinute
    let timeSecond = timeDate.toLocaleTimeString('pt-br',{second: '2-digit'})
    timeSecond = timeSecond <=9 ? '0' + timeSecond : timeSecond
    let textTitle = `${timeMinute} : ${timeSecond}`
    document.title = checkContext() ? 'Concentração ' + textTitle : 'Descanso ' + textTitle
    numberMinutes.textContent = `${timeMinute}`
    numberSeconds.textContent = `${timeSecond}`
}

/**
 * Updates the UI with a loading indicator during the rest context.
 * The loading indicator is represented by a sequence of dots.
 */
let dots = ''
function updateRestIndicator() {
    if(!checkContext()) {
        textTaskProgress.textContent = 'Descansando' + dots
        if(dots === '...') {
            return dots = ''
        }
        dots += '.'
    }
}

// Function to update the values in localStorage, requires two parameters key and the value.
function updateLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

// Check if the date has changed and update accordingly
if (dateToday !== dateInLocalStorage) {
    // Determine if the daily goal was completed based on timeConcluded and targetDailyTime
    completedGoal = timeConcluded >= targetDailyTime ? true : false;
    // Create an object to store information about the completed day
    const dayConcluded = {
        dateConcluded: dateToday,
        timeConcluded: timeConcluded,
        completedGoal: completedGoal
    }
    listTimesCocludeds.push(dayConcluded);
    updateLocalStorage('List-time-concluded', listTimesCocludeds);
    timeConcluded = 0;
    updateLocalStorage('Time-concluded', timeConcluded);
    updateLocalStorage('Date-today', dateToday)
    // Update the UI element to display the sequence information
    timeInSeconds = timeFocus
    showTimer()
}
/** Formats the time in seconds into a human-readable text representation.
 * It returns a string indicating the hours and minutes, or just minutes, depending on the duration.
*/
function formatTimeText(timeInSeconds) {
    let dateTimeConcluded = new Date(timeInSeconds * 1000);
    const hourFormated = dateTimeConcluded.getUTCHours()
    const minutesFormated = dateTimeConcluded.getUTCMinutes()
    // Determine the appropriate text for hours and minutes
    const textHour = hourFormated === 1 ? 'hora' : 'horas'
    const textMinute = minutesFormated === 1 ? 'minuto' : 'minutos'
    // if the time is less than an hour, return only the text in minutes, if it is greater, return minutes and hours
    if(timeInSeconds < 3600) {
        return `${minutesFormated} ${textMinute}`
    } else {
        return `${hourFormated} ${textHour} e ${minutesFormated} ${textMinute}`
    }
}

//Change the progress time and daily target texts in relation to the timeConcluded and targetDailyTime
function showProgressText() {
    textTimeProgress.textContent = formatTimeText(timeConcluded)
}
function changeTextGoal() {
    textTargetTime.textContent = formatTimeText(targetDailyTime)
}

// Updates the progress bar on the UI based on the current completion progress.
function changeProgressBar() {
    timeConcluded === 0 ? progress = 0 : progress += speed;
    // Set the style of the progress bar based on the calculated progress percentage
    progressBar.setAttribute('style', `width: ${progress}%`)
    console.log('Progresso da barra:', progress)
}

// Initialize the variable to count consecutive days with completed goals
let daysConcludeds = 0
// Loop through the list of concluded times starting from the latest
for(let i=listTimesCocludeds.length; i > 0; i--) {
    const element = listTimesCocludeds[i - 1];
    // Check if the goal for the day was not completed
    if (!element.completedGoal) {
        // If this is the latest entry, reset the count to 0
        if(i === listTimesCocludeds.length) {
            daysConcludeds = 0
        }
        i = 0
    } else {
        // Increment the count for consecutive days with completed goals
        daysConcludeds ++;
    }
}
// Update the sequenceConcludeds variable and store it in localStorage
sequenceConcludeds = daysConcludeds
updateLocalStorage('Sequence-day', daysConcludeds)
// Update the UI element to display the sequence information
numberSequence.textContent = `${sequenceConcludeds} ${sequenceConcludeds === 1 ? 'dia' : 'dias'}`

// Updates the UI element displaying the formatted text representing the time concluded on the previous day
function updatePreviousDayTimeText() {
    //check if there is any existing time in the listTimesCocludeds
    if (listTimesCocludeds.length >= 1) {
        const timeYesterday = listTimesCocludeds[listTimesCocludeds.length -1];
        const timeConcluded = timeYesterday.timeConcluded || 0
        textProgressYesteday.textContent = formatTimeText(timeConcluded)
    }
}

// Update UI elements
changeTextGoal()
updatePreviousDayTimeText()
changeProgressBar()
showProgressText()
showTimer()
document.title = title