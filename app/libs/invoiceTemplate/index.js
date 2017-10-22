import Handlebars from 'handlebars';
import moment from 'moment';
import fs from 'fs';
import _ from 'lodash';

const base =  process.env.APP_ROOT_PATH +  '/app/libs/invoiceTemplate/views/';
const INVOICE_TEMPLATE = base + 'invoiceTemplate.html';
const templateFile = fs.readFileSync(INVOICE_TEMPLATE, 'utf8');
const template = Handlebars.compile(templateFile);

// Quick Helpers function
Handlebars.registerHelper('moment', function(date, format) {
    if (_.isUndefined(date)) {
        return '';
    }
    return new Handlebars.SafeString(moment(date).format(format || 'YYYY/MM/DD'));
});

Handlebars.registerHelper('momentIsPast', function(date, format) {
    return new Handlebars.SafeString(moment(date).isBefore(moment()));
});

Handlebars.registerHelper('multiplyNumbers', function(mult1, mult2) {
	console.log(mult2, mult1)
    return new Handlebars.SafeString(mult1 * mult2);
});

export default function(data) {
	return template(data);
};
