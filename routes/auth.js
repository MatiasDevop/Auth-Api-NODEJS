const router = require('express').Router();
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const { registerValidation, loginValidation } = require('../validation');


router.post('/register', async(req, res) => {
    //lets validate the date before we a user
    // const { error } = Joi.validate(req.body, schema);
    //res.send(error.details[0].message);

    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //Checking if the user is already in the database

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exits');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
    //res.send('Register');
});

//Login
router.post('/login', async(req, res) => {
    //LETs validate the data before we a user
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Checkeing if email exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or password is wrong');
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password..');

    //Create and assign token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);


    //res.send('Logged in');

})
module.exports = router;