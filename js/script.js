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
const inputModal = document.querySelector("#input-modal");
const btnModal = document.querySelector('#button-modal')

const audioAlert = new Audio('./sounds/alert.wav');
const audioPlay = new Audio('./sounds/play.mp3');
const audioPause = new Audio('./sounds/pause.wav');
audioAlert.volume = 0.6;
audioPlay.volume = 0.3;
audioPause.volume = 0.2;

let timeOfSessionInSeconds = 1500;
let targetDailyTime = JSON.parse(localStorage.getItem('Target-time')) || 0;

if (!targetDailyTime) {
    [fadeModal, modal].forEach(element => element.classList.toggle('hide')) 
}

let timeInSeconds = JSON.parse(localStorage.getItem('Past-time')) || timeOfSessionInSeconds;
let timeConcluded = JSON.parse(localStorage.getItem('Time-concluded')) || 0;
let listTimesCocludeds = JSON.parse(localStorage.getItem('List-time-concluded')) || [];
let sequenceConcludeds = JSON.parse(localStorage.getItem('Sequence-day'))

let dateToday = new Date();
dateToday =  dateToday.toLocaleDateString();
let dateInLocalStorage = JSON.parse(localStorage.getItem('Date-today')) || false
dateInLocalStorage = dateInLocalStorage  ? dateInLocalStorage : dateToday
console.log(dateInLocalStorage)

let completedGoal = false;
let interval = null;

let speed = 1 / (targetDailyTime / 100)
let progress = speed * timeConcluded

btnModal.addEventListener('click', () => {
    if(inputModal) {
        fadeModal.classList.add('hide')
        modal.classList.add('hide')

        targetDailyTime = Number(inputModal.value) 
        updateLocalStorage('Target-time', targetDailyTime)

        speed = 1 / (targetDailyTime / 100)
        progress = speed * timeConcluded

        changeTextGoal()
        showProgressText()
        changeProgressBar()
    }
})

btnPlayPause.addEventListener('click', start);

document.addEventListener('notificationClickDescanso', () => start());

btnNext.addEventListener('click', () => {
    changeContext()
})
function verificarContexto() {
    return html.getAttribute('data-contexto') === 'foco'
}

let context = false
let points = ''
let intervalPoints = null

function treePoints() {
    if(context) {
        console.log(points)
        if(points === '...') {
            return points = ''
        }
        points += '.'
        
        textTaskProgress.textContent = 'Descansando' + points
    }
}

function changeContext() {
    if (verificarContexto()) {
        
        const event = new CustomEvent('Context-descanso')
        document.dispatchEvent(event)
        html.setAttribute('data-contexto', 'descanso')
        timeOfSessionInSeconds = 900;
        timeInSeconds = timeOfSessionInSeconds

        context = true
        intervalPoints = setInterval(treePoints, 1000)
        
        showTimer()
    } else {
        const event = new CustomEvent('Context-foco')
        document.dispatchEvent(event)
        html.setAttribute('data-contexto', 'foco')
        timeOfSessionInSeconds = 1500
        timeInSeconds = timeOfSessionInSeconds

        context = false
        clearInterval(intervalPoints)
        showTimer()
    }
}

function updateLocalStorage(item, value) {
    localStorage.setItem(item, JSON.stringify(value))
}

btnReset.addEventListener('click', () => {
    timeInSeconds = timeOfSessionInSeconds;
    updateLocalStorage('Past-time', timeInSeconds);
    showTimer();
})

console.log(dateToday !== dateInLocalStorage)
if (dateToday !== dateInLocalStorage) {
    completedGoal = timeConcluded >= targetDailyTime ? true : false;
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
}

function countDown() {
    if (timeInSeconds <= 0) {
        imgBtnPlayPause.setAttribute('src', './images/play.svg')
        audioAlert.play()
        timeInSeconds = timeOfSessionInSeconds
        showTimer();
        reset()
        const event = new CustomEvent('timeFinished')
        document.dispatchEvent(event)

        if (verificarContexto()) {
            changeContext()
            start()
        } else {
            changeContext()
        }
        return
    }
    console.log('Tempo decorrido em segundos:', timeInSeconds);
    timeInSeconds--;

    updateLocalStorage('Past-time', timeInSeconds)
    
    verificarContexto() ? timeConcluded ++ : false;
    updateLocalStorage('Time-concluded', timeConcluded)
    changeProgressBar()
    showProgressText()
    showTimer()
}

function start() {
    if(interval) {
        audioPause.play()
        imgBtnPlayPause.setAttribute('src', './images/play.svg')
        reset()
        return
    }
    audioPlay.play()
    imgBtnPlayPause.setAttribute('src', './images/pause.svg')
    interval = setInterval(countDown, 1000)
}

function reset() {
    clearInterval(interval)
    interval = null
}

function showTimer() {
    const timeDate = new Date(timeInSeconds * 1000)
    const timeMinute = timeDate.toLocaleTimeString('pt-br',{minute: '2-digit'})
    const timeSecond = timeDate.toLocaleTimeString('pt-br',{second: '2-digit'})

    numberMinutes.textContent = `${timeMinute}`
    numberSeconds.textContent = `${timeSecond}`
}

function timeFormattedText(timeInSeconds) {
    let dateTimeConcluded = new Date(timeInSeconds * 1000);
    const hourFormated = dateTimeConcluded.getUTCHours()
    const minutesFormated = dateTimeConcluded.getUTCMinutes()
    const textHour = hourFormated === 1 ? 'hora' : 'horas'
    const textMinute = minutesFormated === 1 ? 'minuto' : 'minutos'

    if(timeInSeconds < 3600) {
        return `${minutesFormated} ${textMinute}`
    } else {
        return `${hourFormated} ${textHour} e ${minutesFormated} ${textMinute}`
    }
}

function showProgressText() {
    textTimeProgress.textContent = timeFormattedText(timeConcluded)
}

function changeTextGoal() {
    textTargetTime.textContent = timeFormattedText(targetDailyTime)
}

function changeProgressBar() {
    timeConcluded === 0 ? progress = 0 : progress += speed;
    progressBar.setAttribute('style', `width: ${progress}%`)
    console.log('Progresso da barra:', progress)
}

let daysConcludeds = 0
for(let i=listTimesCocludeds.length; i > 0; i--) {
    const element = listTimesCocludeds[i - 1];
    if (!element.completedGoal) {
        if(i === listTimesCocludeds.length) {
            daysConcludeds = 0
        }
        i = 0
    } else {
        daysConcludeds ++;
    }
}
sequenceConcludeds = daysConcludeds
updateLocalStorage('Sequence-day', daysConcludeds)

numberSequence.textContent = `${sequenceConcludeds} ${sequenceConcludeds === 1 ? 'dia' : 'dias'}`

function showTxtYday() {
    if (listTimesCocludeds.length >= 1) {
        const timeYesterday = listTimesCocludeds[listTimesCocludeds.length -1];
        const timeConcluded = timeYesterday.timeConcluded || 0
        textProgressYesteday.textContent = timeFormattedText(timeConcluded)
    }
}

changeTextGoal()
showTxtYday()
changeProgressBar()
showProgressText()
showTimer()