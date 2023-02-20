import { Schema, model } from "mongoose";

const settingSchema = new Schema({
  // Email

  // Password
  minPassword: {
    type: Number,
    default: 3,
  },
  maxPassword: {
    type: Number,
    default: 20,
  },
  wrongPasswordTimes: {
    type: Number,
    default: 5,
  },

  // Rate
  minRate: {
    type: Number,
    default: 0,
  },
  maxRate: {
    type: Number,
    default: 3,
  },

  // Bet money
  minBetMoney: {
    type: Number,
    default: 50,
  },

  // Score
  maxScore: {
    type: Number,
    default: 10,
  },

  // Money
  defaultMoney: {
    type: Number,
    default: 200,
  },
});

export default model("Setting", settingSchema);
