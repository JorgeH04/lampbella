const express = require('express');
const router = express.Router();

 

// Models
const Prodseis = require('../models/prodseis');
const Cart = require('../models/cart');
//const Order = require('../models/order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');





////////////////////////////////////////back/////////////////////////////////////////////////////7

router.post('/produno/new-produno',  async (req, res) => {
  const { name, title, image, imagedos, imagetres, description, oldprice, price, filtroprice, color, colorstock  } = req.body;
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
    const newNote = new Produno({ name, title, image, imagedos, imagetres, description, price, oldprice, filtroprice, color, colorstock  });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/produnoback/:1');
  }
});





router.get('/produnoback/:page', async (req, res) => {


  let perPage =12;
  let page = req.params.page || 1;

  Produno 
  .find()// finding all documents
  .sort({_id:-1})
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, produno) => {
    Produno.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('produno/new-produno', {
        produno,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});








router.get("/searchback", function(req, res){
  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escape(req.query.search), 'gi');
      // Get all campgrounds from DB
      console.log(req.query.search)
      Produno.find({title: regex}, function(err, produno){
         if(err){
             console.log(err);
         } else {
            if(produno.length < 1) {
                noMatch = "No campgrounds match that query, please try again.";
            }
            res.render("produno/new-produno",{produno, noMatch: noMatch});
         }
      });

  } else {
      // Get all campgrounds from DB
      Produno.find({}, function(err, produno){
         if(err){
             console.log(err);
         } else {
            res.render("produno/produno",{produno, noMatch: noMatch});
         }
      });
  }
});







/////////////////////////////////////////front//////////////////////////////////////////////////

router.get('/produnoindex/:page', async (req, res) => {


  let perPage = 8;
  let page = req.params.page || 1;

  Produno 
  .find({}) // finding all documents
  .sort( {timestamp: -1})
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, produno) => {
    Produno.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('produno/produno', {
        produno,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});






router.get('/produnoredirect/:id', async (req, res) => {
  const { id } = req.params;
  const produno = await Produno.findById(id);
  res.render('produno/produnoredirect', {produno});
});





router.get("/search", function(req, res){
  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escape(req.query.search), 'gi');
      // Get all campgrounds from DB
      console.log(req.query.search)
      Produno.find({title: regex}, function(err, produno){
         if(err){
             console.log(err);
         } else {
            if(produno.length < 1) {
                noMatch = "No campgrounds match that query, please try again.";
            }
            res.render("produno/produno",{produno, noMatch: noMatch});
         }
      });

  } else {
      // Get all campgrounds from DB
      Produno.find({}, function(err, produno){
         if(err){
             console.log(err);
         } else {
            res.render("produno/produno",{produno, noMatch: noMatch});
         }
      });
  }
});



/////////////////////////////////filter/////////////////////////////////////////////




router.post("/filtroprod", function(req, res){

  let perPage = 8;
  let page = req.params.page || 1;

  var flrtName = req.body.filtroprod;

  if(flrtName!='' ) {

    var flterParameter={ $and:[{ name:flrtName},
      {$and:[{},{}]}
      ]
       
    }
    }else{
      var flterParameter={}
  }
  var produno = Produno.find(flterParameter);
  produno
  //.find( flterParameter) 
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, data) => {
    produno.countDocuments((err, count) => {  
  //.exec(function(err,data){
      if(err) throw err;
      res.render("produno/produno",
      {
        produno: data, 
        current: page,
        pages: Math.ceil(count / perPage)
      
      });
    });
  });
});








router.post("/filtroprecio", function(req, res){

  let perPage = 8;
  let page = req.params.page || 1;

  var flrtName = req.body.filtroprice;

  if(flrtName!='' ) {

    var flterParameter={ $and:[{ amount:flrtName},
      {$and:[{},{}]}
      ]
       
    }
    }else{
      var flterParameter={}
  }
  var produno = Produno.find(flterParameter);
  produno
  //.find( flterParameter) 
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, data) => {
    produno.countDocuments((err, count) => {  
  //.exec(function(err,data){
      if(err) throw err;
      res.render("produno/produno",
      {
        produno: data, 
        current: page,
        pages: Math.ceil(count / perPage)
      
      });
    });
  });
});






router.post("/filtrocolor", function(req, res){

  let perPage = 8;
  let page = req.params.page || 1;

  var flrtName = req.body.filtrocolor;

  if(flrtName!='' ) {

    var flterParameter={ $and:[{ color:flrtName},
      {$and:[{},{}]}
      ]
       
    }
    }else{
      var flterParameter={}
  }
  var produno = Produno.find(flterParameter);
  produno
  //.find( flterParameter) 
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, data) => {
    produno.countDocuments((err, count) => {  
  //.exec(function(err,data){
      if(err) throw err;
      res.render("produno/produno",
      {
        produno: data, 
        current: page,
        pages: Math.ceil(count / perPage)
      
      });
    });
  });
});




/////////////////////////////crud//////////////////////////////7

// talle y color
router.get('/prodseis/tallecolor/:id',  async (req, res) => {
  const prodseis = await Prodseis.findById(req.params.id);
  res.render('prodseis/tallecolor-prodseis', { prodseis });
});

router.post('/prodseis/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodseis.updateOne({_id: id}, req.body);

  res.redirect('/prodseisredirect/' + id);
});




//editar


router.get('/prodseis/edit/:id',  async (req, res) => {
  const prodseis = await Prodseis.findById(req.params.id);
  res.render('prodseis/edit-prodseis', { prodseis });
});

router.post('/prodseis/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodseis.updateOne({_id: id}, req.body);
  res.redirect('/prodseisbackend/' + id);
});




// Delete 
router.get('/prodseis/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Prodseis.deleteOne({_id: id});
  res.redirect('/prodseis/add');
});






router.get('/addtocardprodseis/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Prodseis.findById(productId, function(err, product){
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
