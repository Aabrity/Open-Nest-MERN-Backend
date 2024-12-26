import mongoose from 'mongoose';

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
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    isAdmin: {
        type: Boolean,
        default: false, // Regular users are not admins by default
      },
      subscription: {
        type: Boolean,
        default: false, // Not subscribed by default
      },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;