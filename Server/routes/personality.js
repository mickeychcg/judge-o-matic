const PersonalityInsightsV3 = require('ibm-watson/personality-insights/v3');
const express = require('express');
const Personality = require('../models/personality');
const Speaker = require('../models/speaker');
const Quote = require('../models/quote');

require ('dotenv').config();

const personalityInsights = new PersonalityInsightsV3({
  version: '2017-10-13',
  iam_apikey: process.env.IAM_APIKEY,
  url: process.env.URL
});

const router = express.Router();

router.post('/speakers/:speakerId/personality', async (request, response) => {
  const speaker = await Speaker.findById(request.params.speakerId).exec();
  const content = [];
  for (let quoteId of speaker.quotes) {
    const quote = await Quote.findById(quoteId).exec();
    content.push(quote.quote);
  }
  const result = await personalityInsights.profile({
    content: content.join('\n'),
    content_type: 'text/plain'
  });
  
  // Map API data to local Model.
  const personality = new Personality({
    traits: result.personality.map(raw => ({
      traitId: raw.trait_id,
      name: raw.name,
      percentile: raw.percentile,
      children: raw.children.map(child => ({
        facetTraitId: child.trait_id,
        factName: child.name,
        facetPercentile: child.percentile
      }))
    })),
    needs: result.needs.map(raw => ({
      traitId: raw.trait_id,
        name: raw.name,
        percentile: raw.percentile
    })),
    values: result.values.map(raw => ({
      traitId: raw.trait_id,
        name: raw.name,
        percentile: raw.percentile
    })),
    createdAt: new Date()
  });
  await personality.save();
  speaker.personality.push(personality);
  await speaker.save();

  response.json(personality);
});

router.get('/speakers/:speakerId/personality', async (request, response) => {
  const speaker = await Speaker.findById(request.params.speakerId).exec();
  const personalities = [];
  let latest = null;
  for (let personalityId of speaker.personality) {
    const personality = await Personality.findById(personalityId).exec();
    if (!latest || personality && personality.createdAt > latest.createdAt) {
      latest = personality;
    }
  }

  response.json(latest);
});

module.exports = router;