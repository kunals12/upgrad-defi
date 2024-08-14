'use strict';
// import Common from 'ethereumjs-common';
// const {Common} = require("ethereumjs-common")
const config = require("../../config/config")
const bigNumber = require('bignumber.js')
const fs = require('fs')
const ethereumUtil = require("../util")
const userException = require('../../tools/userException')
const ErrorMessage = require("../../constants/errors").ErrorMessage
const Tx = require('ethereumjs-tx')
const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain.url))

// const customCommon = Common.forCustomChain(
//     'testnet',
//     {
//         name: 'Sepolia test network',
//         networkId: "https://sepolia.infura.io/v3/",
//         chainId: 11155111,
//     }
// );


async function upgradToken(){

    // Reference
    let contractObj
    let contractJSON
    let abi
    let address

    // Create Contract Object
    address = config.smartContract.upgradToken.address
    contractJSON = JSON.parse(fs.readFileSync(config.smartContract.upgradToken.buildPath));
    abi = contractJSON.abi;
    contractObj = new web3.eth.Contract(abi, address)

    return contractObj
}

async function balance(address) {

    // Contract Object
    let contract = await upgradToken()

    console.log("getting balance");
    // Get Balance
    let balance = await contract.methods.balanceOf(address).call()

    // Decimal
    let decimals = await contract.methods.decimals().call()
    balance = bigNumber(balance).div(10**decimals).toString()

    return balance

}

async function allowance(owner, spender) {

    // Contract Object
    let contract = await upgradToken()

    // Get Balance
    let balance = await contract.methods.allowance(owner, spender).call()

    // Decimal
    let decimals = await contract.methods.decimals().call()
    balance = bigNumber(balance).div(10**decimals).toString()

    return balance

}

async function rawValue(value) {

    // Contract Object
    let contract = await upgradToken()

    let decimals = await contract.methods.decimals().call()
    return parseInt(value * (10**decimals))

}

async function decimalBalance(value) {

    // Contract Object
    let contract = await upgradToken()

    let decimals = await contract.methods.decimals().call()
    return bigNumber(value).div(10**decimals).toString()

}

async function signTransaction(rawTxObject, privateKey) {
    
    // Sign Transaction
    let tx = new Tx(rawTxObject);
    console.log(privateKey);
    // let tx = new Tx(rawTxObject)
    // tx.sign(Buffer.from(privateKey, 'hex'))
    // let newPrivateKey = privateKey.substring(1 && 2); 
    // console.log("new",newPrivateKey);
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    // console.log(privateKey);
    console.log("buffer",privateKeyBuffer);
    tx.sign(privateKeyBuffer);
    // console.log(2);
    let serializedTx = tx.serialize()
    // console.log(2);
    return "0x" + serializedTx.toString('hex')
    
}

async function transfer(from, to, amount, privateKey) {

    try{

        // Contract Object
        let contract = await upgradToken()

        // TX Data
        amount = await rawValue(amount)
        amount = web3.utils.toHex(amount)

        let nonce = await web3.eth.getTransactionCount(from)
        nonce = web3.utils.toHex(nonce)

        let gasPrice = await ethereumUtil.getGasPrice()
        gasPrice = web3.utils.toHex(gasPrice)

        let gasLimit = web3.utils.toHex(config.smartContract.upgradToken.gasLimit)

        // Validate Transaction By Calling it first
        await contract.methods.transfer(to, amount)

        // Create Raw transaction
        let txData = contract.methods.transfer(to, amount).encodeABI()
        let rawTx = {
            gasLimit: gasLimit,
            data: txData,
            from: from,
            to: config.smartContract.upgradToken.address,
            nonce : nonce,
            gasPrice: gasPrice,
        }

        console.log("from", from);

        // Sign Transaction (Wallet)
        let signedTransaction = await signTransaction(rawTx, privateKey)
        console.log("signed txn",signedTransaction);
        // Return
        return await web3.eth.sendSignedTransaction(signedTransaction)

    } catch (error) {
        console.log(error)
        throw new userException(new ErrorMessage(error.data.stack, 500))
    }

}

async function approve(from, to, amount, privateKey) {

    try {
        // Contract Object
        let contract = await upgradToken()
        console.log("approving....");
        // TX Data
        amount = await rawValue(amount)
        amount = web3.utils.toHex(amount)

        let nonce = await web3.eth.getTransactionCount(from)
        nonce = web3.utils.toHex(nonce)

        let gasPrice = await ethereumUtil.getGasPrice()
        gasPrice = web3.utils.toHex(gasPrice)

        let gasLimit = web3.utils.toHex(config.smartContract.upgradToken.gasLimit)

        console.log("calling method");
        // Validate Transaction By Calling it first
        await contract.methods.approve(to, amount)
        // Create Raw transaction (Frontend)
        console.log(1);

        let txData = contract.methods.approve(to, amount).encodeABI()

        let rawTx = {
            gasLimit: gasLimit,
            data: txData,
            from: from,
            to: config.smartContract.upgradToken.address,
            nonce : nonce,
            gasPrice: gasPrice,
        }

        // Sign Transaction (Wallet)
        console.log(to);
        let signedTransaction = await signTransaction(rawTx, privateKey)
        console.log("sign txn", signedTransaction);
        const res = await web3.eth.sendSignedTransaction(signedTransaction)
        console.log(res);
        // Return
        return res;

    } catch (error) {
        console.log("err",error);
        throw new userException(new ErrorMessage(error.data.stack, 500))
    }

}

module.exports = {
    balance,
    allowance,
    transfer,
    approve,
    upgradToken: upgradToken,
    rawValue,
    decimalBalance
}
