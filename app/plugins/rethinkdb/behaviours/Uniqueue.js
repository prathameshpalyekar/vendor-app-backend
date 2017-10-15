export default function unique(field, pk = 'id') {
    return {
        included: ({ r }, model) => {
            model.ensureIndex(field);
            model.pre('save', function (next) {
                var query = r.table(this.getModel().getTableName())
                .getAll(this[field], { index: field });

                if (typeof this[pk] !== 'undefined') {
                    query = query.filter(r.row(pk).ne(this[pk]));
                }
                query.count().run().then((count) => {
                    if (count > 0) {
                        const msg = `Field [${field}] with value [${this[field]}] is not unique ` +
                            `for [${this.getModel().getTableName()}::${field}]`;

                            next(new Error(msg));
                    } else {
                        next();
                    }
                }).catch(function(){
                    next();
                });


            });
        },
    };
}
