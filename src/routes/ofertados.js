const express = require('express');
const router = express.Router();

// Stripe
//const stripe = require('stripe')('sk_test_rCp23dn4fDasEqfGiVkhHvii00SyEkd4GS');


// Models
const Ofertados = require('../models/ofertados');
const Cart = require('../models/cart');

// Helpers
const { isAuthenticated } = require('../helpers/auth');




router.post('/ofertados/new-ofertados',  async (req, res) => {
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
    const newNote = new Ofertados({ name, title, image, imagedos, imagetres, description, price });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/ofertados/add');
  }
});






router.get('/ofertadosredirect/:id', async (req, res) => {
  const { id } = req.params;
  const ofertados = await Ofertados.findById(id);
  //console.log(post);
  //res.send('recibido');
   res.render('ofertados/ofertadosredirect', {ofertados});
});











// New producto
router.get('/ofertados/add',  async (req, res) => {
  const ofertados = await Ofertados.find();
  res.render('ofertados/new-ofertados',  { ofertados });
});



router.get('/ofertadosbackend/:id', async (req, res) => {
  const { id } = req.params;
  const ofertados = await Ofertados.findById(id);
   res.render('ofertados/ofertadosbackend', {ofertados});
});






// talle y color
router.get('/ofertados/tallecolor/:id',  async (req, res) => {
  const ofertados = await Ofertados.findById(req.params.id);
  res.render('ofertados/tallecolor-ofertados', { ofertados });
});

router.post('/ofertados/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Ofertados.updateOne({_id: id}, req.body);

  res.redirect('/ofertadosredirect/' + id);
});




//editar


router.get('/ofertados/edit/:id',  async (req, res) => {
  const ofertados = await Ofertados.findById(req.params.id);
  res.render('ofertados/edit-ofertados', { ofertados });
});

router.post('/ofertados/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Ofertados.updateOne({_id: id}, req.body);
  res.redirect('/ofertaunobackend/' + id);
});


// Delete 
router.get('/ofertados/delete/:id', async (req, res) => {
  const { id } = req.params;
  await Ofertados.deleteOne({_id: id});
  res.redirect('/ofertados/add');
});








router.get('/addtocardofertados/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Ofertados.findById(productId, function(err, product){
    if(err){
      return res-redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    req.flash('success', 'Producto agregado al carro exitosamente');
    res.redirect('/ofertadosredirect/' + productId);

  });
});


module.exports = router;
