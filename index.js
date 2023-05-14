const Prioritizer = require('./domain/Prioritizer')

module.exports = {
    createNew: function(repository){
        return Prioritizer(repository)
    }
}
