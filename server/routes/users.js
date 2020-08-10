const express = require('express');
const router = express.Router();

const { User } = require('../models/User')
const { auth } = require('../middleware/auth')

router.get('/users', (req, res) => {
    dbConn.getUserList()
    .then((rows) => { res.json(rows) }) // 쿼리 결과가 JSON 형태로 출력됨
    .catch((err) => { console.error(err); });
})

router.post('/register', (req, res) => {
    console.log(req.body);
    User.register(req.body, (err, result) => {
        if(err) return res.json({success: false,err});
        return res.status(200).json({
            success: true
        })
    });
})

router.post('/login', (req, res) => {
    User.getUser(req.body.email, (err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        User.comparePassword(req.body.password, user.password, (err, isMatch) => {
            if(!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});

            User.generateToken( user, (err, user) => {
                if(err) return res.status(400).send(err);
                res.cookie("x_auth", user.token).status(200).json({loginSuccess: true, userId: user.id});
            })
            
        })

    })
})

router.get('/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

router.get('/logout', auth, (req, res) => {
    User.findOneAndUpdate({id: req.user.id}, {token: ""}, (err) => {
            if(err) return res.json({success: false, err});
            return res.cookie("x_auth", "").status(200).json({success: true});
            // return res.status(200).send({
            //     success: true
            // })
        })
})

module.exports = router;