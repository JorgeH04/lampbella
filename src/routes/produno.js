const express = require('express');
const router = express.Router();
const mercadopago = require("mercadopago");
const paypal = require('paypal-rest-sdk');
const userController=require('../config/controllers');
const User = require('../models/User');
const nodeMailer = require('../config/nodemailer');


// Models
const Produno = require('../models/produno');
const Cart = require('../models/cart');
const Order = require('../models/order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

const resetMailer=require('../mailer/resetPasswordmailer');
const resetSuccess=require('../mailer/resetPasswordSuccess');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AQc6BTFp8STtOFTt6GTue2HBmoVlSlnJXuLa2i_U2giuOwqCm6wVQB8EP5n925UgXb08pK1a3AE2y6XL',
  'client_secret': 'EFSgKO0QQGE-URzmVMB-9eT9fOxAPXPEpNZ07RiyZOnb5m5PoizR0q7ML3i8RR1X0W9TWCOC-bmM-mPK'
});


///////////////////////////////////////////////////////////////////////7

router.post('/produno/new-produno',  async (req, res) => {
  const { name, title, image, imagedos, imagetres, description, oldprice, price, filtroprice, enstock, color, colorstock, talle, tallestock} = req.body;
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
    const newNote = new Produno({ name, title, image, imagedos, imagetres, description, oldprice, price, filtroprice, enstock, color, colorstock, talle, tallestock });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/produnoback/1');
  }
});



router.get('/produnoredirect/:id', async (req, res) => {
  const { id } = req.params;
  const produno = await Produno.findById(id);
  res.render('produno/produnoredirect', {produno});
});



////////////////////////////////////////////////////////////////7


router.get('/produnoindex/:page', async (req, res) => {


  let perPage = 8;
  let page = req.params.page || 1;

  Produno 
  .find({}) // finding all documents
  .sort({ _id: -1 })
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





router.get("/search", function(req, res){
  let perPage = 8;
  let page = req.params.page || 1;

  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escape(req.query.search), 'gi');
      // Get all campgrounds from DB
      console.log(req.query.search)
      Produno
      // finding all documents
      .find({title: regex}) 
      .sort({ _id: -1 })
      .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
      .limit(perPage) // output just 9 items
      .exec((err, produno) => {
       Produno.countDocuments((err, count) => {
        if (err) return next(err);
            res.render("produno/produno",{
              produno, 
              current: page,
              pages: Math.ceil(count / perPage)
            });
          });
        });
  } else {
      // Get all campgrounds from DB
      Produno.find({}, function(err, produno){
         if(err){
             console.log(err);
         } else {
            res.render("produno/produno",{
              produno,
              current: page,
              pages: Math.ceil(count / perPage)
              });
         }
      });
  }
});















///////////////////////////////////////////////////////////
router.get('/produnoback/:page', async (req, res) => {


  let perPage = 8;
  let page = req.params.page || 1;

  Produno 
  .find({}) // finding all documents
  .sort({ _id: -1 })
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
  let perPage = 8;
  let page = req.params.page || 1;

  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escape(req.query.search), 'gi');
      // Get all campgrounds from DB
      console.log(req.query.search)
      Produno
      // finding all documents
      .find({title: regex}) 
      .sort({ _id: -1 })
      .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
      .limit(perPage) // output just 9 items
      .exec((err, produno) => {
       Produno.countDocuments((err, count) => {
        if (err) return next(err);
            res.render("produno/new-produno",{
              produno, 
              current: page,
              pages: Math.ceil(count / perPage)
            });
          });
        });
  } else {
      // Get all campgrounds from DB
      Produno.find({}, function(err, produno){
         if(err){
             console.log(err);
         } else {
            res.render("produno/new-produno",{
              produno,
              current: page,
              pages: Math.ceil(count / perPage)
              });
         }
      });
  }
});








router.post("/filtroprecio", function(req, res){

  let perPage = 8;
  let page = req.params.page || 1;

  var flrtName = req.body.filtroprice;

  if(flrtName!='' ) {

    var flterParameter={ $and:[{ filtroprice:flrtName},
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










router.get('/produnobackend/:id', async (req, res) => {
  const { id } = req.params;
  const produno = await Produno.findById(id);
   res.render('produno/produnobackend', {produno});
});


///////////////////////////////////////////////////////////////////////////7



// talle y color
router.get('/produno/tallecolor/:id',  async (req, res) => {
  const produno = await Produno.findById(req.params.id);
  res.render('produno/tallecolor-produno', { produno });
});

router.post('/produno/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Produno.updateOne({_id: id}, req.body);

  res.redirect('/produnoredirect/' + id);
});




//editar


router.get('/produno/edit/:id',  async (req, res) => {
  const produno = await Produno.findById(req.params.id);
  res.render('produno/edit-produno', { produno });
});

router.post('/produno/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Produno.updateOne({_id: id}, req.body);
  res.redirect('/produnoback/:1');
});




// Delete 
router.get('/produno/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Produno.deleteOne({_id: id});
  res.redirect('/produnoback/:1');
});









router.get('/addtocardproduno/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Produno.findById(productId, function(err, product){
    if(err){
      return res-redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    req.flash('success', 'Producto agregado al carro exitosamente');
    res.redirect('/produnoredirect/' + productId);

  });
});


router.get('/sumar/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.sumar(productId);
  req.session.cart = cart;
  res.redirect('/shopcart');
});

router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopcart');
});

router.get('/remove/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopcart');
});


