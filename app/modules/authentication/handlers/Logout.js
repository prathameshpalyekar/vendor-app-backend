module.exports = {
    handler: function (request, reply) {
        if (request.auth && request.auth.credentials) {
            const { id } = request.auth.credentials;
            request.server.app.cache.drop(id, (err) => {
                console.log(err);
            });
        }
        request.cookieAuth.clear();
        return reply({success: true});
    }
};

