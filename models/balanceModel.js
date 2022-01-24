import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema({
  userid: { type: String },
  usd: { type: Number },
  btc: { type: Number },
  eth: { type: Number },
  bnb: { type: Number },
  sol: { type: Number },
  xrp: { type: Number },
  ada: { type: Number },
  algo: { type: Number },
  doge: { type: Number },
  okb: { type: Number },
  trx: { type: Number },
  klay: { type: Number },
  btt: { type: Number },
  enj: { type: Number },
  cake: { type: Number },
  ht: { type: Number },
  tfuel: { type: Number },
  bsv: { type: Number },
  neo: { type: Number },
  celo: { type: Number },
  qnt: { type: Number },
  frax: { type: Number },
  cvx: { type: Number },
  crv: { type: Number },
  leo: { type: Number },
  mkr: { type: Number },
  stx: { type: Number },
  aave: { type: Number },
  xec: { type: Number },
  ar: { type: Number },
  eos: { type: Number },
  flow: { type: Number },
  gala: { type: Number },
  zec: { type: Number },
  rose: { type: Number },
  hnt: { type: Number },
  ksm: { type: Number },
  cdai: { type: Number },
  hbtc: { type: Number },
  dash: { type: Number },
  time: { type: Number },
  grt: { type: Number },
  kda: { type: Number },
  osmo: { type: Number },
  cusdc: { type: Number },
  omi: { type: Number },
  ohm: { type: Number },
  kcs: { type: Number },
  tusd: { type: Number },
  lrc: { type: Number },
  miota: { type: Number },
  bat: { type: Number },
  sushi: { type: Number },
  chz: { type: Number },
  amp: { type: Number },
  rune: { type: Number },
  fxs: { type: Number },
  xrd: { type: Number },
  waves: { type: Number },
  xmr: { type: Number },
  spell: { type: Number },
  comp: { type: Number },
  cel: { type: Number },
  nexo: { type: Number },
  uni: { type: Number },
  steth: { type: Number },
  ftm: { type: Number },
  usdc: { type: Number },
  usdt: { type: Number },
  hbar: { type: Number },
  busd: { type: Number },
  bch: { type: Number },
  axs: { type: Number },
  wbtc: { type: Number },
  ust: { type: Number },
  link: { type: Number },
  luna: { type: Number },
  xlm: { type: Number },
  dot: { type: Number },
  AVAX: { type: Number },
  vet: { type: Number },
  shib: { type: Number },
  near: { type: Number },
  ftt: { type: Number },
  icp: { type: Number },
  matic: { type: Number },
  dai: { type: Number },
  fil: { type: Number },
  egld: { type: Number },
  atom: { type: Number },
  mina: { type: Number },
  etc: { type: Number },
  ceth: { type: Number },
  cro: { type: Number },
  one: { type: Number },
  sand: { type: Number },
  ltc: { type: Number },
  mana: { type: Number },
  xtz: { type: Number },
  theta: { type: Number },
  mim: { type: Number },
  safemoon: { type: Number },
  jewel: { type: Number },
  scrt: { type: Number },
});

export default mongoose.model("balance", balanceSchema);
