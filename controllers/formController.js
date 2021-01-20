const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Form = mongoose.model('Form');

router.get('/', (req, res) => {
    res.render("form/addOrEdit", {
        viewTitle: "Complete this Form"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var form = new Form();
    form.title = req.body.title;
    form.description = req.body.description;
    form.fullName = req.body.fullName;
    form.email = req.body.email;
    form.mobile = req.body.mobile;
    form.city = req.body.city;
    form.save((err, doc) => {
        if (!err)
            res.redirect('form/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("form/addOrEdit", {
                    viewTitle: "Complete this Form",
                    form: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Form.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('form/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("form/addOrEdit", {
                    viewTitle: 'Update ',
                    form: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Form.find((err, docs) => {
        if (!err) {
            res.render("form/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving data :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Form.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("form/addOrEdit", {
                viewTitle: "Update ",
                form: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Form.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/form/list');
        }
        else { console.log('Error in delete :' + err); }
    });
});

module.exports = router;