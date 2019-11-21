const express = require('express');

const router = express.Router();

const Product = require('./../models/Products');
router.get('/', (req, res, next) => {
     Product.find({'productDescription':'Electronics'})
    .exec()
    .then(docs =>{
                return res.render('electronics', {
                    title: 'E-Commerce Website',
                    css: 'style.css',
                    products:docs
                });    
               
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            Error :err
        })
    })
 })

 module.exports = router;