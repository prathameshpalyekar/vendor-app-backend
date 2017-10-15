const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var EmailHelpers = {

    validateEmail(email) {
        if (email === "") {
            return true;
        } else {
            return EMAIL_REGEX.test(email);
        }
    },

    getEmailDomain(email) {
        const index = email.indexOf('@');
        return index !== -1 ? email.slice((index + 1), email.length) : false;
    },

    matchDomain(emailFirst, emailSecond) {
        return this.getEmailDomain(emailFirst) === this.getEmailDomain(emailSecond);
    },

}

export default EmailHelpers;
