import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        lowercase: true,
        trim: true,
        minlength: [3, 'Fullname must be at least 3 characters long']
    },
    userName: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
        // match: [/(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/, 'Password must contain at least one letter and one number']
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
        default: null
    },
}, {timestamps: true});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);

    next();
})

userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
    );
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
}

export default mongoose.model("User", userSchema);