import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import {sendToken} from "../utils/sendToken.js"
import crypto from "crypto";
import cloudinary from "cloudinary"
import getDataUri from "../utils/dataUri.js";



export const register = catchAsyncError(async(req,res,next)=>{

    const {name,email,password} = req.body;
    const file = req.file;

    if(!name || !email || !password || !file)
        {return next(new ErrorHandler("Please add all fields",400)); }//400 = bad req

    let user = await User.findOne({ email });
    if(user) 
        return next(new ErrorHandler("User already exist!!",409)) //409 conflict in request

    
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content)

    user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url,
        },
    });

    sendToken(res,user,"Registered Successfully",201);

});

export const login = catchAsyncError(async(req,res,next)=>{

    const {email,password} = req.body;

    if(!email || !password)
        {return next(new ErrorHandler("Please add all fields",400)); }//400 = bad req

    const user = await User.findOne({ email }).select("+password");

    if(!user) 
        return next(new ErrorHandler("Incorrect Email or Password",401)) //401 Unauthorized response//lacks valid authentication credentials for the requested resource

    const isMatch = await user.comparePassword(password);

    if(!isMatch) 
        return next(new ErrorHandler("Incorrect Email or Password",401))
    
    sendToken(res,user, `Welcome Back ${user.name}` ,200);

});

export const logout = catchAsyncError(async(req,res,next)=>{
    res
    .status(200)
    .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
    .json({
        success:true,
        message:"Logged Out Successfully"
    });
});

export const getMyProfile = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user._id);

    res.status(200).json({
        success:true,
        user,
    });


});

export const changePassword = catchAsyncError(async(req,res,next)=>{

    const {oldPassword, newPassword} = req.body;

    if(!oldPassword || !newPassword)
        {return next(new ErrorHandler("Please add all fields",400)); }//400 = bad req

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(oldPassword);

    if(!isMatch)
        return next(new ErrorHandler("Incorrect Old Password",400)); //400 = bad req

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success:true,
        message: "Password Changed Successfully",
    });


});

export const updateProfile = catchAsyncError(async(req,res,next)=>{

    const {name, email} = req.body;

    const user = await User.findById(req.user._id);

    if(name)
        user.name = name;
    if(email)
        user.email = email;

    await user.save();

    res.status(200).json({
        success:true,
        message: "Profile Updated Successfully",
    });


});

export const deleteMyProfile = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user._id);

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    await user.remove();

    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
    }).json({
        success:true,
        message: `${user.name}'s Id Deleted Successfully`,
    });
});

export const updateProfilePicture = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user._id);

    const file = req.file;
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    user.avatar = {
        public_id:mycloud.public_id,
        url:mycloud.secure_url,
    }

    await user.save();

    res.status(200).json({
        success:true,
        message: "Profile Picture Updated Successfully",
    });
});

export const forgetPassword = catchAsyncError(async(req,res,next)=>{

    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user)
     return next(new ErrorHandler("User Not Found",400)); //400 = bad req

    const resetToken = await user.getResetToken();

    await user.save();

    //http://localhost:3000/resetpassword/resettoken
    const url= `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    const message = `Click on the link to reset your password. ${url}. If you have not requested then please ignore.`

    //Send token via email
    await sendEmail(user.email,"CourseBundler Reset Password", message)
    
    res.status(200).json({
        success:true,
        message: `Reset Token hasbeen sent to ${user.email}`,
    });
});

export const resetPassword = catchAsyncError(async(req,res,next)=>{

    const {token} = req.params;

    const resetPasswordToken = crypto.
    createHash("sha256").
    update(token).
    digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{
            $gt: Date.now(),
        },
    });

    if(!user) 
        return next(new ErrorHandler("Token is invalid or has been expired",))

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success:true,
        message: "Password Changed Successfully",
    });
});










