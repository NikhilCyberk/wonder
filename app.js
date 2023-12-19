const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');




let MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log('database connection established');
}).catch(err => {
    console.log('error connecting to database', err);
})


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.send("working");
})

//index routes

app.get('/listings', async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
});

//new route
app.get('/listings/new', (req, res) => {
    res.render('./listings/new.ejs');
});


//show route
app.get('/listings/:id', async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/show.ejs', { listing });
});


//create a new listing
app.post('/listings/', async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');

});

//edit routes
app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
});



// Update 

app.put('/listings/:id', async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });//delistings
    res.redirect(`/listings/${id}`);

});

app.delete('/listings/:id', async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect('/listings');
});



// app.get('/testlisting', async (req, res) => {
//     let sampleListing = new Listing({
//         title: 'My New Villa',
//         description: 'By the Beach',
//         price: 1200,
//         location: 'calangute, Goa',
//         country: 'India',
//     });

//     await sampleListing.save();
//     console.log("Updated");
//     res.send("succesfully updated");
// });




app.listen(8080, () => {
    console.log('listening on port 8080');
})

