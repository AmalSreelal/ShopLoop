const express = require("express");
const mongoose = require("mongoose");

// To parse the cookie
const cookieParser = require("cookie-parser");  

// To allow cross-origin requests
const cors = require("cors"); 
const authRouter = require("./routes/auth/auth-routes");
const { registerUser } = require("./controllers/auth/auth-controller");

const adminProductsRouter = require("./routes/admin/products-routes");

const shopProductsRouter = require('./routes/shop/products-routes')

const shopCartRouter = require('./routes/shop/cart-routes')

const shopAddressRouter = require('./routes/shop/address-routes')

const shopOrderRouter = require('./routes/shop/order-routes')

const adminOrderRouter = require('./routes/admin/order-routes')

const shopSearchRouter = require('./routes/shop/search-routes')

const shopReviewRouter = require('./routes/shop/review-routes')

const commonFeatureImagesRouter = require('./routes/common/feature-routes')

const helmet = require("helmet");

const allowedOrigins = [
  "http://localhost:5173", // local dev frontend
  "https://shop-loop-ten.vercel.app", // vercel production
];

mongoose
  .connect(
    "mongodb+srv://amalspillaihalo:hBrjQNFlvY1UqScD@shoploop.wq4zegx.mongodb.net/"
  )
  .then(() => console.log("Yayyyy! Mongo db is connected"))
  .catch((error) => console.log("error"));

const app = express(); // CREATE THE EXPRESS APP
const PORT = process.env.PORT || 8080; // Backend server will run on 8080

// To allow cross-origin requests
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

//To parse the cookie that we send from frontend
app.use(cookieParser());

// To get the response from backend in standard json format
app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/admin/products", adminProductsRouter);

app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);

app.use("/api/shop/cart", shopCartRouter);

app.use("/api/shop/address", shopAddressRouter);

app.use("/api/shop/order", shopOrderRouter);

app.use("/api/shop/search", shopSearchRouter);

app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature-images", commonFeatureImagesRouter)

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://*.paypal.com", "https://*.google.com", "https://*.googleadservices.com"],
      connectSrc: ["'self'", "https://*.paypal.com", "https://*.google.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://*.paypal.com", "https://*.google.com"],
    },
  })
);


// /api/auth/registerUser -> registerUser
// /api/auth/loginUser -> loginUser 

// Run the server
app.listen(PORT, () => console.log(`Server is now running on PORT : ${PORT}`));

//admin mail: amalsreelal@admin.com
//admin password: admin123
