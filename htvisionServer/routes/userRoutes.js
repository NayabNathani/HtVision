import express from "express";
import {  changePassword, forgetPassword, login, logout, register, resetPassword, updateProfile, deleteMyProfile ,updateProfilePicture, getMyProfile } from "../controllers/userController.js";
import {isAuthenticated} from "../middlewares/Auth.js"
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

//To Register a new User
router.route("/register").post(singleUpload, register);

//Login
router.route("/login").post(login);

//Logout
router.route("/logout").get(logout);

//Get My Profile
router.route("/me").get(isAuthenticated, getMyProfile);

//Change Password
router.route("/changepassword").put(isAuthenticated, changePassword);

//Update Profile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

//Delete My Profile
router.route("/me").delete(isAuthenticated, deleteMyProfile);

//Update Profile Picture
router.route("/updateprofilepciture").put(isAuthenticated, singleUpload, updateProfilePicture);

//Forget Passowrd
router.route("/forgetpassword").post(forgetPassword);

//Reset Password
router.route("/resetpassword/:token").put(resetPassword);



export default router;  