router.get('/shopcart', function (req, res, next){
  if(!req.session.cart){
    return res.render('cart/shopcart', {products:null})
  }
  var cart = new Cart(req.session.cart);
  res.render('cart/shopcart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});



//router.get('/checkout',isAuthenticated, function (req, res, next){
  router.get('/checkout', function (req, res, next){
  var cart = new Cart(req.session.cart);
  res.render('cart/checkout', {products: cart.generateArray(), total: cart.totalPrice})
});



//router.post('/checkout', isAuthenticated, async (req, res, next)=>{  







router.post('/confirmacion', isAuthenticated, async (req, res, next)=>{
  if(!req.session.cart){
    return res.render('/', {products:null})
  }
  const cart = new Cart(req.session.cart);

  const order = new Order({
    user: req.user,
    cart: cart,
    name: req.body.name,
    surname: req.body.surname,
    number: req.body.number,
    fecha: req.body.fecha,
    address: req.body.address,
    localidad: req.body.localidad,
    piso: req.body.piso,
    envio: req.body.envio,
    nota: req.body.nota,
    talle: req.body.talle,
    color: req.body.color,
    total: req.body.total

  });
  console.log(order)
  await order.save();
  req.flash('success_msg', 'Note Added Successfully');
  res.redirect('/mediodepago');
  
})



router.get('/prepagar', isAuthenticated, function (req, res, next){
  if(!req.session.cart){
    return res.render('/', {products:null})
  }
  var cart = new Cart(req.session.cart);
  res.render('cart/prepagar', {products: cart.generateArray(), total: cart.totalPrice})
 // res.redirect('/mediodepago', {products: cart.generateArray(), total: cart.totalPrice});
});



router.get('/mediodepago', isAuthenticated, function (req, res, next){

  if(!req.session.cart){
    return res.render('/', {products:null})
  }
  var cart = new Cart(req.session.cart);
  res.render('cart/mediodepago', {products: cart.generateArray(), total: cart.totalPrice})
});




/////////////////////////////////////mercadopago///////////////////////////////////////////////////////////////////////////////////
router.get('/checkout', function (req, res, next){
  var cart = new Cart(req.session.cart);
  res.render('cart/checkoutmercadopago', {products: cart.generateArray(), total: cart.totalPrice})
});


router.post('/checkout',isAuthenticated,  async (req, res) => {

  if(!req.session.cart){
    return res.render('/', {products:null})
 }
 const cart = new Cart(req.session.cart);

  mercadopago.configure({
      //insert your access_token
     // access_token: process.env.ACCESS_TOKEN
     //access_token: 'TEST-1727718622428421-041715-2360deef34519752e5bd5f1fca94cdf1-344589484',
    // publicKey: 'TEST-662a163b-afb0-4994-9aea-6be1cca2decd'

    //access_token: 'APP_USR-1727718622428421-041715-07777da5a8f8451aba826d2727adeadd-344589484',
     //publicKey: 'APP_USR-9abfa6a9-7a19-45c9-9d13-15edf5baf8f7'
  
    //access_token: 'TEST-7459742784739345-090600-58c5ee18f226720681e0502f49e159f3-628892582',
    //publicKey: 'TEST-a855c7e7-2035-44ce-b766-c5553ea80ad1'

    access_token: 'APP_USR-7459742784739345-090600-403fad11f06c113d74d429b252871dc2-628892582',
    publicKey: 'APP_USR-c479d966-97cd-4f1b-adf7-184e78957723'

    //client 7459742784739345
    //clientsecret 0b1omc6YZCO6cgBQEBU9tTmkDIYUCD1S
    });
  
    // Cria um objeto de preferência
    let preference = {
      items: [
        {
          title: "Total a pagar:",
          unit_price: cart.totalPrice, 
          quantity: 1
        }
      ]
    };

   
    mercadopago.preferences
      .create(preference)
      .then(function(response) {
        global.init_point = response.body.init_point;
        var preference_id = response.body.id;
        res.render("cart/checkout", { preference_id });
      })
      .catch(function(error) {
        res.render("error");
        console.log(error);
      });
    
});  


////////////////////////////////paypal//////////////////////////////////////

// router.get('/checkoutpaypal',isAuthenticated, function (req, res, next){
//   var cart = new Cart(req.session.cart);
//   res.render('cart/checkoutpaypal', {products: cart.generateArray(), total: cart.totalPrice})
// });


router.post('/paypalcheckout', (req, res) => {
  if(!req.session.cart){
    return res.render('/', {products:null})
 }
 const cart = new Cart(req.session.cart);


 var payReq = {
  intent:'sale',
  payer: {
    payment_method: 'paypal'
  },
  redirect_urls:{
    return_url:'http://localhost:3000/success',
    cancel_url:'http://localhost:3000/cancel'
  },
  transactions: [{

    
 
    amount: {
        currency: 'BRL',
        total: req.session.cart.totalPrice
    },
    "description": "Hat for the best team ever"
}]
};



paypal.payment.create(payReq, function (error, payment) {
  if (error) {
      throw error;
  } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
  }
});

});

router.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [{
        amount: {
            "currency": 'BRL',
            "total": req.session.cart.totalPrice
        }
    }]
  };



  paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment ) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
       // res.send('Success');
       const { name, email, password, confirm_password, number, fecha, address, telefono, direccion, localidad, piso} = req.body;
       let user= await User.findOne({email: req.body.email});

        nodeMailer.transporter.sendMail({
        from: 'passwordreset@demo.com',
        to: user,
        subject: 'Tu compra',
        text:  'Hello,\n\n' +
        'Tu pago ha sido realizado ' + user + ' has just been changed.\n'
     }, (err, info) => {
         if (err){
             console.log('Error in sending mail', err);
             return;
         }
        });
      

       req.flash('success', 'El pago ha sido efectuado. Muchas Gracias y hasta la próxima compra');
       res.redirect('/');
    }
});
});

router.get('/cancel', (req, res) => res.send('Cancelled'));


module.exports = router;
