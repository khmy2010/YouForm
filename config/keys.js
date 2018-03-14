if (process.env.NODE_ENV === 'production') {
    //production environment
    module.exports = require('./prod');
} else {
    //development environment
    module.exports = require('./dev');
}
