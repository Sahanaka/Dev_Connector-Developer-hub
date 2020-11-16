const {Router} = require("express");
const {check, validationResult} =  require("express-validator");
const normalize = require('normalize-url');
const config = require('config');
const axios = require("axios");

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

const router = Router();

router.get('/me', auth, async (req, res) => 
{
    try 
    {
        const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"]);

        if (!profile)
            return res.status(400).json({ msg: "There is no profile for this user"});

        res.json(profile);
    } 
    catch (error) 
    {
        console.log(error.message);
        res.status(500).json("Server Error!");
    }
});

router.post('/', [
    auth,
    [check("status", "Status is required").not().isEmpty(),
    check("skills", "Skills is required").not().isEmpty()]
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
    } = req.body;

    const profileFields = {
        user: req.user.id,
        company,
        location,
        website: website && website !== '' ? normalize(website, { forceHttps: true }) : '',
        bio,
        skills: Array.isArray(skills)
          ? skills
          : skills.split(',').map((skill) => ' ' + skill.trim()),
        status,
        githubusername
      };

    const socialFields = {youtube, twitter, linkedin, facebook};

    // Normalize
    for (const [key, value] of Object.entries(socialFields))
    {
        if (value && value.length > 0)
            socialFields[key] = normalize(value, {forceHttps: true});
    }
    profileFields.social = socialFields;

    try 
    {
        let profile = await Profile.findOne({user: req.user.id});

        if (profile)
        {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }
            
        profile = new Profile(profileFields);
        await profile.save();

        res.json(profile);
    } 
    catch (error) 
    {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.get('/', async (req, res) => 
{
    try
    {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    }
    catch (error)
    {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.get('/user/:user_id', async (req, res) => 
{
    try
    {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);

        if (!profile)
            return res.status(400).json({msg: "Profile not found"});
        
            res.json(profile);
    }
    catch (error)
    {
        console.error(error.message);

        if (error.kind == 'ObjectId')
            return res.status(400).json({msg: "Profile not found"});

        res.status(500).send("Server Error");
    }
});

router.delete('/', auth, async (req, res) => 
{
    try
    {
        await Profile.findOneAndRemove({user: req.user.id});
        await User.findOneAndRemove({_id: req.user.id}); 
       
        res.json({msg: "User deleted"}); 
    }
    catch (error)
    {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.put(
    '/experience',
    [
      auth,
      [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From date is required and needs to be from the past')
          .not()
          .isEmpty()
          .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
      ]
    ],
    async (req, res) => 
    {
      const errors = validationResult(req);
      if (!errors.isEmpty()) 
      {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;
  
      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      };
  
      try 
      {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.experience.unshift(newExp);
  
        await profile.save();
  
        res.json(profile);
      } 
      catch (err) 
      {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

router.delete('/experience/:exp_id', auth, async (req, res) => 
{
     try 
     {
        const profile = await Profile.findOne({ user: req.user.id });

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
     } 
     catch (error) 
     {
         console.error(error.message);
         res.status(500).send('Server Error');
     }
});

router.put(
    '/education',
    [
      auth,
      [
        check('school', 'School is required').not().isEmpty(),
        check('degree', 'Degree is required').not().isEmpty(),
        check('fieldofstudy', 'Field of study is required').not().isEmpty(),
        check('from', 'From date is required and needs to be from the past')
          .not()
          .isEmpty()
          .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
      ]
    ],
    async (req, res) => 
    {
      const errors = validationResult(req);
      if (!errors.isEmpty()) 
      {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;
  
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };
  
      try 
      {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.education.unshift(newEdu);
  
        await profile.save();
  
        res.json(profile);
      } 
      catch (err) 
      {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

router.delete('/education/:edu_id', auth, async (req, res) => 
{
     try 
     {
        // Remove user posts
        await Post.deleteMany({user: req.user.id });

        const profile = await Profile.findOne({ user: req.user.id });

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
     } 
     catch (error) 
     {
         console.error(error.message);
         res.status(500).send('Server Error');
     }
});

// Get the github profile
router.get('/github/:username', async (req, res) => 
{
  try
  {
    const URI = encodeURI(`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`);
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`
    };

    const githubResponse = await axios.get(URI, {headers});
    res.json(githubResponse.data);
  }
  catch (error)
  {
    console.error(error.message);
    res.status(404).json({ msg: 'No Github profile found' });
  }
});

module.exports = router;