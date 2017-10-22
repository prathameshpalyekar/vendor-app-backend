import Relish from './libs/relish.js';

module.exports = function () {

    var manifest =  {
        server: {
            connections: {
                router: {
                    isCaseSensitive: false
                }
            },
            debug:  {
                log: ['error', 'info'],
                request: ['error', 'info']
            },
            cache: {
                name: 'rethinkCache',
                engine: require('catbox-rethinkdb'),
                host: process.env.RETHINK_DB_HOST,
                port: process.env.RETHINK_DB_PORT,
                db: process.env.RETHINK_DB_NAME,                
                // flushInterval:
            }
        },
        connections: [{
            host: process.env.SERVER_HOST,
            port: process.env.SERVER_PORT,
            labels: 'web',
            routes: {
                validate: {
                    failAction: Relish.failAction
                }
                // cors: process.env.ENVIORNMENT === 'development',
            },
        }],
        registrations: [{
            plugin: {
                register: 'good',
                options: {
                    opsInterval: 1000,
                    reporters: [{
                        reporter: require('good-console'),
                        events:[{ log: '*'}]
                    }]
                }
            },
        }, {
            plugin: {
                register: 'blipp',
                options: {
                    showAuth: true,
                    showStart: true
                }
            }
        }, {
            plugin: {
                register: './plugins/rethinkdb',
                options: {
                    host: process.env.RETHINK_DB_HOST,
                    port: process.env.RETHINK_DB_PORT,
                    db: process.env.RETHINK_DB_NAME,
                    modelsDir: '/app/database/models'
                }
            }
        }, {
            plugin: 'vision'
        }, {
            plugin: 'inert'
        }, {
            plugin: 'hapi-auth-cookie'
        }, {
            plugin: {
                register: './modules/authentication',
                options: {
                    secret: process.env.AUTH_SECRET,
                    cookieName: process.env.AUTH_COOKIE_NAME
                }
            },
            options: {
                routes: {
                    prefix: '/api'
                }
            }
        },{
            plugin: {
                register: './modules/settings',
                options: {}
            },
            options: {
                routes: {
                    prefix: '/api/user'
                }
            }
        },{
            plugin: {
                register: './modules/bill',
                options: {}
            },
            options: {
                routes: {
                    prefix: '/api/bill'
                }
            }
        },{
            plugin: {
                register: './modules/foodItem',
                options: {}
            },
            options: {
                routes: {
                    prefix: '/api/food'
                }
            }
        },{
            plugin: {
                register: './modules/foodCategory',
                options: {}
            },
            options: {
                routes: {
                    prefix: '/api/food-category'
                }
            }
        },{
            plugin: {
                register: './modules/app',
                options: {}
            }
        }]
    };

    return manifest;
};
