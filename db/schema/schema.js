const { default: mongoose } = require("mongoose");
const { ERRAND_STATES } = require("../../utils");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  preferredName: String,
  phone: String,
  whatsapp: String,
  image: String,
  wallet: { type: Object, default: { balance: 600 } },
  verification_details: { type: Object, default: {} },
  preferences: { type: Object, default: {} },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  locations: { type: Object, default: [] },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
const errandSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  poster: { type: Object, required: true },
  images: { type: Object, default: [] },
  runner: { type: Object },
  cost: { type: Number, default: 0 },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
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
  inReview: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

errandSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);
const Errand = mongoose.model("Errand", errandSchema);

module.exports = { User, Errand };
