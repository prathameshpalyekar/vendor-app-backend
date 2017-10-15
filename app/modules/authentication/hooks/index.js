var InvitationEmail = require('./InvitationEmail');

module.exports = function (RethinkDb) {
    RethinkDb.User.changes().then((feed) => {
        feed.each((err, doc) => {
            if (err) {
                console.log(err);
                return false;
            }
            if (doc.getOldValue() === null) {
                // New User is created. Need to send Invitation Email
                InvitationEmail(doc, RethinkDb);
            } else {
                console.log("Updating user");
            }
        });
    });
};