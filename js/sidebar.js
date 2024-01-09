const btnCloseSidebar = document.querySelector('.btn-close-config');
const inputTimeFocus = document.querySelector('#input-time-focus');
const inputTimeRest = document.querySelector('#input-time-rest');
const inputTargetTime = document.querySelector('#input-target-time');
const inputNotifications = document.querySelector('#input-notifications');

btnCloseSidebar.addEventListener('click', () => {
    sideBarConfig.classList.add('sidebar-disabled');
})

inputTimeFocus.addEventListener('change', () => {
    timeFocus = convertFormattedTimeToSeconds(inputTimeFocus.value)
    timeInSeconds = checkContext() ? timeFocus : timeRest
    updateConfig()
    updateLocalStorage('Time-focus', timeFocus)
})

inputTimeRest.addEventListener('change', () => {
    timeRest = convertFormattedTimeToSeconds(inputTimeRest.value)
    timeInSeconds = checkContext() ? timeFocus : timeRest
    updateConfig()
    updateLocalStorage('Time-rest', timeRest)
})

inputTargetTime.addEventListener('change', () => {
    targetDailyTime = convertFormattedTimeToSeconds(inputTargetTime.value)
    updateConfig()
    updateLocalStorage('Target-time', targetDailyTime)
    calculatedProgress()
    changeTextGoal()
})

function updateConfig() {
    inputTimeFocus.value = convertSecondsToFormattedTime(timeFocus)
    inputTimeRest.value = convertSecondsToFormattedTime(timeRest)
    inputTargetTime.value = convertSecondsToFormattedTime(targetDailyTime)
    if (Notification.permission === 'granted') {
        inputNotifications.checked = true
    } else {
        inputNotifications.checked = false
    }
    showTimer()
}

function convertFormattedTimeToSeconds(formattedTime) {
    let timeSplited = formattedTime.split(':')
    let hourInSeconds = Number(timeSplited[0]) * 3600
    let minutesInSeconds = Number(timeSplited[1]) * 60
    return hourInSeconds + minutesInSeconds
}

function convertSecondsToFormattedTime(timeInSeconds) {
    let timeDate = new Date(timeInSeconds * 1000);
    let hourFormated = timeDate.getUTCHours()
    let minutesFormated = timeDate.getUTCMinutes()
    hourFormated < 10 ? hourFormated = `0${hourFormated}` : hourFormated
    minutesFormated < 10 ? minutesFormated = `0${minutesFormated}` : minutesFormated
    return `${hourFormated}:${minutesFormated}`
}

updateConfig()