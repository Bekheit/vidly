const {Rental, validate} = require('../models/rental')
const {Movie} = require('../models/movie')
const {Customer} = require('../models/customer')
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.post('/' , async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer');
    
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie');

    if (movie.numberInStock == 0) return res.status(400).send('Movie not available');

    let rental = new Rental({
        customer: {
            _id: req.body.customerId,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: req.body.movieId,
            title: movie.title,
            dailyRentalDate: movie.dailyRentalDate 
        }
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies' , {_id: movie._id} , {
                $inc: { numberInStock: -1 }
            })
            .run()
    
        res.send(rental);
    } catch(ex) {
        res.send(500).send('Something failed.')
    }


});

router.get('/' , async (req, res) => {
    const rentals = await Rental.find();
    res.send(rentals);
});

router.get('/:id' , async (req, res) => {
    const rental = Rental.findById(req.params.id);
    if (!rental) res.status(404).send('Rental with given ID not Found.');

    res.send(rental);
})
module.exports = router;