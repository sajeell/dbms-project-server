('use strict');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Importing Express Routes from the `routes` directory
const getCategory = require('./routes/getCategory');
const getProduct = require('./routes/getProduct');
const customerCredential = require('./routes/customerCredential');
const adminCredential = require('./routes/adminCredential');
const tailorCredential = require('./routes/tailorCredential');
const getSingleProduct = require('./routes/getSingleProduct');
const postOrder = require('./routes/postOrder');
const postProduct = require('./routes/postProduct');
const cart = require('./routes/cart');
const checkout = require('./routes/checkout');
const status = require('./routes/orderStatus');
const getOrder = require('./routes/getOrder');

// Express Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes
app.use('/customer/authentication', require('./routes/customerjwtAuth'));
app.use('/admin/authentication', require('./routes/adminjwtAuth'));
app.use('/tailor/authentication', require('./routes/tailorjwtAuth'));
app.use('/category', getCategory);
app.use('/product', getProduct);
app.use('/credential', customerCredential);
app.use('/admin-credential', adminCredential);
app.use('/tailor-credential', tailorCredential);
app.use('/single-product', getSingleProduct);
app.use('/order', postOrder);
app.use('/cart', cart);
app.use('/checkout', checkout);
app.use('/postproduct', postProduct);
app.use('/status', status);
app.use('/orders', getOrder);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Started listening at ${PORT}`);
});
