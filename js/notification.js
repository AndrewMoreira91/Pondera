(async () => {
    
    let granted = false
    
    if (Notification.permission === 'granted') {
        granted = true
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission()

        granted = permission === 'granted' ? true : false
    }

    let contextRest = false

    document.addEventListener('Context-rest', () => contextRest = true)

    document.addEventListener('timeFinished', () => {
        if (granted) {
            if(contextRest) {
                const notificationRest = new Notification('Se periodo de descanso acabou', {
                    icon: './images/cronometro.png',
                    body: 'Gostaria de iniciar a sua sessão de concentração agora?'
                })
                notificationRest.addEventListener('click', () => document.dispatchEvent(new CustomEvent('notificationClickRest')))
            } else {
                new Notification('Bom trabalho! você terminou sua sessão de concentração.', {
                    icon: './images/cronometro.png',
                    body: 'Sua sessão de descanso ja começou'
                })
            }
        }
    })


}) ()