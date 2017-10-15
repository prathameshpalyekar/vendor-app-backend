import Hoek from 'hoek';
import Joi from 'joi';
let internals = {};

internals.register = (server, options, next) => {
    server.route([
        {
            method: 'GET',
            path: '/',
            config: require('./handlers/Index')
        }, {
            method: 'POST',
            path: '/add',
            config: require('./handlers/Create')
        }, {
            method: 'PUT',
            path: '/add/{id}',
            config: require('./handlers/Update')
        }, {
            method: 'DELETE',
            path: '/delete/{id}',
            config: require('./handlers/Delete')
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
    name: 'foodCategory'
};
