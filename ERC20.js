const { ethers, Contract } = require("ethers");
const sound = require("sound-play");
const path = require("path");
const ABI = require("./lib/abi.json");
const c = require("colors")

const filePath = path.join(__dirname, "karo.mp3");

async function getTransfer() {
  const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; ///USDC Contract
  // Note: USDC uses 6 decimal places
  const TRANSFER_THRESHOLD = 100000000000; // wei
  const provider = new ethers.providers.WebSocketProvider(
    "wss://eth-mainnet.g.alchemy.com/v2/0B2-9gET65M0Tb2un4KjfwJcVOR15WDX"
  );
  const contract = new Contract(usdcAddress, ABI, provider);
  const name = await contract.name();
  contract.on("Transfer", (from, to, amount, data) => {
    if (amount.toNumber() >= TRANSFER_THRESHOLD) {
      sound.play(filePath);
      console.log(
        `New whale transfer for ${name}: from : ${c.blue(from)}  to:${c.blue(to)} amount = ${c.green(amount.toNumber())}`
      );
      console.log(`Watch on Scan: https://etherscan.io/tx/${data.transactionHash}`)
    }
  });
}

getTransfer();
