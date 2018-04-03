const mongoose = require('mongoose');

const Form = mongoose.model('form');

class FormFactory {
    static async createForm(user, name = 'Testing by Jest') {
        const formDocument = await new Form({
            name: name,
            owner: user.id,
            updated: Date.now()
        }).save();

        const form = new FormFactory(formDocument);

        return new Proxy(form, {
            get: function(target, property) {
                return form[property] || formDocument[property];
            }
        });
    }

    constructor(formDocument) {
        this.form = formDocument;
    }

    getForm() {
        return this.form;
    }

    async removeForm() {
        await Form.remove({ _id: this.form._id });
    }
}

module.exports = FormFactory;

// module.exports = async user => {
//     const form1 = new Form({
//         name: 'Testing 1 by ' + user.name,
//         owner: user.id,
//         updated: Date.now()
//     });

//     const form2 = new Form({
//         name: 'Testing 2 by ' + user.name,
//         owner: user.id,
//         updated: Date.now()
//     });

//     await form1.save();
//     await form2.save();

//     return true;
// };
