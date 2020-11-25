const {Router} = require("express");
const { check, validationResult } = require('express-validator') ;
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const normalize = require('normalize-url');

const User = require('../../models/User');

const router = Router();

router.post('/', [
    check('name', "Name is required").not().isEmpty(),
    check('email', "Please include a valid email").isEmail(),
    check('password', "Password must be 6 or more characters").isLength({min: 6})
], async (req, res) => 
{
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});

    const {name, email, password} = req.body;
    
    try 
    {
        let user = await User.findOne({email});
        if (user) return res.status(400).json({ errors: [{ msg: "User already exists" }] });

        const avatar = normalize(
            gravatar.url(email, {
              s: '200',
              r: 'pg',
              d: 'mm'
            }),
            { forceHttps: true }
          );

        user = new User(
            {
                name,
                email,
                avatar,
                password
            });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user:
            {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get("jwtSecret"),
            {expiresIn: 360000},
            (error, token) =>
            {
                if (error) throw error;
                console.log("User registered");
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