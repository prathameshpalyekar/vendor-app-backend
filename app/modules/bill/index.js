import Hoek from 'hoek';
import Joi from 'joi';
let internals = {};

internals.register = (server, options, next) => {
    server.route([
        {
            method: 'POST',
            path: '/add',
            config: require('./handlers/Create')
        },{
            method: 'PUT',
            path: '/edit/{id}',
            config: require('./handlers/Update')
        }, {
            method: 'GET',
            path: '/all',
            config: require('./handlers/Index')
        }
    ]);
    next();
};


exports.register = function (server, options, next) {
    server.dependency(['RethinkDb'], internals.register(server, options, () => {
        return next();
    }));
};

exports.register.attributes = {
    name: 'bill'
};
