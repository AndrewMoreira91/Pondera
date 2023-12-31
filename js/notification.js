(async () => {
    
    let granted = false
    
    if (Notification.permission === 'granted') {
        granted = true
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission()

        granted = permission === 'granted' ? true : false
    }

    let contextDescanso = false

    document.addEventListener('Context-descanso', () => contextDescanso = true)

    document.addEventListener('timeFinished', () => {
        if (granted) {
            if(contextDescanso) {
                const notificationDescanso = new Notification('Se periodo de descanso acabou', {
                    icon: './images/cronometro.png',
                    body: 'Gostaria de iniciar a sua sessão de concentração agora?'
                })
                notificationDescanso.addEventListener('click', () => document.dispatchEvent(new CustomEvent('notificationClickDescanso')))
            } else {
                const notificationFoco = new Notification('Bom trabalho! você terminou sua sessão de concentração.', {
                    icon: './images/cronometro.png',
                    body: 'Sua sessão de descanso ja começou'
                })
                notificationFoco.addEventListener('show', () => document.dispatchEvent(new CustomEvent('notificationClickFoco')))

            }
        }
    })


}) ()