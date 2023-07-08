const { default: mongoose } = require("mongoose");
const { ERRAND_STATES } = require("../../utils");

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
const errandSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  poster: { type: Object, required: true },
  images: { type: Object, type: [] },
  runner: { type: Object },
  cost: { type: Number, default: 0 },
  reward: { type: Number, required: true },
  status: { type: String, default: ERRAND_STATES.DEFAULT },
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
const Errand = mongoose.model("Errand", errandSchema);

module.exports = { User, Errand };
