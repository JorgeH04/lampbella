const express = require('express');
const router = express.Router();


// Models
const Ofertacuatro = require('../models/ofertacuatro');
const Cart = require('../models/cart');

// Helpers
const { isAuthenticated } = require('../helpers/auth');





router.post('/ofertacuatro/new-ofertacuatro',  async (req, res) => {
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
    const newNote = new Ofertacuatro({ name, title, image, imagedos, imagetres, description, price });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/ofertacuatro/add');
  }
});







router.get('/ofertacuatroredirect/:id', async (req, res) => {
  const { id } = req.params;
  const ofertacuatro = await Ofertacuatro.findById(id);
  res.render('ofertacuatro/ofertacuatroredirect', {ofertacuatro});
});








// New product
router.get('/ofertacuatro/add',  async (req, res) => {
  const ofertacuatro = await Ofertacuatro.find();
  res.render('ofertacuatro/new-ofertacuatro',  { ofertacuatro });
});


router.get('/ofertacuatrobackend/:id', async (req, res) => {
  const { id } = req.params;
  const ofertacuatro = await Ofertacuatro.findById(id);
   res.render('ofertacuatro/ofertacuatrobackredirect', {ofertacuatro});
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


router.get('/ofertacuatro/edit/:id',  async (req, res) => {
  const ofertacuatro = await Ofertacuatro.findById(req.params.id);
  res.render('ofertacuatro/edit-ofertacuatro', { ofertacuatro });
});

router.post('/ofertacuatro/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Ofertacuatro.updateOne({_id: id}, req.body);
  res.redirect('/ofertacuatro/add');
});




// Delete 
router.get('/ofertacuatro/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Ofertacuatro.deleteOne({_id: id});
  res.redirect('/ofertacuatro/add');
});






router.get('/addtocardofertacuatro/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Ofertacuatro.findById(productId, function(err, product){
    if(err){
      return res-redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shopcart');

  });
});


module.exports = router;
