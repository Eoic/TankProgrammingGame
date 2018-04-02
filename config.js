var configuration = {

    dev: {
        
        // MySQL connection settings.
        database: {
            host: '158.129.24.25',
            user: 'rq62napowN',
            password: '[[7f7372ffedjn]]',
            port: '3306',
            schema: 'projekto_db'
        },

        // Localhost server settings.
        server: {
            host: 'localhost',
            port: '5000'
        },
    
        // Mail service settings.
        email: { 
            service: 'gmail',
            user: 'badlogicgame@gmail.com',
            pass: 'BaDlOgIc123'
        },
        
        // Session options.
        session: {
            key: '2C44-4D44-WppQ38S',
            age: 30000000
        }
    }
};

module.exports = configuration;