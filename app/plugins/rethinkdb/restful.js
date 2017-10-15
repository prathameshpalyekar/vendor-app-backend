// TODO: Route Error handling

import Hoek from 'hoek';
import Boom from 'boom';

// Work in progress...
module.exports = function (server) {

    const RethinkDb = server.plugins.RethinkDb;

    var defaultOptions = {
        resourceName: '',
        primaryKey: 'id',
        setupRoutes: true,
        relations: false
    };

    return class Restful {
        constructor(modelName, options, scopedServer = server) {
            this.modelName = modelName;
            this.options = Hoek.applyToDefaults(defaultOptions, options);

            this.server = scopedServer;
            this.Model = this.getModel();

            if (!this.options.resourceName) {
                this.options.resourceName = this.modelName.toLowerCase();
            }

            if (this.options.setupRoutes) {
                this.setupRoutes();
            }
        }

        getModel() {
            if (!this.modelName) {
                throw Error('Model name not specified');
            }

            if (!RethinkDb[this.modelName]) {
                throw Error('Model does not exists', this.modelName);
            }

            return RethinkDb[this.modelName];
        }

        canRouteTo(routeName) {
            var setupRoutes = this.options.setupRoutes;

            return setupRoutes === true || (setupRoutes.only && setupRoutes.only.indexOf(routeName) !== -1) || (setupRoutes.except && setupRoutes.except.indexOf(routeName) === -1);
        }

        setupRoutes() {
            const resourcePath = '/' + this.options.resourceName;

            if (this.canRouteTo('index')) {
                this.server.route({
                    method: 'GET',
                    path: resourcePath,
                    config: {
                        handler: this.index.bind(this)
                    }
                });
            }

            if (this.canRouteTo('show')) {
                this.server.route({
                    method: 'GET',
                    path: resourcePath + '/{' + this.options.primaryKey + '}',
                    config: {
                        handler: this.show.bind(this)
                    }
                });
            }

            if (this.canRouteTo('create')) {
            	
                this.server.route({
                    method: 'POST',
                    path: resourcePath,
                    config: {
                        handler: this.create.bind(this)
                        //validate: this.options.validations
                    }
                });
            }

            if (this.canRouteTo('update')) {
                this.server.route({
                    method: 'PUT',
                    path: resourcePath + '/{' + this.options.primaryKey + '}',
                    config: {
                        handler: this.update.bind(this)
                    }
                });
            }

            if (this.canRouteTo('destroy')) {
                this.server.route({
                    method: 'DELETE',
                    path: resourcePath + '/{' + this.options.primaryKey + '}',
                    config: {
                        handler: this.destroy.bind(this)
                    }
                });
            }


            if (this.options.relations) {
                this.server.route([{
                    method: 'GET',
                    path: resourcePath + '/{' + this.options.primaryKey + '}/{relation}',
                    config: {
                        handler: this.relations.bind(this)
                    }
                }]);
            }
        }

        index(request, reply) {
            this.Model.run().then((docs) => {
                reply({
                    success: true,
                    data: docs
                });
            });
        }

        show(request, reply) {
            this.Model.get(request.params[this.options.primaryKey]).then((doc) => {
                reply({
                    success: true,
                    data: doc
                });
            });
        }

        create(request, reply) {
            this.Model.save(request.payload).then((result) => {
                reply({
                    success: true,
                    data: result
                });
            }).error(function (error) {
                reply(Boom.wrap(error));
            });
        }

        update(request, reply) {
            this.Model.get(request.params[this.options.primaryKey]).then((doc) => {
                doc.merge(request.payload).save().then((updatedDoc) => {
                    reply({
                        success: true,
                        data: updatedDoc
                    });
                });
            });
        }

        destroy(request, reply) {
            this.Model.get(request.params[this.options.primaryKey]).then((doc) => {
                doc.delete().then(() => {
                    reply({
                        success: true
                    });
                });
            });
        }

        // If item has parts, with each part having an itemId column, 
        // a url can be constructed to join parts with item object, 
        // like /items/<itemId>/parts/
        relations(request, reply) {
            if (!this.options.relations || !this.options.relations[request.params.relation]) {
                return reply(Boom.notFound());
            }

            const join = {};
            join[request.params.relation] = true;

            this.Model.get(request.params[this.options.primaryKey]).getJoin(join).run().then((doc) => {
                reply(doc);
            });
        }
    };
};
