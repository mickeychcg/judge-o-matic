const PersonalityInsightsV3 = require('ibm-watson/personality-insights/v3');
const express = require('express');
const router = express.Router();
const Speaker = require('../models/speaker');
const Personality = require('../models/personality');
const Quote = require('../models/quote');
const User = require('../models/user');
require ('dotenv').config();

const personalityRouter = require('./personality');

router.use('/user/:id', personalityRouter);

const personalityInsights = new PersonalityInsightsV3({
  version: '2016-10-19',
  iam_apikey:process.env.IAM_APIKEY,
  url: process.env.URL
})

// GET /user/ - get logged in user 
// ROUTE IS TESTED AND WORKING!
router.get('/user', (req, res) => {
  User.find(req.params.id). populate ('user').exec( (err, user) => {
    if (err) res.status(500).json({err})
    else res.status(200).json(user)
  })
})

// GET ALL speakers - /user/:id/speakers
// ROUTE IS TESTED AND WORKING!
router.get('/user/:id/speakers', async (req, res) => {
  User.findById(req.params.id).populate('speakers').exec( (err, user) => {
    if (err) res.status(500).json({err})
    else res.status(200).json(user.speakers)
  })
})

// GET ONE speaker - /user/:id/speakers/:sid
// ROUTE IS TESTED AND WORKING!
router.get('/user/:id/speakers/:sid', (req, res) => {
  Speaker.findById(req.params.sid).populate('speakers/:sid').exec( (err, speaker) => {
    // let speaker = user.speakers.find((speaker) => {
    //   return speaker._id.toString() === req.params.sid
    // })
    // console.log('did we make it here?')
    if (!err) {
      // console.log(speaker)
      res.status(200).json({ type: 'success', message: 'we found them', data: speaker} ) 
    } else {
      res.status(500).json( {type: 'error', message: 'error getting speaker'} )
    } 
      // res.json(speaker)
  })
})

// POST /speakers - create one speaker assoicated with the loggerd in user
// ROUTE IS TESTED AND WORKING! 
router.post('/user/:id/speakers', (req, res) => {
  let speaker = new Speaker({
    name: req.body.name
  })
  speaker.save((err, speaker) => {
    User.findById(req.params.id, (err, user) => {
      user.speakers.push(speaker)
      user.save( (err, user) => {
        err ? res.status(500).json({err}): res.status(201).json(user)   
      })
    })
  })
})

//POST /speakers/:sid/quotes/:qid - add a quote to a speaker
// ROUTE IS TESTED AND WORKING!
router.post('/user/:id/speakers/:sid/quotes', (req, res) => {
  console.log('This is the POST addQuote route', req.body)

  Speaker.findById(req.params.sid, (err, speaker) => {
    console.log(speaker.quotes);
      let newQuote = new Quote({
        quote: req.body.quote
      })
      console.log('this is a new quote', newQuote)
        newQuote.save((err, quote) => {
          speaker.quotes.push(quote)
          speaker.save((err, speaker) =>
          err ? res.status(500).json({err}): res.status(201).json(speaker))
      })
    })
  })

// // PUT /speakers/:sid/quotes/:qid - add a quote to a speaker
// router.put('/user/:id/speakers/:sid/quotes', (req, res) => {
//   console.log('This is the PUT addQuote route', req.body)

//   Speaker.findOneAndUpdate(req.params.id, { $set:{
//     speaker: req.body.quotes,
//     speakers: req.body.quotes
//   }
//   //   speaker: req.body.quote 
//   // }, {
//   }, {
//     new: true,
//     useFindAndModify: false
//   })
//   .then(Speaker => {
//     console.log('Speaker', Speaker)
//     res.send ({Speaker})
//   })
//   .catch((error) => {
//     console.log('Erroring on Speaker', error)
//     res.status(500).send( {message: 'Error adding speaker quote'})
//   })
// })

// GET /speakers/:pid/quotes/:qid - Get one quote associated wtih one speaker
// ROUTE IS TESTED AND WORKING!
router.get('/user/:id/speakers/:sid/quotes/:qid', (req, res) => {
  Quote.findById(req.params.qid).populate('quote').exec((err, quote) => {
    if (err) {
      console.log("we got an error")
      res.json(err);
    } else {
      console.log("we didn't get an error")
      res.json(quote);
    }
  })
})

// GET /speakers/:sid/quotes/ - Get all quotes associated wtih one speaker
// ROUTE IS TESTED AND WORKING!
router.get('/user/:id/speakers/:sid/quotes', (req, res) => {
  Speaker.findById(req.params.sid).populate('quotes').exec((err, quotes) => {
    if (err) {
      console.log("we got an error")
      res.json(err);
    } else {
      console.log("we didn't get an error");
      res.json(quotes.quotes.map(q => ({content: q.quote, id: q._id})));
    }
  })
})

// DEL /speakers/:id - deletes a speaker
// ROUTE IS TESTED AND WORKING!
router.delete('/user/:id/speakers/:sid', (req, res) => {
  Speaker.findOneAndDelete({_id: req.params.sid}, (err, speaker) => {
    if(!err) {
      res.status(200).json(speaker);
    } else {
      res.status(500).json(speaker);
    }
  })
})

// DEL /speakers/:id/quotes/:id - a quote from a speaker
// ROUTE IS TESTED AND WORKING!
router.delete('/user/:id/speakers/:sid/quotes/:qid', (req, res) => {
  Quote.findOneAndDelete({_id: req.params.qid}, (err, quote) => {
    Speaker.findById(req.params.sid, (err, speaker) => {
      if (err) res.json({err})
      speaker.quotes.pull(req.params.qid)
      speaker.save( (err, doc) => {
        res.json(speaker)
      })
    })
  })
})

// POST /speakers/:id/quotes - post quotes to Personality Insights for analysis
router.post('/user/:id/speakers/:sid/quotes', (req, res) => {
  Speaker.findById(req.params.pid, (err, speaker) => {
    console.log("this is the err:", err)
    console.log("this is the speaker:", speaker)
    // console.log("This should be req.body.quote", req.body.quote)
    let quote = new Quote( {
      quote: req.body.quote
    })
    quote.save((err, doc) => {
      speaker.quotes.push(doc)
      speaker.save((err,doc) => {
        let catQuote = ''
        if (speaker.quotes === quote.quote._id) {
        }
        // let catQuote = quote.quote
        console.log(speaker.quotes)
        //watson logic
        if(speaker.quotes.length > 0 ) {
          let profileParams = {
            content: catQuote,
            content_type:  'plain/text',
            raw_scores: true
          }
          personalityInsights.profile(profileParams, (err, profile)=>{
            // console.log(profile)
          })
        };
        res.status(201).json({quotes:speaker.quotes}); 
      })
      Quote.find({}, (err, quotes) => {
        let personalityInsights = new PersonalityInsightsV3 ({
          version: '2017-10-13',
          iam_apikey: process.env.IAM_APIKEY,
          url: "https://gateway.watsonplatform.net/personality-insights/api"
        })
      })
    })
  })
})

module.exports = router;