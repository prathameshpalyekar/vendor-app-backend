import Boom from 'boom';

module.exports.schema = function (thinky) {

    const { type, r } = thinky;
    const { Timestamps, Unique } = thinky.behaviours;

    var FoodCategory = thinky.createModel('FoodCategory',{
        id: type.string(),
        type: type.string(),
    },[
        Timestamps
    ], {
        enforce_extra: 'remove',
        enforce_type: true
    });

    return FoodCategory;
};

