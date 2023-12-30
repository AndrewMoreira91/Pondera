const btnPlayPause = document.querySelector('.app--card-button-play-pause');
const numberMinutes = document.querySelector('#timer-minutes');
const numberSeconds = document.querySelector('#timer-seconds');
const imgBtnPlayPause = document.querySelector('.img-card-button-play');
const textTimeProgress = document.querySelector('#text-time-progress');
const btnReset = document.querySelector('.app--card-button-reset');
const progressBar = document.querySelector('#progress-content');
const audioAlert = new Audio('./sounds/alert.wav');
const audioPlay = new Audio('./sounds/play.mp3');
const audioPause = new Audio('./sounds/pause.wav');
audioAlert.volume = 0.6
audioPlay.volume = 0.3;
audioPause.volume = 0.2;

const timeOfSessionInSeconds = 60

let timeInSeconds = JSON.parse(localStorage.getItem('Past-time')) || timeOfSessionInSeconds;
let timeConcluded = JSON.parse(localStorage.getItem('Time-concluded')) || 0;
let listTimesCocludeds = JSON.parse(localStorage.getItem('List-time-concluded')) || [];
let completedGoal = false

let interval = null;
let targetDailyTime = 135;

function changeLocalStorage(item, value) {
    localStorage.setItem(item, JSON.stringify(value))
}

btnPlayPause.addEventListener('click', start)

document.addEventListener('notificationClick', start)

btnReset.addEventListener('click', () => {
    timeInSeconds = timeOfSessionInSeconds
    changeLocalStorage('Past-time',timeInSeconds)
    mostrarContador()
})

function contagemRegressiva() {
    if (timeInSeconds <= 0) {
        imgBtnPlayPause.setAttribute('src', './images/play.png')
        audioAlert.play()

        timeInSeconds = timeOfSessionInSeconds

        mostrarContador();
        zerar()

        const event = new CustomEvent('timeFinished')
        document.dispatchEvent(event)
        return
    }
    console.log('Tempo decorrido em segundos:', timeInSeconds);
    timeInSeconds--;
    changeLocalStorage('Past-time', timeInSeconds)

    timeConcluded ++;
    changeLocalStorage('Time-concluded', timeConcluded)
    changeProgressBar()
    showTextProgress()
    mostrarContador()
}

function start() {
    if(interval) {
        audioPause.play()
        imgBtnPlayPause.setAttribute('src', './images/play.png')
        zerar()
        return
    }
    audioPlay.play()
    imgBtnPlayPause.setAttribute('src', './images/pause.png')
    interval = setInterval(contagemRegressiva, 1000)
}

function zerar() {
    clearInterval(interval)
    interval = null
}

function mostrarContador() {
    let time = new Date(timeInSeconds * 1000)
    const timeMinute = time.toLocaleTimeString('pt-br',{minute: '2-digit'})
    const timeSecond = time.toLocaleTimeString('pt-br',{second: '2-digit'})

    numberMinutes.textContent = `${timeMinute}`
    numberSeconds.textContent = `${timeSecond}`
}

function showTextProgress() {
    let dateTimeConcluded = new Date(timeConcluded * 1000);
    hourFormated = dateTimeConcluded.getUTCHours()
    minutesFormated = dateTimeConcluded.getUTCMinutes()
    const textFormated = `${hourFormated} ${hourFormated === 1 ? 'hora' : 'horas'} e ${minutesFormated} ${minutesFormated === 1 ? 'minuto' : 'minutos'}`
    textTimeProgress.textContent = textFormated
}

let speed = 1 / (targetDailyTime / 100)
progress = speed * timeConcluded

function changeProgressBar() {
    timeConcluded === 0 ? progress = 0 : progress += speed;
    completedGoal = progress >= 100 ? true : false;
    progressBar.setAttribute('style', `width: ${progress}%`)
    console.log('Progresso da barra:', progress)
}

const dayObject = {
    timeConcluded: timeConcluded,
    completeGoal: completedGoal
}
listTimesCocludeds.push(dayObject)
changeLocalStorage('List-time-concluded', listTimesCocludeds)
timeConcluded = 0
changeLocalStorage('Time-concluded', timeConcluded)

changeProgressBar()
showTextProgress()
mostrarContador()