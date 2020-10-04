const express = require('express');
const router = express.Router();

const Ofertauno = require('../models/ofertauno');


// Models
const Proddos = require('../models/proddos');
const Cart = require('../models/cart');
const Order = require('../models/order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');


////////////////////////////////////////////////////////////////////////


router.post('/proddos/new-proddos',  async (req, res) => {
  const { name, title, image, imagedos, imagetres, description, price } = req.body;
  const errors = [];
  if (!image) {
    errors.push({text: 'Please Write a Title.'});
  }
  if (!title) {
    errors.push({text: 'Please Write a Description'});
  }
  if (!price) {
    errors.push({text: 'Please Write a Description'});
  }
  if (errors.length > 0) {
    res.render('notes/new-note', {
      errors,
      image,
      title,
      price
    });
  } else {
    const newNote = new Proddos({ name, title, image, imagedos, imagetres, description, price });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/proddosback/1');
  }
});


router.get('/proddosredirect/:id', async (req, res) => {
  const { id } = req.params;
  const ofertauno = await Ofertauno.find();
  const proddos = await Proddos.findById(id);
  res.render('proddos/proddosredirect', {proddos, ofertauno });
});


//////////////////////////////////////////////////////////////////////

  router.get('/proddosindex/:page', async (req, res) => {
    let perPage = 8;
    let page = req.params.page || 1;
  
    Proddos
    .find({}) // finding all documents
    .sort({ timestamp: -1 })
    .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
    .limit(perPage) // output just 9 items
    .exec((err, proddos) => {
      Proddos.countDocuments((err, count) => { // count to calculate the number of pages
        if (err) return next(err);
        res.render('proddos/proddos', {
          proddos,
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    });
  });
  
  


  router.get("/search", function(req, res){
    let perPage = 8;
    let page = req.params.page || 1;
  
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escape(req.query.search), 'gi');
        // Get all campgrounds from DB
        console.log(req.query.search)
        Proddos
        // finding all documents
        .find({title: regex}) 
        .sort({ _id: -1 })
        .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
        .limit(perPage) // output just 9 items
        .exec((err, proddos) => {
         Proddos.countDocuments((err, count) => {
          if (err) return next(err);
              res.render("proddos/proddos",{
                proddos, 
                current: page,
                pages: Math.ceil(count / perPage)
              });
            });
          });
    } else {
        // Get all campgrounds from DB
        Proddos.find({}, function(err, proddos){
           if(err){
               console.log(err);
           } else {
              res.render("produno/produno",{
                proddos,
                current: page,
                pages: Math.ceil(count / perPage)
                });
           }
        });
    }
  });
  








//////////////////////////////////////////////////////////////////////

router.get('/proddosback/:page', async (req, res) => {
  let perPage = 12;
  let page = req.params.page || 1;

  Proddos
  .find({}) // finding all documents
  .sort({ timestamp: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, proddos) => {
    Proddos.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('proddos/new-proddos', {
        proddos,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});




router.get("/searchback", function(req, res){
  let perPage = 8;
  let page = req.params.page || 1;

  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escape(req.query.search), 'gi');
      // Get all campgrounds from DB
      console.log(req.query.search)
      Proddos
      .find({title: regex}) 
      .sort({ _id: -1 })
      .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
      .limit(perPage) // output just 9 items
      .exec((err, produno) => {
       Proddos.countDocuments((err, count) => {
        if (err) return next(err);
            res.render("proddos/new-proddos",{
              proddos, 
              current: page,
              pages: Math.ceil(count / perPage)
            });
          });
        });
  } else {
      // Get all campgrounds from DB
      Proddos.find({}, function(err, proddos){
         if(err){
             console.log(err);
         } else {
            res.render("produno/new-produno",{
              proddos,
              current: page,
              pages: Math.ceil(count / perPage)
              });
         }
      });
  }
});


/////////////////////////////////////////////////////////////////////

// talle y color
router.get('/proddos/tallecolor/:id',  async (req, res) => {
  const proddos = await Proddos.findById(req.params.id);
  res.render('proddos/tallecolor-proddos', { proddos });
});

router.post('/proddos/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Proddos.updateOne({_id: id}, req.body);

  res.redirect('/proddosredirect/' + id);
});




//editar


router.get('/proddos/edit/:id',  async (req, res) => {
  const proddos = await Proddos.findById(req.params.id);
  res.render('proddos/edit-proddos', { proddos });
});

router.post('/proddos/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Proddos.updateOne({_id: id}, req.body);
  res.redirect('/proddosback/:1');
});




// Delete 
router.get('/proddos/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Proddos.deleteOne({_id: id});
  res.redirect('/proddosback/:1');
});






router.get('/addtocardproddos/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Proddos.findById(productId, function(err, product){
    if(err){
      return res-redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    req.flash('success', 'Producto agregado al carro exitosamente');
    res.redirect('/proddosredirect/' + productId);

  });
});


module.exports = router;
