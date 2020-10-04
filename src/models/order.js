const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const OrderSchema = new Schema({
  user: { 
    type: ObjectId,
    ref: 'User'
   },
   cart: {
     type: Object,
     required: true
   
   },
   name: {
    type: String,
    // required: true
   },

   surname: {
    type: String,
    // required: true
   },
   

    number: {
    type: String,
   // required: true
   },
   fecha: {
   type: String,
  //  required: true
   },
    address: {
    type: String,
   //  required: true
   },
   localidad: {
   type: String,
  //  required: true
 },
   piso: {
   type: String,
//  required: true
  },

  nota: {
    type: String,
 //  required: true
   }

});

module.exports = mongoose.model('Order', OrderSchema);