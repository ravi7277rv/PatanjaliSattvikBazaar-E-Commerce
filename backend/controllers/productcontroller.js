const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require('../middleware/catchAsyncErrors');
const ApiFeatures = require("../utils/apifeatures");
const Cloudinary = require("cloudinary");





//Get All Product
exports.getAllProducts = catchAsyncError(async (req, res) => {


    const resultPerPage = 20;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)

    const products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
    });
});


//Get All Product --ADMIN
exports.getAdminProducts = catchAsyncError(async (req, res) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});




//Get Single Product Details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,

    });
});

//Create Product  ---Admin 
exports.createProduct = catchAsyncError(async (req, res, next) => {

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLink = [];

    for (let i = 0; i < images.length; i++) {
        const result = await Cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
            width: 150,
            crop: "scale",
        })

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url,
        })
    }


    req.body.images = imagesLink;
    req.body.user = req.user.id
    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        product
    })

});

// Update Product by Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not Found", 404))
    }


product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true,
    useFindAndModify: false
});

res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product
});
console.log(`This is the product form product controller ${product}`)
});

//Delete Product  by Admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    // Deleteing Images form cloudinary

    for (let i = 0; i < product.images.length; i++) {
        await Cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }


    if (!product) {
        res.status(404).json({
            success: false,
            message: "Product Not Found"
        })
    }

    await product.deleteOne(product);

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        product
    });

});


// Create New Review or Update the Review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                rev.rating = rating,
                    rev.comment = comment
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;
    
    if(reviews.length === 0) {
        ratings = 0;
    }else{
        ratings = avg / reviews.lenght;
    }

    product.ratings = avg / product.reviews.length;

    console.log(`Ratings of the product is ${product.ratings}`);
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Review has been created"
    });

});


// Get All Reviews of a Product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })


});


// Delete Reviews of a Product
exports.deleteReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString());

    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    })

    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews,
    }, {
        new: true,
        runValidator: true,
        useFindAndModify: false,
    }
    );

    res.status(200).json({
        success: true,
        reviews: product.reviews,
        message: `Review Deleted Successfully`
    })


});




