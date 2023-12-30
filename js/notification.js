(async () => {
    
    let granted = false
    
    if (Notification.permission === 'granted') {
        granted = true
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission()

        granted = permission === 'granted' ? true : false
    }

    document.addEventListener('timeFinished', () => {
       if (granted) {
        const notification = new Notification('Bom trabalho! você terminou sua sessão de concentração.', {
            icon: './images/cronometro.png',
            body: 'Se quiser iniciar outra sessão, e só clicar nessa notificação.'
        })
        notification.addEventListener('click', () => document.dispatchEvent(new CustomEvent('notificationClick')))
       }
    })


}) ()