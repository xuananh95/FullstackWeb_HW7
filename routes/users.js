var express = require("express");
var router = express.Router();
const UserModel = require("../model/user.model");
const Joi = require("joi");

/* GET users listing. */
router.get("/", function (req, res, next) {
    UserModel.find({}, (err, users) => {
        if (err) {
            console.log(err);
            res.send("Error");
        } else {
            res.send(users);
        }
    });
});

// validate user data with joi
const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().min(0).required(),
        address: Joi.string().required(),
        gender: Joi.string().valid("male", "female", "undefined"),
        phone: Joi.string()
            .pattern(/^[0-9]+$/, "numbers-only")
            .min(10)
            .max(12),
        email: Joi.string().email(),
    });
    return schema.validate(user, { abortEarly: false });
};

// create new user
router.post("/", (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const newUser = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
        gender: req.body.gender,
        phone: req.body.phone,
        email: req.body.email,
    };
    UserModel.create(newUser);
    res.send(newUser);
});

// update user base on ID
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const query = req.body.query;
    UserModel.findOneAndUpdate(
        { _id: id },
        query,
        { new: true },
        (error, user) => {
            if (error) {
                console.log(error);
                res.send("Error occured");
            } else {
                res.send(user);
            }
        }
    );
});

// update user base on phone number
router.put("/", (req, res) => {
    const phone = req.query.phone;
    const query = req.body.query;
    UserModel.findOneAndUpdate(
        { phone: phone },
        query,
        { new: true },
        (error, user) => {
            if (error) {
                console.log(error);
                res.send("Error occured");
            } else {
                res.send(user);
            }
        }
    );
});

// delete user by id
router.delete("/", (req, res) => {
    const id = req.query.id;
    UserModel.findOneAndDelete({ _id: id }, (err, docs) => {
        if (err) {
            console.log(err);
            res.send("Error occured");
        } else {
            res.status(200).send(docs);
        }
    });
});

module.exports = router;
