var express = require('express');
var router = express.Router();
const monk = require('monk')
const { body, validationResult } = require('express-validator');

const url = 'localhost:27017/shopDB';
const db = monk(url);

/* GET users listing. */
router.get('/', function (req, res, next) {
    const collection = db.get('products');
    collection.find({},{},function(e,docs){
        res.render('product', {
            "data" : docs
        });
    });
});

router.get('/create', function (req, res, next) {
    res.render('create-product');
});

router.post('/create', [
    body('name', 'Plsase input your product name.').not().isEmpty(),
    body('price', 'Plsase input your product price.').not().isEmpty(),
    body('description', 'Plsase input your product description.').not().isEmpty()
], function (req, res, next) {
    const result = validationResult(req);
    var errors = result.errors;
    if (!result.isEmpty()) {
        res.render('create-product', { errors: errors });
        // return res.status(422).json({ errors: errors.array() });
    } else {
        // Insert to db
        const collection = db.get('products');
        collection.insert([{
            name: req.body.name,
            price: req.body.price,
            description: req.body.description
        }])
            .then((docs) => {
                req.flash("success", "บันทึกข้อมูลเรียบร้อย");
                res.render('create-product');
            }).catch((err) => {
                res.send(err);
            }).then(() => db.close());
    }
});

module.exports = router;
