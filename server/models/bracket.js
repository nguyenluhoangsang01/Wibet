import { model, Schema } from "mongoose";

const bracketSchema = new Schema({
  name: String,
  matchDate: Date,
  homeTeamName: String,
  homeScore: Number,
  homeSeedDisplayName: String,
  homeSeedRank: Number,
  homeSeedSourceGame: Object,
  homeSeedSourcePool: Object,
  visitorTeamName: String,
  visitorScore: Number,
  visitorSeedDisplayName: String,
  visitorSeedRank: Number,
  visitorSeedSourceGame: Object,
  visitorSeedSourcePool: Object,
});

export default model("Bracket", bracketSchema);
