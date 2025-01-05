import express from "express";
import {
  createUser,
  getUsers,
  loginUser,
  predict,
  historyPredict,
  profileUser,
  updateUser,
} from "../controller/userController.js";
import { addProduct } from "../controller/productController.js";
import authenticateToken from "../middleware/auth.js";
import { uploadHandler, uploadToGCS } from "../middleware/uploadImg.js";
import { errorHandler } from "../middleware/errorHandler.js";
const Router = express.Router();

Router.post("/register", uploadHandler.single('image'), uploadToGCS, errorHandler ,createUser);
// Router.get("/getUsers", getUsers);
Router.post("/login", loginUser);
Router.get("/profile", authenticateToken, profileUser);
Router.post("/predict", authenticateToken, uploadHandler.single("imgFile"), errorHandler , predict);
Router.post("/addproduct", addProduct);
Router.get("/history", authenticateToken, historyPredict);
Router.get("/allUser", authenticateToken, getUsers)
Router.patch("/updateUser", authenticateToken, uploadHandler.single("image"), uploadToGCS, errorHandler , updateUser)

export default Router;
