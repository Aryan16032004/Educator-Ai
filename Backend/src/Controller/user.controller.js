import { asyncHandler } from "../Utils/AsyncHandler.js";
import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";


const generateAccessAndRefreshToken = async (userId) => {
   try {
      const user = await User.findById(userId);
      console.log(user);

      if (!user) {
         throw new ApiError(404, "User not found");
      }

      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      console.log(accessToken);
      console.log(refreshToken);


      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })
      console.log(user);

      return { accessToken, refreshToken }

   } catch (error) {
      throw new ApiError(500, "Unable to generate access and refresh token")
   }
}

const registerUser = asyncHandler(async (req, res) => {

   const { fullname, username, email, password } = req.body

   //    console.log(req.body);

   // //    console.log("email: " ,email);
   // // if(fullname === ""){
   // //     throw new ApiError(400,"fullname is required")
   // // }
   if (
      [fullname, email, username, password].some((field) => field?.trim() === "")
   ) {
      throw new ApiError(400, "All fields are required")
   }

   const existedUser = await User.findOne({
      $or: [{ username }, { email }]
   })

   //    console.log(req.files);

   if (existedUser) {
      throw new ApiError(409, "User already existed")
   }

   // // //    console.log(avatar);




   const user = await User.create({
      fullname,
      email,
      password,
      username: username.toLowerCase()
   })

   const createdUserId = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if (!createdUserId) {
      throw new ApiError(500, "Something went wrong while creating the user ")
   }

   return res.status(201).json(
      new ApiResponse(200, createdUserId, "User registerd succesfully")
   )

});

const loginUser = asyncHandler(async (req, res) => {
   // Extract user credentials from request body
   const { email, password } = await req.body;
   console.log(req.body);


   // Ensure either username or email is provided
   if (!email) {
      throw new ApiError(400, "email is required");
   }

   // Find the user by either username or email
   const user = await User.findOne({ email }).populate('subjects');

   if (!user) {
      throw new ApiError(404, "User does not exist");
   }

   // Validate password
   const isPasswordValid = await user.isPasswordCorrect(password);
   if (!isPasswordValid) {
      throw new ApiError(401, "Incorrect password");
   }

   // Generate access and refresh tokens
   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

   // Retrieve logged-in user's details excluding sensitive fields
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   // Set cookies for access and refresh tokens
   const options = {
      httpOnly: true,
      secure: true, // Consider making this conditional based on environment (e.g., secure for production only)
   };

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken,
         }, "User logged in successfully")
      );
});

const logOutUser = asyncHandler(async (req, res) => {

   await User.findByIdAndUpdate(
      req.user._id,
      {
         $set: {
            refreshToken: undefined
         }
      }, {
      new: true
   }
   )

   const options = {
      httpOnly: true,
      secure: true
   }

   return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged Out"))
})



export { registerUser, loginUser, logOutUser }