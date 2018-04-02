if (process.env.NODE_ENV === 'production') {
    //production environment
    module.exports = require('./prod');
} else if (process.env.NODE_ENV === 'ci') {
    //CI environment
    module.exports = require('./ci');
} else {
    //development environment
    module.exports = require('./dev');
}
