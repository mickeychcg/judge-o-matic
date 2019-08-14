const mongoose = require ('mongoose');

const childSchema = new mongoose.Schema({
    name: String,
    percentile: Number
})

const personalitySchema = new mongoose.Schema({
    name: String,
    percentile: Number,
    traits:[childSchema],
    needs:[childSchema]
})

const Facet = new mongoose.Schema({
    traitId: String,
    name: String,
    percentile: Number,
});
const Trait = new mongoose.Schema({
    traitId: String,
    name: String,
    percentile: Number,
    children: [Facet]
});

const Needs = new mongoose.Schema({
    traitId: String,
    name: String,
    percentile: Number,
});
const Values = new mongoose.Schema({
    traitId: String,
    name: String,
    percentile: Number,
});

const Personality = new mongoose.Schema({
    traits: [Trait],
    needs: [Needs],
    values: [Values],
    createdAt: Date
});


module.exports = mongoose.model('Personality', Personality);