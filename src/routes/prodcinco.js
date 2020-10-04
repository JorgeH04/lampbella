const express = require('express');
const router = express.Router();



// Models
const Prodcuatro = require('../models/prodcuatro');
const Cart = require('../models/cart');
const Order = require('../models/order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');


////////////////////////////////////////////////////////////////////////


router.post('/prodcuatro/new-prodcuatro',  async (req, res) => {
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
    const newNote = new Prodcuatro({ name, title, image, imagedos, imagetres, description, price });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/prodcuatroback/1');
  }
});


router.get('/prodcuatroredirect/:id', async (req, res) => {
  const { id } = req.params;
  const prodcuatro = await Prodcuatro.findById(id);
  res.render('prodcuatro/prodcuatroredirect', {prodcuatro});
});


//////////////////////////////////////////////////////////////////////

  router.get('/prodcuatroindex/:page', async (req, res) => {
    let perPage = 8;
    let page = req.params.page || 1;
  
    Prodcuatro
    .find({}) // finding all documents
    .sort({ timestamp: -1 })
    .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
    .limit(perPage) // output just 9 items
    .exec((err, prodcuatro) => {
      Prodcuatro.countDocuments((err, count) => { // count to calculate the number of pages
        if (err) return next(err);
        res.render('prodcuatro/prodcuatro', {
          prodcuatro,
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
        Prodcuatro
        // finding all documents
        .find({title: regex}) 
        .sort({ _id: -1 })
        .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
        .limit(perPage) // output just 9 items
        .exec((err, prodcuatro) => {
         Prodcuatro.countDocuments((err, count) => {
          if (err) return next(err);
              res.render("prodcuatro/prodcuatro",{
                prodcuatro, 
                current: page,
                pages: Math.ceil(count / perPage)
              });
            });
          });
    } else {
        // Get all campgrounds from DB
        Prodcuatro.find({}, function(err, prodcuatro){
           if(err){
               console.log(err);
           } else {
              res.render("prodcuatro/prodcuatro",{
                prodcuatro,
                current: page,
                pages: Math.ceil(count / perPage)
                });
           }
        });
    }
  });
  








//////////////////////////////////////////////////////////////////////

router.get('/prodcuatroback/:page', async (req, res) => {
  let perPage = 8;
  let page = req.params.page || 1;

  Prodcuatro
  .find({}) // finding all documents
  .sort({ timestamp: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, prodcuatro) => {
    Prodcuatro.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('prodcuatro/new-prodcuatro', {
        prodcuatro,
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
      Prodcuatro
      .find({title: regex}) 
      .sort({ _id: -1 })
      .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
      .limit(perPage) // output just 9 items
      .exec((err, prodcuatro) => {
        Prodcuatro.countDocuments((err, count) => {
        if (err) return next(err);
            res.render("prodcuatro/new-prodcuatro",{
              prodcuatro, 
              current: page,
              pages: Math.ceil(count / perPage)
            });
          });
        });
  } else {
      // Get all campgrounds from DB
      Prodcuatro.find({}, function(err, prodcuatro){
         if(err){
             console.log(err);
         } else {
            res.render("prodcuatro/new-prodcuatro",{
              prodcuatro,
              current: page,
              pages: Math.ceil(count / perPage)
              });
         }
      });
  }
});


/////////////////////////////////////////////////////////////////////

// talle y color
router.get('/prodcuatro/tallecolor/:id',  async (req, res) => {
  const prodcuatro = await Prodcuatro.findById(req.params.id);
  res.render('prodcuatro/tallecolor-prodcuatro', { prodcuatro });
});

router.post('/prodcuatro/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodcuatro.updateOne({_id: id}, req.body);

  res.redirect('/prodcuatroredirect/' + id);
});




//editar


router.get('/prodcuatro/edit/:id',  async (req, res) => {
  const prodcuatro = await Prodcuatro.findById(req.params.id);
  res.render('prodcuatro/edit-proddos', { prodcuatro });
});

router.post('/prodcuatro/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodcuatro.updateOne({_id: id}, req.body);
  res.redirect('/prodcuatrobackend/' + id);
});




// Delete 
router.get('/prodcuatro/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Prodcuatro.deleteOne({_id: id});
  res.redirect('/prodcuatro/add');
});






router.get('/addtocardprodcuatro/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Prodcuatro.findById(productId, function(err, product){
    if(err){
      return res-redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    req.flash('success', 'Producto agregado al carro exitosamente');
    res.redirect('/prodcuatroredirect/' + productId);

  });
});


module.exports = router;
