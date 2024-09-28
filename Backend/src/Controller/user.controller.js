import { asyncHandler } from "../Utils/AsyncHandler.js";
import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Subject } from "../Models/subject.model.js";
import { question } from "../Utils/question.js";
import { separator } from "../Utils/separator.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
   try {
      const user = await User.findById(userId);
      // console.log(user);

      if (!user) {
         throw new ApiError(404, "User not found");
      }

      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      // console.log("access and refresh token generated");
      
      // console.log(accessToken);
      // console.log(refreshToken);


      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })
      // console.log(user);

      return { accessToken, refreshToken }

   } catch (error) {
      throw new ApiError(500, "Unable to generate access and refresh token")
   }
}

const registerUser = asyncHandler(async (req, res) => {

   const { fullname, username, email, password } = req.body

      // console.log(req.body);

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
   // console.log(req.body);


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

   // console.log("user logged in");
   
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
   // console.log("user logged out");
   
   return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged Out"))
})

const createSubject = asyncHandler(async (req, res) => {
   const { Subjectname } = req.body;
   const userId = req.user._id;
 
   if (!Subjectname) {
     return res.status(400).json({ message: 'Subject name is required' });
   }
 
   // Check if the subject already exists for the same user
   const existingSubject = await Subject.findOne({ Subjectname, user: userId });
   if (existingSubject) {
     return res.status(400).json({ message: 'Subject already exists for the user' });
   }
 
   const newSubject = new Subject({
     Subjectname,
     user: userId,
   });
 
   await newSubject.save();
 
   // Add the subject ID to the user's subjects array
   const user = await User.findById(userId);
   user.subjects.push(newSubject._id);
   await user.save({ validateBeforeSave: false });
 
   res.status(201).json({
     message: 'Subject created successfully',
     subject: newSubject,
   });
 });

const createQuestion =asyncHandler(async(req,res)=>{
    const { topics } = req.body;
    if (!topics) {
        return res.status(400).json({ message: "topics name is required" });
    }

    const response= await question(topics)
   

    return res
    .status(200)
    .json(
        new ApiResponse(200, {
           response
        }, "topics questions")
    );
})

const querySeparator = asyncHandler(async(req,res)=>{
    const {query}= req.body
    if (!query ){
        return res.status(400).json({ message: "queryis required" });
    }

    const response= await separator(query)
   //  console.log(respnse.json());
    

    return res
    .status(200)
    .json(
        new ApiResponse(200, {
           response
        }, "response generated")
    );

})

const getSubject=asyncHandler(async(req,res)=>{

    try {
        const user = await User.findById(req.user._id).populate('subjects', 'Subjectname');
    
        // Print the subject names
        if (user && user.subjects.length > 0) {
            const subjectNames = user.subjects.map((subject) => subject.Subjectname);
            return res.status(200).json({ subjectNames});
        }
         else {
          console.log('No subjects found for this user.');
          return res.status(200).json({ subjects: [] });
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
})


const verifyToken=asyncHandler(async(req,res)=>{
   const token = req.headers.authorization?.split(' ')[1];

   if (!token) {
     return res.status(401).json({ message: 'No token provided' });
   }
 
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
     if (err) {
       return res.status(401).json({ message: 'Invalid or expired token' });
     }
     res.status(200).json({ message: 'Token is valid', user: decoded });
   });
})


export {registerUser,loginUser,logOutUser,createSubject,createQuestion,querySeparator,getSubject,verifyToken}
// =======
// export { registerUser, loginUser, logOutUser }
// >>>>>>> 93b0111130dbb5b26a9781c6ed6846c602ee1cdb
