import Boom from 'boom';

module.exports.schema = function (thinky) {

    const { type, r } = thinky;
    const { Timestamps, Unique } = thinky.behaviours;

    var Bill = thinky.createModel('Bill',{
        id: type.string(),
        number: type.string(),
        date: type.date().default(null),
        customer: {
            id: type.string(),
            name: type.string(),
            phone: type.string(),
            address: type.string(),
        },
        items: [{
            id: type.string(),
            code: type.string(),
            name: type.string(),
            price: type.number(),
            categoryId: type.string(),
            addOn: type.boolean(),
            quantity: type.number(),
        }],
        total: type.number(),
        link: type.string(),
    },[
        Timestamps
    ], {
        enforce_extra: 'remove',
        enforce_type: true
    });

    return Bill;
};

