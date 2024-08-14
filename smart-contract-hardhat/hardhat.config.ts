import * as dotenv from "dotenv";

import "@openzeppelin/hardhat-upgrades"
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

const ALCHEMY_URL = process.env.ALCHEMY_URL;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// const MAINNET_RPC_URL = "http://127.0.0.1:8545/";
const MAINNET_RPC_URL = "http://127.0.0.1:7545/";


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.11",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    // sepolia: {
    //   url: `${ALCHEMY_URL}`,
    //   accounts: [`0x${SEPOLIA_PRIVATE_KEY}`]
    // },
    // hardhat: {
    //   // blockConfirmations: 1,
    //   // forking: {
    //   //   url: MAINNET_RPC_URL,
    //   // },
    // },
    // localhost: {
    //   url: "HTTP://127.0.0.1:7545",
    //   chainId: 5777,
    // },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
