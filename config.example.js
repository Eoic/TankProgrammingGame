var configuration = {

    dev: {
        // MySQL connection settings.
        database: {
            host: 		/* SQL server host. Example: 'localhost' 	*/,
            user: 		/* Database user name						*/,
            password: 	/* Database user password. 					*/,
            port: 		/* SQL server port 							*/,
            schema: 	/* Database name.							*/,
            dialect: 'mysql'
        },

		/*  */
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