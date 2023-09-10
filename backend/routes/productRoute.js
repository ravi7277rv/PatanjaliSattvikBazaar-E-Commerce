const express = require("express");
const { getAllProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProductDetails,
    createProductReview,
    getProductReviews,
    deleteReviews,
    getAdminProducts,
 } = require("../controllers/productcontroller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router(); 

router.route("/products")
.get(getAllProducts);

router.route("/admin/allProducts")
.get(isAuthenticatedUser,authorizeRoles("admin"),getAdminProducts)

router.route("/admin/product/new")
.post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);

router.route("/admin/productUpdate/:id")
.put(isAuthenticatedUser,authorizeRoles("admin"),isAuthenticatedUser,updateProduct);

router.route("/admin/productDel/:id")
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);

router.route("/product/:id")
.get(getProductDetails);

router.route("/review")
.put( isAuthenticatedUser,createProductReview);

router.route("/getAlleReviews")
.get(getProductReviews);

router.route("/admin/deleteReview")
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteReviews);





module.exports = router 