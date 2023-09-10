const express = require("express");
const { registerUser, 
    loginUser, 
    logOut, 
    forgotPassword, 
    resetPassword, 
    getUserDetials, 
    updatePassword, 
    updateProfile, 
    getAllUser, 
    getSingleUser, 
    updateUserRole, 
    deleteUser } = require("../controllers/userController");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")


router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logOut);

router.route("/me").get(isAuthenticatedUser, getUserDetials);

router.route("/password/update").put(isAuthenticatedUser,updatePassword);

router.route("/me/updateProfile").put(isAuthenticatedUser,updateProfile);

router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUser);

router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser);

router.route("/admin/updateUserRole/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole);

router.route("/admin/user/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)








module.exports = router;