const bcrypt = require('bcrypt');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../user/userModel');

exports.hashPass = async (req, res, next) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 8)
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
}

exports.tokenCheck = async (request, response, next) => {
    try {
        const token = request.header("Authorization");
        const decodedToken = await jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decodedToken._id);
        console.log(user);
        request.user = user;
        next();
    } catch (error) {
        console.log(error)
        response.status(500).send({error: error.message})
    }
}

exports.comparePass = async (request, response, next) => {
    try {
        request.user = await User.findOne({username: request.body.username});
        if (request.user &&
            await bcrypt.compare(request.body.password, request.user.password)){
                next ()
            } else {
                throw new Error ("Incorrect user id or password")
            }
    } catch (error) {
        console.log(error)
        response.status(500).send({error: error.message})
    }
}