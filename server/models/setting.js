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
  isMin: {
    type: Boolean,
    default: true,
  },
  isMax: {
    type: Boolean,
    default: true,
  },
  isUppercaseLetter: {
    type: Boolean,
    default: true,
  },
  isLowercaseLetter: {
    type: Boolean,
    default: true,
  },
  isNumber: {
    type: Boolean,
    default: true,
  },
  isSpecialCharacter: {
    type: Boolean,
    default: true,
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

  // Time to update score
  timeUpdateScore: {
    type: Number,
    default: 90,
  },

  // Time to bet
  timeBet: {
    type: Number,
    default: 5,
  },
});

export default model("Setting", settingSchema);
