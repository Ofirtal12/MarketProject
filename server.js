const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const dotenv = require('dotenv');
const stripe = require('stripe')('sk_test_51NAb3LH43sRUgSe8Byewd9OHngPHgtNo4ycHzEx9N92P21ivewbPTU9OljyPNYLVSr7jIekOAClV2eJxh8VM0s3c00KmNwJ1JH');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 4000;

dotenv.config();

mongoose.connect('mongodb+srv://ofirtsl1995:Ofir1234@cluster0.hlk7vza.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("DB IS ON");

    const userSchema = new Schema({
      username: { type: String, required: true },
      password: { type: String, required: true },
      email: { type: String, required: true }
    });

    const productSchema = new Schema({
      title: {
        type: String,
        required: true
      },
      price: {
        type: String,
        required: true
      }
    });

    const orderSchema = new Schema({
      user: String,
      products: [{
        title: String,
        price: String,
        productImg: String,
        quantity: String
      }],
      totalPrice: String,
      status: String
    });
    const User = model('User', userSchema);
    const Product = mongoose.model('Product', productSchema);
    const Order = mongoose.model('Order', orderSchema);

    // קריאת הקובץ pro.json
const data = fs.readFileSync('pro.json', 'utf-8');
const products = JSON.parse(data).products;

// כניסת המוצרים למסד הנתונים
Product.insertMany(products)
  .then(() => console.log('product success to db'))
  .catch((error) => console.error('error of prod to db', error));

app.use(express.static('pages'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const __dirname = path.resolve();

   // Middleware עבור בדיקת האדמין
   const checkAdmin = (req, res, next) => {
    const isAdmin = req.query.admin === 'true';
    if (isAdmin) {
      next();
    } else {
      res.status(400).json({ error: 'Unauthorized access' });
    }
  };
  

    // עמוד מוצרים
    app.get('/products', (req, res) => {
      res.sendFile('products.html', { root: 'pages' });
    });

    //SUCCESS
    app.get('/success', (req, res) => {
      res.sendFile('success.html', { root: 'pages' });
    });

    // CANCEL
    app.get('/cancel', (req, res) => {
      res.sendFile('cancel.html', { root: 'pages' });
    });

     // SIGNUP
     app.get('/signup', (req, res) => {
      res.sendFile('signup.html', { root: 'pages' });
    });

    // עמוד ההתחברות
    app.post('/', (req, res) => {
      const { username, password } = req.body;

      // בדיקה האם המשתמש קיים במסד הנתונים
      User.findOne({ username })
        .then((existingUser) => {
          if (existingUser && existingUser.password === password) {
            // התחברות מוצלחת
            res.send('<script>alert("Login successful!"); window.location.href = "/products";</script>');
          } else {
            // שם משתמש או סיסמה שגויים
            res.send('<script>alert("Incorrect username or password"); window.location.href = "/login";</script>');
          }
        })
        .catch((err) => {
          const errorMessage = `<script>alert("Error: ${err}"); window.location.href = "/login";</script>`;
          res.send(errorMessage);
        });
    });

    // עמוד הרשמה
    app.post('/signup', (req, res) => {
      const { username, password, email } = req.body;

      // בדיקה האם המייל כבר קיים במערכת
      User.findOne({ email })
        .then((existingUser) => {
          if (existingUser) {
            // המייל תפוס - התראה בדפדפן
            res.send('<script>alert("Email already exists!"); window.location.href = "/signup";</script>');
          } else {
            // המייל פנוי - יצירת משתמש חדש
            const newUser = new User({ username, password, email });
            newUser.save()
              .then(() => {
                res.send('<script>alert("User created successfully!"); window.location.href = "/";</script>');
              })
              .catch((err) => res.send(`<script>alert("Error: ${err}"); window.location.href = "/signup";</script>`));
          }
        })
        .catch((err) => res.send(`<script>alert("Error: ${err}"); window.location.href = "/signup";</script>`));
    });

    // ערוץ '/all' שמציג את כל ההזמנות
    app.get('/all', checkAdmin, (req, res) => {
      Order.find()
        .then((orders) => {
          let html = '<h1>All Orders</h1>';
          orders.forEach((order) => {
            html += '<div class="order">';
            html += `<h2>User: ${order.user}</h2>`;
            html += '<h3>Products:</h3>';
            order.products.forEach((product) => {
              html += '<div class="product">';
              html += `<p>Title: ${product.title}</p>`;
              html += `<p>Price: ${product.price}</p>`;
              html += `<p>Quantity: ${product.quantity}</p>`;
              html += '</div>';
            });
            html += `<p>Total Price: ${order.totalPrice}</p>`;
            html += `<p>Status: ${order.status}</p>`;
            html += '</div>';
          });
          res.send(html);
        })
        .catch((err) => res.status(500).json({ error: err }));
    });


    // עמוד בחירת המוצרים
    app.get('/products', (req, res) => {
      Product.find()
        .then((products) => res.send(products))
        .catch((err) => res.send(`Error: ${err}`));
    });

   // STRIPE
   let stripeGateway = stripe;
   let DOMAIN = process.env.DOMAIN;

   app.post('/stripe-checkout', bodyParser.json(), async (req, res) => {
    const username = req.body.username;
     const lineItems = req.body.items.map((item) => {
       const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, '') * 100);
       console.log('item-price:', item.price);
       console.log('unitAmount:', unitAmount);
       return {
         price_data: {
           currency: 'usd',
           product_data: {
             name: item.title,
             images: [item.productImg]
           },
           unit_amount: unitAmount,
         },
         quantity: item.quantity,
       }
     });
     console.log('lineItems', lineItems);

     // CREATE CHECKOUT SESSION
     const session = await stripeGateway.checkout.sessions.create({
       payment_method_types: ['card'],
       mode: 'payment',
       success_url: `${DOMAIN}/success`,
       cancel_url: `${DOMAIN}/cancel`,
       line_items: lineItems,

       // ASKING FOR ADDRESS IN STRIPE CHECKOUT PAGE
       billing_address_collection: 'required'
     });

     if (req.body.items) {
       const items = req.body.items;
       const user = req.body.user;
       const totalPrice = items.reduce((total, item) => total + parseFloat(item.price.replace('$', '')), 0);
       const status = 'pending';

       const newOrder = new Order({
         user,
         products: items,
         totalPrice: `$${totalPrice.toFixed(2)}`,
         status
       });

       newOrder.save()
        .then((savedOrder) => {
          console.log('Order saved:', savedOrder);
          // res.sendStatus(200);
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(500);
        });
     }

     res.json(session.url);
   });
    
    

    // ראוט הבא נשמר
    app.get('*', (req, res) => {
      res.redirect('/products');
    });

 


    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log(`Error: ${err}`));
