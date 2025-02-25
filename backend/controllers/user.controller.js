import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
//import { Loan } from "../models/loan.models.js";
import { transporter } from "../config/nodemailer.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Log the incoming request body for debugging
  //console.log("Request body:", req.body);

  const { email, username, password, ethAddress } = req.body;

  // More detailed validation
  const missingFields = [];
  if (!email) missingFields.push("email");
  if (!username) missingFields.push("username");
  if (!password) missingFields.push("password");

  if (missingFields.length > 0) {
    throw new ApiError(
      400,
      `Missing required fields: ${missingFields.join(", ")}`
    );
  }

  // Validate that fields are not empty strings after trimming
  if ([email, username, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required and cannot be empty");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [
      { username: username.toLowerCase() },
      { email: email.toLowerCase() },
      ...(ethAddress ? [{ ethAddress }] : []), // Only include ethAddress in query if it exists
    ],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with email, username, or wallet address already exists"
    );
  }

  // Create new user
  const user = await User.create({
    email: email.toLowerCase(),
    password,
    username: username.toLowerCase(),
    ...(ethAddress && { ethAddress }), // Only include ethAddress if it exists
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Log the response data for debugging
  const responseData = {
    status: 200,
    data: {
      user: loggedInUser,
      accessToken,
      refreshToken,
    },
    message: "User logged in successfully",
  };

  console.log("Server Response:", responseData); // Debug log

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, responseData.data, responseData.message));
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //get token from user
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  //req.body==> for for mobile users

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  //we want decoded data so...
  try {
    // trycatch for DB calls
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    //check the incomingRefreshToken === refreshtoken saved in DB
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    //better to declare as g variable
    const options = {
      httpOnly: true,
      secure: true,
    };

    //generateAccessAndRefreshToken
    const { accessToken, newrefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            newrefreshToken,
          },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// const changeCurrentPassword = asyncHandler(async (req, res) =>{
//     const {oldPassword, newPassword} = req.body;

//     //get user._id from DB
//     const user = await User.findById(req.user?._id)
//     //isPasswordCorrect method is defined in user.models.js

//     const isPasswordCorrect =  await user.isPasswordCorrect(oldPassword)

//     if(!isPasswordCorrect){
//         throw new ApiError(400, "Invalid old password")
//     }

//     //set newPassword to user's password
//     user.password = newPassword
//     //Now save it in the DB
//     await user.save({ validateBeforeSave: false })

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200, {}, "Password changed successfully")
//     )

// })

const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(404, "User does not exist");
  }

  const user = await User.findById(userId).select("-password");
  //console.log(user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user details successfully fetched"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "all fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "account details updated successfully"));
});

// const updateSubscription = asyncHandler(async (req, res)=> {

//   const userId = req.user._id;

//   const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {$bit: {isSubscribed: {xor: 1 } } },
//       {new : true}
//   );

//   if(!updatedUser){
//       throw new ApiError(404, "User doesn't exist")
//   }
//   if (!updatedUser.email) {
//     throw new ApiError(400, "User does not have an email registered.");
//   }

//   try {
//     await transporter.sendMail({
//       from: `"EthGrow" <${process.env.EMAIL_USER}>`,
//       to: updatedUser.email, 
//       subject: updatedUser.isSubscribed
//         ? "Welcome to Our Newsletter!"
//         : "You have unsubscribed!",
//       text: updatedUser.isSubscribed
//         ? "Thank you for subscribing to our updates."
//         : "You have successfully unsubscribed from our updates.",
//       html: updatedUser.isSubscribed
//         ? "<h2>Welcome!</h2><p>We are excited to have you with us!</p>"
//         : "<h2>Goodbye!</h2><p>We're sorry to see you go. You can subscribe again anytime!</p>",
//     });
//   } catch (error) {
//       throw new ApiError(500, "Something went wrong!")
//   }
  
//   return res.status(200).json(
//       new ApiResponse(
//           200, 
//           {isSubscribed: updatedUser.isSubscribed},
//           "Subscription updated successfully")
//   )
// });


const updateSubscription = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }
 
  const newSubscriptionStatus = !user.isSubscribed;

  try {
    await transporter.sendMail({
      from: `"EthGrow" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: user.isSubscribed
        ? "Welcome to Our Newsletter!"
        : "You have unsubscribed!",
      text: user.isSubscribed
        ? "Thank you for subscribing to our updates."
        : "You have successfully unsubscribed from our updates.",
      html: user.isSubscribed
        ? "<h2>Welcome!</h2><p>We are excited to have you with us!</p>"
        : "<h2>Goodbye!</h2><p>We're sorry to see you go. You can subscribe again anytime!</p>",
    });

  } catch (error) {
    user.isSubscribed = !user.isSubscribed;
    await user.save();
    
    throw new ApiError(500, "Subscription update failed. Please try again.");
  }
    user.isSubscribed = newSubscriptionStatus;
    await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { isSubscribed: user.isSubscribed },
      "Subscription updated successfully"
    )
  );
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  getCurrentUser,
  updateAccountDetails,
  updateSubscription
};
