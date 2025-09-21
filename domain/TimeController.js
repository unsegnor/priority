class TimeController {
    constructor() {
        this.currentTime = new Date()
        this.isTimeTravelEnabled = false
    }
    
    now() {
        return this.isTimeTravelEnabled ? new Date(this.currentTime) : new Date()
    }
    
    advance(milliseconds) {
        if (this.isTimeTravelEnabled) {
            this.currentTime = new Date(this.currentTime.getTime() + milliseconds)
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

module.exports = new TimeController()
