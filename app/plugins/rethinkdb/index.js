import path from 'path';
import glob from 'glob';

import Hoek from 'hoek';
import Thinky from 'thinky';

import _ from 'lodash';

import Restful from './restful';
import Timestamps from './behaviours/Timestamps';
import Unique from './behaviours/Uniqueue';

exports.register = function(server, options, next) {
    var rethinkModels = {};
    var rethinkModules = {};
    options = Hoek.applyToDefaults({
        host: 'localhost',
        port: 28015,
        db: 'test',
    }, options);

    var thinky = Thinky(options);
    const createModel = thinky.createModel.bind(thinky);

    thinky.createModel = function (table, schema, behaviours, options) {
        if (!_.isArray(behaviours) && _.isUndefined(options)) {
            options = behaviours;
            behaviours = undefined;
        }

        behaviours && _.defaults(schema, ..._.invokeMap(behaviours, 'schema', this));
        const model = createModel(table, schema, options);
        behaviours && _.invokeMap(behaviours, 'included', this, model);

        return model;
    };

    thinky.behaviours = {
        Timestamps,
        Unique
    };

    // Expose thinky for models to use
    server.expose('thinky', thinky);

    // Expose rethinkdbdash instance for raw queries
    server.expose('r', thinky.r);

    // Expose thinky for models to use
    server.expose('Restful', Restful(server));

    if (options.modelsDir) {
        var ref = glob.sync(process.cwd() + options.modelsDir + "/*");
        ref.forEach(function (file) {
            var modelName = path.basename(file, path.extname(file));
            if (['thinky', 'r'].indexOf() !== -1) {
                server.log(['RethinkDb', 'error'], 'Can\'t load the model with restricted names (' + modelName + ').');
                return;
            }
            let model = require(file);
            let thinkyModel = model.schema(thinky, thinky.r, thinky.type);
            server.expose(modelName, thinkyModel);
            rethinkModels[modelName] = thinkyModel;
            rethinkModules[modelName] = model;
        });
        _.each(rethinkModules, (module, modelName) => {
            if (_.isFunction(module.postInit)) {
                module.postInit(rethinkModels[modelName], rethinkModels, thinky.r);
            }
        });
    }

    server.log(['RethinkDb', 'info'], 'Rethinkdb connection created');

    return next();
};

exports.register.attributes = {
    name: 'RethinkDb',
    version: '1.0.0'
};
