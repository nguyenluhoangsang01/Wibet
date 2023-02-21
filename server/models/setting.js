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
  isSymbols: {
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

  // Bank
  nameOfBank: {
    type: String,
    default: "NGUYEN LU HOANG SANG",
  },
  stkOfBank: {
    type: String,
    default: "0071001322838",
  },
  bank: {
    type: String,
    default: "Vietcombank TpHCM",
  },
  contentOfBank: {
    type: String,
    default: "TMA Account_nick_Tên Họ_wibet",
  },
  noteOfBank: {
    type: String,
    default: "(VD: nlhsang_Sang Nguyễn_wibet)",
  },

  // MoMo
  numberOfMoMo: {
    type: String,
    default: "0776689228",
  },
  nameOfMoMo: {
    type: String,
    default: "Nguyễn Lữ Hoàng Sang - DC22",
  },
  contentOfMoMo: {
    type: String,
    default: "TMA Account_nickname_Tên Họ_wibet",
  },
  noteOfMoMo: {
    type: String,
    default: "(VD: nlhsang_Sang Nguyễn_wibet)",
  },

  // Skype
  skypeName: {
    type: String,
    default: "Nguyen Lu Hoang Sang",
  },
  skypeLink: {
    type: String,
    default: "https://join.skype.com/v9QN63Radddn",
  },
});

export default model("Setting", settingSchema);
