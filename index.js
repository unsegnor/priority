const Prioritizer = require('./domain/Prioritizer')
const TimeController = require('./domain/TimeController')

module.exports = {
    createNew: function(repository, timeController = new TimeController()){
        return new Prioritizer(repository, timeController)
    }
}
