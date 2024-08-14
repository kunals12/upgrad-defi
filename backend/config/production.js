'use strict';

// Global
var path = require('path');
var config = {}
var projectDirectory = path.resolve(__dirname, "..")
var smartContractDirectory = path.resolve(__dirname, "../../smart-contract-hardhat")

// Enviornment
config.env = 'production'

/******************** Express Server config *************************/
config.server = {}
config.server.host = '0.0.0.0'
config.server.port = 5001
/******************** Express Server config *************************/

/******************** Blockchain *************************/
config.blockchain = {}
config.blockchain.url = "http://127.0.0.1:8545"
config.blockchain.chainId = "5777"
/******************** Blockchain *************************/

/******************** Smart Contract *************************/
config.smartContract = {}
config.smartContract.upgradToken = {}
config.smartContract.upgradToken.address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
// config.smartContract.upgradToken.gasLimit = 100000
config.smartContract.upgradToken.buildPath = smartContractDirectory + "/artifacts/contracts/1_UpgradTokenContract.sol/UpgradToken.json"
config.smartContract.defiplatform = {}
config.smartContract.defiplatform.address = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
// config.smartContract.defiplatform.gasLimit = 2000000
config.smartContract.defiplatform.buildPath = smartContractDirectory + "/artifacts/contracts/3_DefiPlatformContract.sol/DefiPlatform.json"
/******************** Smart Contract *************************/

/******************** Wallet *************************/
config.wallet = {}
/******************** Wallet *************************/

/**********************Logging***********************/
config.logs = {}
config.logs.consoleLogs = true
config.logs.fileLogs = false
config.logs.api = {}
config.logs.api.path = "/var/log/defi/"
config.logs.api.category = "API"
/**********************Logging***********************/

module.exports = config;
