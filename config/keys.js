switch (process.env.NODE_ENV) {
    case 'production':
        //production environment
        module.exports = require('./prod');
        break;
    case 'ci':
        //CI environment
        module.exports = require('./ci');
    case 'test':
        //test environment
        module.exports = require('./test_keys');
    default:
        //process.env.NODE_ENV is undefined in development environment
        //development environment
        module.exports = require('./dev');
}
