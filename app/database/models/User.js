import BCrypt from 'bcryptjs';
import Randomstring from 'randomstring';
import _ from 'lodash';
module.exports.schema = function (thinky) {

    const { type, r } = thinky;
    const { Timestamps, Unique } = thinky.behaviours;

    var User = thinky.createModel('User',{
        id: type.string(),
        name: type.string(),
        password: type.string(),
        admin: type.string(),
    },[
        Timestamps,
        Unique('email')
    ], {
        enforce_extra: 'remove',
        enforce_type: true
    });

    User.defineStatic('hashPassword', (password) => {
        return BCrypt.hashSync(password, BCrypt.genSaltSync(10));
    });

    User.define('isValidPassword', function (password) {
        if (_.isUndefined(this.password)) {
            return false;
        }
        return password === this.password;
    });

    User.defineStatic('findOne', (userId) => {
    	let visibilityFilter = r.row('id').eq(userId);
    	return User.filter(visibilityFilter).getJoin({company:true});
    });
    
    User.defineStatic('findByEmailId', (emailId) => {
    	let visibilityFilter = r.row('email').match('(?i)^' + emailId + '$');
    	return User.filter(visibilityFilter);
    });
    
    User.define('sanitizeMe', function (doc) {
        delete doc.password;
        delete doc.emailActivationCode;
        return doc;
    });
    
    User.pre('save', function (next) {
        // FIXME: Add unique email check over here
        if(this.emailActivationCode === undefined) {
            this.emailActivationCode = Randomstring.generate({
                length: 7,
                charset: 'alphanumeric'
            });
        }
        next();
    });
    return User;
};
