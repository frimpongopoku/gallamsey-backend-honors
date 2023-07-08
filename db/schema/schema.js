const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  preferredName: String,
  phone: String,
  whatsapp: String,
  wallet: { type: Object, default: { balance: 0 } },
  verification_details: { type: Object, default: {} },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
