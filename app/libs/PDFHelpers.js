import pdf from 'html-pdf';
import Promise from 'bluebird';
const base =  process.env.APP_ROOT_PATH +  '/app/libs/invoiceTemplate/views';

const options = {
    height: "120mm",        // allowed units: mm, cm, in, px
    width: "72mm",
    border: {
        top: "0.1in",            // default is 0, units: mm, cm, in, px 
        right: "0.1in",
        bottom: "0.1in",
        left: "0.1in"
    },
    base: 'file://' + base,
};

module.exports = {
    createPDF: (html) => {
        return new Promise((resolve, reject) => {
            pdf.create(html, options).toFile('./bill.pdf', (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    },
}
