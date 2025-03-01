import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto  from 'crypto';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar:{
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    isAdmin: {
        type: Boolean,
        default: false, 
      },
      subscription: {
        type: Boolean,
        default: true, 
      },
     
  },
  { timestamps: true }
);


userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || 'default_secret', 
    {
      expiresIn: process.env.JWT_EXPIRE || '7d', 
    }
  );
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Make password optional for updates
userSchema.statics.updateUser = function (id, updateData) {
  return this.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};



const User = mongoose.model('User', userSchema);

export default User;