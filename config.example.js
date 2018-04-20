var configuration = {

    dev: {
        // MySQL connection settings.
        database: {
            host: 	/* SQL server host. Example: 'localhost' 	*/,
    	    user: 	/* Database user name				*/,
            password: 	/* Database user password. 			*/,
            port: 	/* SQL server port 				*/,
            schema: 	/* Database name.				*/,
            dialect: 'mysql'
        },

        // Localhost server settings.
        server: {
            host: 'localhost',
            port: '5000'
        },
    
        // Mail service settings..
        email: { 
            service: 'gmail',
            user: /* User email address. 	*/,
            pass: /* User password		*/
        },
        
        // Session options.
        session: {
            key: /* Key used by user session 	*/,
            age: /* Session lifespan		*/
        }
    }
};

module.exports = configuration;
