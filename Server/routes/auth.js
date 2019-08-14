const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Route for signup
router.post('/signup', (req, res) => {
  // See if the email is already in the database
  User.findOne({email: req.body.email}, (err, user) => {
  // If yes, return an error
    if (user) {
      res.json({type: 'error', message: 'Email already exists'})
    } else {
  // If no, create the user in the database
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      user.save({
      }, (err, user) => {
        if(err) {
          res.json({type: 'error', message: 'Database error creating user'})
        } else {
          // Sign a token (this is the login step)
          var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
            expiresIn: '1d'
          }); 
          // Return the token
          res.status(200).json({type: 'success', user: user.toObject(), token})
        }
      })
    }
  })
});

// Route for login
router.post('/login', (req, res) => {
  // Find user in database
  User.findOne({email: req.body.email}, (err, user) => {
    if (!user) {
      // If no user, return error
      res.json({type: 'error', message: 'Account not found'})
    } else {
      // If user, check authentication
      if ( user.authenticated(req.body.password) ) {
      // If authenticated, sign a token (login)
        var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
          expiresIn: '1d'
        });
        // Return the token
        res.json({type: 'success', message: 'Login successful', user: user.toObject(), token})
      } else {
        res.json({type: 'error', message: 'Authentication failure'})
      }
    }
  })
})


// Route for token validation
router.post('/me/from/token', (req, res) => {
  // Make sure they send us a token to check
  console.log(req.body)
  let token = req.body.token;
  if (!token) {
  // If no token, return error
    res.json({type: 'error', message: 'You must pass a valid token!'});
  } else {
     // If token, verify it
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        // If invalid, return an error
        res.json({type: 'error', message: 'Invalid token. Please log in again.'});
      } else {
          // If token is valid...
          // Lookup the user in the database
        User.findById(user._id, (err, user) => {
              if (err) {
        // If user doesn't exist, return error
            res.json({type: 'error', message: 'Database error during validation.'});
        } else {
        // If user exists, send user and token back to React
          res.json({type: 'success', user: user.toObject(), token});
        }
      })
      }
    })
  }
});

module.exports = router;