const express = require('express');
const router = express.Router();

// Stripe
//const stripe = require('stripe')('sk_test_rCp23dn4fDasEqfGiVkhHvii00SyEkd4GS');


// Models
const Ofertauno = require('../models/ofertauno');
const Cart = require('../models/cart');

// Helpers
const { isAuthenticated } = require('../helpers/auth');





router.post('/ofertauno/new-ofertauno',  async (req, res) => {
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
    const newNote = new Ofertauno({ name, title, image, imagedos, imagetres, description, price });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/ofertauno/add');
  }
});







router.get('/ofertaunoredirect/:id', async (req, res) => {
  const { id } = req.params;
  const ofertauno = await Ofertauno.findById(id);
  res.render('ofertauno/ofertaunoredirect', {ofertauno});
});








// New product
router.get('/ofertauno/add',  async (req, res) => {
  const ofertauno = await Ofertauno.find();
  res.render('ofertauno/new-ofertauno',  { ofertauno });
});


router.get('/ofertaunobackend/:id', async (req, res) => {
  const { id } = req.params;
  const ofertauno = await Ofertauno.findById(id);
   res.render('ofertauno/ofertaunobackredirect', {ofertauno});
});




// talle y color
router.get('/ofertauno/tallecolor/:id',  async (req, res) => {
  const ofertauno = await Ofertauno.findById(req.params.id);
  res.render('ofertauno/tallecolor-ofertauno', { ofertauno });
});

router.post('/ofertauno/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Ofertauno.updateOne({_id: id}, req.body);

  res.redirect('/ofertaunoredirect/' + id);
});




//editar


router.get('/ofertauno/edit/:id',  async (req, res) => {
  const ofertauno = await Ofertauno.findById(req.params.id);
  res.render('ofertauno/edit-ofertauno', { ofertauno });
});

router.post('/ofertauno/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Ofertauno.updateOne({_id: id}, req.body);
  res.redirect('/ofertauno/add');
});




// Delete 
router.get('/ofertauno/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Ofertauno.deleteOne({_id: id});
  res.redirect('/ofertauno/add');
});






router.get('/addtocardofertauno/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Ofertauno.findById(productId, function(err, product){
    if(err){
      return res-redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    req.flash('success', 'Producto agregado al carro exitosamente');
    res.redirect('/ofertaunoredirect/' + productId);

  });
});


module.exports = router;
