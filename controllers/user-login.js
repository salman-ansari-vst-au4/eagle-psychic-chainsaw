const Controller = {};

var Users = require('./../models/Users-db');
const Product = require('../models/Products');

// SignUp
Controller.user_signup = function (req, res) {
    console.log(req.body)
    const users = new Users.register({
        username: req.body.name,
        email: req.body.email,
        mobile_number: req.body.number,
        password: req.body.password,
        address: req.body.address                   //here you have to give the address id number in string
    })
    users
        .save()
        .then(result => {
            if (result) {
                return res.redirect('/user-login')
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                msg: "Email Already Used!"
            })
        })
}

// SignIn
var flag = null;
Controller.user_signin = function (req, res) {
    var data = req.body;
    console.log(data);
    Users.register.findOne({
        $and: [
            { email: data.email }, { password: data.password }]
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            flag = false;;
        }
        else {
            req.session.user = user;
            flag = true;
        }
        console.log(flag)
        res.json({
            flag: flag
        })
    })
}

// Delete User
Controller.user_delete = function (req, res) {
    var data = req.body;
    console.log(data);
    Users.register.findOneAndRemove({
        $and: [
            { email: data.email }, { password: data.password }]
    }, function (err, user) {
        if (err) {
            return res.status(500).send(err);
        }
        if (!user) {
            return res.status(400).send("No user found");
        }

        return res.status(200).send(user);
    })
}

// Update User
Controller.user_update = function (req, res) {
    var data = req.body;
    console.log(data);
    Users.register.updateOne({ username: data.username }, { $set: data }, { multi: true, new: true }, function (err, user) {
        if (err) {
            return res.status(500).send(err);
        }
        if (!user) {
            console.log(user)
            return res.status(400).send("No user found");
        }

        return res.status(200).send(user);
    })
}

Product.cart = function (req, res) {
    var id = req.body.productid;
    console.log(req.body);
    Product.findOne({ productName: id })
        .exec()
        .then(doc => {
            if (doc) {
                return res.render('cartpage', {
                    title: "product_display",
                    href: '../public/style.css',
                    productId: doc._id,
                    productName: doc.productName,
                    productPrice: doc.productPrice,
                    productImage: doc.productImage,
                    productImage1: doc.productImage1,
                    productImage2: doc.productImage2,
                    productHighlights: doc.productHighlights,
                    productHighlights1: doc.productHighlights1,
                    productHighlights2: doc.productHighlights2,
                    productHighlights3: doc.productHighlights3,
                    userReview: doc.userReview
                });
            } else {
                return res.status(500).json({
                    message: 'No valid entry Found for provided Id'
                })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ Error: err });
        })
}

//logout route
Controller.logout = function (req, res) {

    req.session.destroy();
    res.clearCookie("guest-login");
    return res.send({
        status: true,
        message: "Logged Out"
    })
}

Controller.validate = function (req, res, next) {

    Users.verify(req, function (error, info) {
        if (error) {
            return next();
        }
        return res.redirect('/user-login');
    });
}


module.exports = {
    Controller: Controller,
    Product: Product
}