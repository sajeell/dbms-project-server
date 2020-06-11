const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Importing Express Routes from the `routes` directory
const getCategory = require('./routes/getCategory');
const getProduct = require('./routes/getProduct');
const customerCredential = require('./routes/customerCredential');
const getSingleProduct = require('./routes/getSingleProduct');
const postOrder = require('./routes/postOrder');
const cart = require('./routes/cart');

// Express Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes
app.use('/customer/authentication', require('./routes/customerjwtAuth'));
app.use('/category', getCategory);
app.use('/product', getProduct);
app.use('/credential', customerCredential);
app.use('/single-product', getSingleProduct);
app.use('/order', postOrder);
app.use('/cart', cart);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Started listening at ${PORT}`);
});
