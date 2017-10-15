import Joi from 'joi';
import Boom from 'boom';
import async from 'async';
import axios from 'axios';

module.exports = {
    handler: function(request, reply) {
        const { FoodCategory, FoodItem, r } = request.server.plugins.RethinkDb;
        const { id } = request.params;

        async.auto({
            category : async.asyncify(() => {
                return FoodCategory.get(id);
            }),
            deleteItems: ['category', (results, next) => {
                const { category } = results;
                if (category) {
                    FoodItem.filter((item) => {
                        return item("category")("id").eq(id)
                    }).delete().then((items) => {
                        next(null, true);
                    })
                } else {
                    return next(Boom.badRequest('No such category found.'));
                }
            }],
            deleteCategory: ['deleteItems', 'category', (results, next) => {
                const { category, deleteItems } = results;
                if (category && deleteItems) {
                    category.delete().then((results) => {
                        next(null, true);
                    }).error(next);
                } else {
                    return next(Boom.badRequest('No such category found.'));
                }
            }],
            updatedFoodItems: ['deleteItems', 'deleteCategory', (results, next) => {
                FoodItem.run().then((items) => {
                    next(null, items);
                }).error(next);
            }],
            updatedCategories: ['updatedFoodItems', (results, next) => {
                FoodCategory.run().then((categories) => {
                    const data = {
                        foods: results.updatedFoodItems,
                        categories: categories
                    }
                    next(null, data);
                })
            }]
        }, function(err, results){
            if (err) {
                return reply(err.isBoom ? err : Boom.badRequest(err));
            }

            reply({
                success: true,
                data: results.updatedCategories
            });
        });

    }
};