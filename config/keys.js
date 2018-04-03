switch (process.env.NODE_ENV) {
    case 'production':
        //production environment
        module.exports = require('./prod');
        break;
    case 'ci':
        //CI environment
        module.exports = require('./ci');
        break;
    case 'test':
        //test environment
        //somehow, it just want to use the same database with dev :(
        module.exports = require('./dev');
        break;
    default:
        //process.env.NODE_ENV is undefined in development environment
        //development environment
        module.exports = require('./dev');
        break;
}
