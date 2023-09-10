const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require('../middleware/catchAsyncErrors');
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const sendToken = require('../utils/jwtToken')
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");


//Register User here
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatar",
        width: 150,
        crop: "scale",
    })

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

    sendToken(user, 201, res);
});


//Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;


    //checking if user has given password and email both
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }


    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or passowrd", 401));
    }

    // below code is used for the comparing the 
    // const isPasswordMatched = user.comparePassword(password); this is used in userModel

    const isPassMatched = await bcrypt.compare(password, user.password);

    if (!isPassMatched) {
        return next(new ErrorHandler("Invalid email or passowrd", 401));
    }

    //this method is created in utils with name jwtToken
    sendToken(user, 201, res);

});


//Logout User

exports.logOut = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expries: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
});



// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    //Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n if you have not requested for resetPassword then please ignore it`;


    try {
        await sendEmail({
            email: user.email,
            subject: `Patanjali_Sattvik_Bazaar Password Recovery`,
            message,
        }); 

        res.status(200).json({
            success: true,
            message: `Email is sent ot ${user.email} successfully`
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
})

//Reset Password 
exports.resetPassword = catchAsyncError(async (req, res, next) => {

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");


    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },

    })

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired ", 404));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not matched"))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});


// Get User Details
exports.getUserDetials = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});


// Update User Password 
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPassMatched = await bcrypt.compare(req.body.oldPassword, user.password);

    if (!isPassMatched) {
        return next(new ErrorHandler("Old Passowrd is incorrect", 401));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match"));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
});


// Update User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatar.public_id;
    
        await cloudinary.v2.uploader.destroy(imageId);
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatar",
          width: 150,
          crop: "scale",
        });
    
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: `User Updated Successfully`
    })
});

//Get all user count on websites -- Admin --
exports.getAllUser = catchAsyncError(async (req, res, next) => {
    const users = await User.find();


    res.status(200).json({
        success: true,
        users,
    });
});


//Get single user from websites -- Admin --
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);


    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user,
    });
});


// Update User Role --Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }


     await User.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

   

    res.status(200).json({
        success: true,
        message: `User Updated Successfully`
    })
});


// Delete User Profile --- Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id)

    if (!user) {
        return next(new ErrorHandler(`User does not exis with Id: ${req.params.id}`))
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne(user);
    res.status(200).json({
        success: true,
        message: `User deleted Successfully`
    })
});























