export default {
    schema: ({ type, r }) => ({
        createdAt: type.date().default(r.now()),
        updatedAt: type.date().default(r.now())
    }),
    included: ({ r }, model) => {
        model.pre('save', function (next) {
            if (this.isSaved()) {
                //console.log(r.now());
                this.updatedAt = r.now();
            }
            next();
        });
    },
};
