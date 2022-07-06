const Prioritizer = require('./domain/Prioritizer')

module.exports = {
    createNew: function(repository){
        return new Prioritizer(repository)
    }
}
