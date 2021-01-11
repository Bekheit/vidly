const mongoose = require('mongoose');
const {genreSchema} = require('../models/genre');
const Joi = require('joi');


const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 5,
        max: 255
    },
    genre: {
        type: genreSchema,
        ref: 'Genre',
        required: true 
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie' , movieSchema);

function validateMovie(movie){
    const schema = Joi.object({
        title: Joi.string().required().min(5).max(255),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().required().min(0).max(255),
        dailyRentalRate: Joi.number().required().min(0).max(255)
    });
    return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
