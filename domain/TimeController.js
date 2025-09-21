class TimeController {
    constructor() {
        this.currentTime = new Date()
        this.isTimeTravelEnabled = false
    }
    
    now() {
        return this.isTimeTravelEnabled ? new Date(this.currentTime) : new Date()
    }
    
    async advance(milliseconds) {
        if (this.isTimeTravelEnabled) {
            this.currentTime = new Date(this.currentTime.getTime() + milliseconds)
            return Promise.resolve()
        } else {
            // Espera real cuando time travel está deshabilitado
            return new Promise(resolve => {
                setTimeout(resolve, milliseconds)
            })
        }
    }
    
    enableTimeTravel(startTime = new Date()) {
        this.isTimeTravelEnabled = true
        this.currentTime = new Date(startTime)
    }
    
    disableTimeTravel() {
        this.isTimeTravelEnabled = false
    }
    
    setTime(time) {
        if (this.isTimeTravelEnabled) {
            this.currentTime = new Date(time)
        }
    }
}

// Crear instancia para inyección
module.exports = TimeController
