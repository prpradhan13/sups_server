import { alphabetRegex, passwordRegex } from "../config/constants.config.js";
import User from "../model/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        return res
            .status(500)
            .send({ message: "Error generate Access And Refresh Token", error });
    }
};

export const registerUser = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;

    if (
      [fullName, userName, email, password].some((field) => field.trim() === "")
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }

    if(userName.length < 3){
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    if (!alphabetRegex.test(fullName)) {
      return res
        .status(400)
        .json({ message: "Full name must contain only alphabetic characters and spaces" });
    }

    // if (!passwordRegex.test(password)) {
    //   return res.status(400).send({
    //     success: false,
    //     message:
    //       "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character (@, #, !, $, ^, &, *).",
    //   });
    // }

    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User is already exists" });
    }

    const savedUser = await User.create({ 
        fullName: fullName.trim(), 
        userName: userName.trim(), 
        email,
        password
    });

    const newUser = await User.findById(savedUser._id).select("-password -refreshToken");
    if (!newUser) {
      return res
        .status(500)
        .json({ message: "Failed to retrieve user after registration" });
    }

    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.log("Something is wrong in registerUser!", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!email && !userName && !password) {
            return res.status(400).json({ message: "Please fill all reuired fields." });
        }

        const user = await User.findOne({ $or: [ { email }, { userName } ] });
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials!" });
        }

        const isMatch = await user.isPasswordMatch(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const userData = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "None", // Strict
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ message: "Login successful", user: userData });

    } catch (error) {
        console.log("Something is wrong in loginUser!", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
