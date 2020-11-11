const {Router} = require("express");
const { check, validationResult } = require('express-validator');
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const auth = require('../../middleware/auth');
const User = require("../../models/User");
const router = Router();

router.get('/', auth, async (req, res) => 
{
    try
    {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.post('/', [
    check('email', "Please include a valid email").isEmail(),
    check('password', "Password is required").exists()
], async (req, res) => 
{
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});

    const {email, password} = req.body;
    
    try 
    {
        let user = await User.findOne({email});
        if (!user) return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }]});

        const payload = {
            user: { id: user.id }
        };

        jwt.sign(
            payload, 
            config.get("jwtSecret"),
            {expiresIn: 360000},
            (error, token) =>
            {
                if (error) throw error;
                console.log("Login successful");
                res.json({ token });
            });

    } 
    catch (error) 
    {
        console.error(error.message);
        res.status(500).json("Server Error!");
    }
});

module.exports = router;