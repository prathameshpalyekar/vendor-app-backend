import Joi from 'joi';
import Boom from 'boom';
import async from 'async';
import axios from 'axios';
import { createPDF } from '../../../libs/PDFHelpers.js';
import InvoiceTemplate from '../../../libs/invoiceTemplate/index.js';

module.exports = {
    handler: function(request, reply) {
        const { Bill, FoodItem, r } = request.server.plugins.RethinkDb;
        const { payload } = request;

        async.auto({
            foodItems: async.asyncify(() => {
                return FoodItem.run();
            }),
            total: async.asyncify(() => {
                let totalPrice = 0;
                payload.order.forEach((item) => {
                    totalPrice += item.quantity * item.price;
                })
                return totalPrice;
            }),
            pdf: ['foodItems', 'total', async.asyncify((results) => {
                // console.log(results.total)
                const base =  'file://' + process.env.APP_ROOT_PATH +  '/app/libs/invoiceTemplate/views';
                const newHtml = InvoiceTemplate({
                    ASSETS_PATH: base,
                    billNumber: payload.info.number,
                    billDate: payload.info.date,
                    order: payload.order,
                    total: results.total,
                });
                return createPDF(newHtml);
            })],
            validate: ['pdf', (results, next) => {
                console.log(results.pdf)
                // const { foodItems } = results;
                // const isPresentInList = foodItems.find((item) => item.code === payload.code || item.name === payload.name);

                // if (isPresentInList) {
                //     return next(Boom.badRequest('Food item already present.'));
                // }

                // const base =  'file://' + process.env.APP_ROOT_PATH +  '/app/libs/invoiceTemplate/views';
                // const newHtml = InvoiceTemplate({
                //     ASSETS_PATH: base,
                // });
                // return createPDF(newHtml);

                next(null, results.pdf);
            }],

        }, function(err, results){
            if (err) {
                return reply(err.isBoom ? err : Boom.badRequest(err));
            }

            // console.log(results.validate)

            reply({
                success: true,
                data: results.pdf
            });
        });

    }
};