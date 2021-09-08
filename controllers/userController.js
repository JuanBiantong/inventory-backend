const User = require("./../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");
const jwtSecret = process.env.JWT_SECRET;

exports.login = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    try {
        form.parse(req, async(err, fields, ) => {
            await User.findOne({ username: fields.username }).exec((err, foundUser) => {
                if (err) {
                    res.json(err);
                }
                if (!foundUser) {
                    res.status(400).json({ error: "Invalid username" });
                }
                // compare the encryptic password with the entered password
                else {
                    comparePassword(foundUser);
                }

                // compare the encrypted password with one the user provided
                function comparePassword(user) {
                    bcrypt.compare(fields.password, user.password).then(isMatch => {
                        // if the password doesn't match, return a message
                        if (!isMatch) {
                            return res.status(400).json({
                                error: "Invalid password"
                            });
                            // if it matches generate a new token and send everything is json
                        } else {
                            generateNewToken(user);
                        }
                    });
                }

                // generate new token with the new data
                function generateNewToken(user) {
                    jwt.sign({
                            id: user.id,
                        },
                        jwtSecret, { expiresIn: 3600000 },
                        (err, token) => {
                            if (err) res.json({ err });
                            else {
                                res.json({
                                    token,
                                    message: "Logged in Succefully",
                                    user: {
                                        id: user.id,
                                        username: user.username,
                                    }
                                });
                            }
                        }
                    );
                }
            });
        });
    } catch (error) {
        return res.status(400).json({
            error: Error,
        });
    }
};

exports.createUser = (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
    });
    checkUsernameTaken();

    function checkUsernameTaken() {
        User.findOne({ username: req.body.username }, (err, userWithSameUsername) => {
            if (err) {
                return res.status(400).json({
                    message: "Error getting username"
                });
            } else if (userWithSameUsername) {
                return res.status(400).json({ message: "Username is taken" });
            } else {
                encryptDataAndSave();
            }
        });
    }

    const encryptDataAndSave = function() {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then(user => {
                        generateNewToken(user);
                    })
                    .catch(err => {
                        res.status(400).json({
                            message: "Error registering",
                            err
                        });
                    });
            });
        });
    };

    // generate and json token and send it with the user
    function generateNewToken(user) {
        jwt.sign({
                id: user.id,
            },
            jwtSecret, { expiresIn: 3600000 },
            (err, token) => {
                if (err) throw err;
                else
                    res.json({
                        token,
                        message: "Registered Succefully",
                        user: {
                            id: user.id,
                            username: user.username,
                        }
                    });
            }
        );
    }
};