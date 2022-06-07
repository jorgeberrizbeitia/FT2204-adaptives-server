const router = require("express").Router();
const Product = require("../models/Product.model");

const stripe = require("stripe")(
  "sk_test_51Jw5EKCKKbaZslJcK9Ut1BDvKJHOeByhviy6AHFgQts2K8NRt4LCZWjQyb53cxsX9KM3wdOsYiLM0zubBIvyROAf00SKd7LHa5"
);

// GET "/products" to get all products
router.get("/", async (req, res, next) => {
  try {
    const response = await Product.find();
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  console.log(items)

  try {
      const response = await Product.findById(items._id)
      console.log(response)

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        // amount: items.price, // MALA PRACTICA
        amount: response.price * 100,
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // este es el momento en que se hace el payment intent en Stripe
      // aqui podríamos crear un documento de collection Comprar, Transaccion, Intento de Compra
      // Puede tener un Status, el inicial es Pending y luego cambia a realizado
    
      res.send({
        clientSecret: paymentIntent.client_secret,
      });

  } catch (error) {
      console.log(error)
  }

});

module.exports = router;
