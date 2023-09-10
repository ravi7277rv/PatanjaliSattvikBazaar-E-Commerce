const catchAsyncError = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


//Payment Processing
exports.processPayment = catchAsyncError(async (req, res, next) => {

    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
    });


    res
    .status(200)
    .json({success: true, client_secret: myPayment.client_secret});

});


// Sending Stripe API_KEY
exports.sendStripeApiKey = catchAsyncError(async (req, res, next) => {
    res.status(200).json({stripeApiKey: process.env.STRIPE_API_KEY})
})




