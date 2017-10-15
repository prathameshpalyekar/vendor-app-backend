module.exports = function (RethinkDb) {
    RethinkDb.User.changes().then((feed) => {
        feed.each((err, doc) => {
            if (err) {
                console.log(err);
                return false;
            }

            if (doc.getOldValue() === null) {
                // New document was inserted please add welcome email code over here
                // New document value exists in variable doc
                console.log("A new document was inserted:");
            }
        });
    });
};
