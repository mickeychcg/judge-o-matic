const mongoose = require ('mongoose');

const speakerSchema = new mongoose.Schema ( {
    name: {
        type: String
    },

    quotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote'
    }],

    personality: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Personality'
    }],

});

module.exports = mongoose.model('Speaker', speakerSchema);
