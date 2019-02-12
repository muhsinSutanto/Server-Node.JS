const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bycrypt = require('bcryptjs')

const User = require('../../models/User')

//@route Get api/users/test
//@desc Test users route
//@access Public
router.get('/test', (req, res)=> res.json({msg: 'users works'}));


//@route Get api/users/test
//@desc Test users route
//@access Public
router.post('/register',(req, res)=> {
    User.findOne({ email: req.body.email})
        .then(user => {
            if(user) {
                return res.status(400).json({email: 'Email already exist'})
            }else{
                const avatar = gravatar.url(req.body.email, {
                    s:'200', r:'pg', d:'mm'
                })

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                })

                bycrypt.genSalt(10, (err, salt)=> {
                    bycrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    } )
                })
            }
        })
})


module.exports = router;