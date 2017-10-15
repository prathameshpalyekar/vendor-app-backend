import Boom from 'boom';

module.exports.schema = function (thinky) {

    const { type, r } = thinky;
    const { Timestamps, Unique } = thinky.behaviours;

    var FoodItem = thinky.createModel('FoodItem',{
        id: type.string(),
        code: type.string(),
        name: type.string(),
        price: type.number(),
        categoryId: type.string(),
        addOn: type.boolean(),
    },[
        Timestamps
    ], {
        enforce_extra: 'remove',
        enforce_type: true
    });

    return FoodItem;
};

