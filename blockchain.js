const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const homedir = require("os").homedir();
const avalanche = require('./deploy/avalanche');
const platon = require('./deploy/platon');
const near = require('./deploy/near')

const avalancheWeb3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');
const platONWeb3 = new Web3('http://35.247.155.162:6789');
const ethereumWeb3 = new Web3('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');

// Test account
let testAccountPrivateKey = fs.readFileSync('.secret');
testAccountPrivateKey = JSON.parse(testAccountPrivateKey).key;
const publicKey = avalancheWeb3.eth.accounts.privateKeyToAccount(testAccountPrivateKey).address;
console.log('publicKey: ' + publicKey);

// Load smart contract abi
let greetingRawData = fs.readFileSync('./deploy/Greetings.json');
let greetingAbi = JSON.parse(greetingRawData).abi;

// Avalanche contract
let avalancheContractAddress = '0xE08e58eC8d78Bf4e68Eea4131F4a305002926EC3';
let avalancheContract = new avalancheWeb3.eth.Contract(greetingAbi, avalancheContractAddress);

let evmContracts = {};

// Ethereum contract
let ethereumContractAddress = '0xF0e63AC2F2D17171C1235615b45D1EC8f9e792C4';
let ethereumContract = new ethereumWeb3.eth.Contract(greetingAbi, ethereumContractAddress);

evmContracts['RINKEBY'] = ethereumContract;

// PlatON contract
let platonContractAddress = '0xF31562eF36Ffa449CEbdD1eC97c94aFa9D2C6862';
let platonContract = new platONWeb3.eth.Contract(greetingAbi, platonContractAddress);

// NEAR contract
let nearContractId = 'greeting.datlocker.testnet';
let nearSumContractId = "sum.datlocker.testnet";
let nearSender = "shanks.testnet";
let nearNetworkId = "testnet";
// const keyFilePath = path.resolve(
//   homedir,
//   `./.near-credentials/${nearNetworkId}/${nearSender}.json`
// );
// const keyFile = require(keyFilePath);
const SenderPrivateKey = "ed25519:2ujXoT1SktY2tspiAMimY5ZEji1MNdP1fRCUPqzrpdzkkQ7JkPVDg9nS5BV5Yefb2GgHqaE8anC1KfhGLJmmU3Af";

// Get current date
function getCurrentDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}

module.exports = {
  async sendMessageToAvalanche() {
    // Cross-chain message delivering from `PlatON` to `Avalanche`. Send greeting to smart contract of `Avalanche`. 
    await platon.sendTransaction(platonContract, 'sendGreeting', testAccountPrivateKey, ['AVALANCHE', ['PlatONEVMDEV', 'Greetings', 'Greeting from PlatON', getCurrentDate()]]);
  },
  
  async sendMessageFromNearToAvalance() {
    await near.sendTransaction(nearContractId, nearSender, SenderPrivateKey, "send_greeting", {to_chain: 'AVALANCHE', title: 'Greetings', content: 'Greeting from NEAR', date: getCurrentDate()})
  },

  async sendOCTaskFromNearToAvalanche(nums) {
    // Cross-chain call delivering from `PlatON` to `Avalanche`.
    await near.sendTransaction(nearSumContractId, nearSender, SenderPrivateKey, 'sum', {to_chain: 'AVALANCHE', params_vector: nums});
  },

  async sendMessageFromNearToEthereum(chainName) {
    await near.sendTransaction(nearContractId, nearSender, SenderPrivateKey, "send_greeting", {to_chain: chainName, title: 'Greetings', content: 'Greeting from NEAR', date: getCurrentDate()})
  },

  async sendOCTaskFromNearToEthereum(chainName, nums) {
    // Cross-chain call delivering from `PlatON` to `Avalanche`.
    await near.sendTransaction(nearSumContractId, nearSender, SenderPrivateKey, 'sum', {to_chain: chainName, params_vector: nums});
  },

  async sendMessageFromEthereumToNear(chainName) {
    // Cross-chain message delivering from `Avalanche` to `PlatON`. Send greeting to smart contract of `PlatON`
    await avalanche.sendTransaction(evmContracts[chainName], 'sendGreeting', testAccountPrivateKey, ['NEAR', [chainName, 'Greetings', 'Greeting from ' + chainName, getCurrentDate()]]);
  },

  async sendMessageToPlatON() {
    // Cross-chain message delivering from `Avalanche` to `PlatON`. Send greeting to smart contract of `PlatON`
    await avalanche.sendTransaction(avalancheContract, 'sendGreeting', testAccountPrivateKey, ['PlatONEVMDEV', ['AVALANCHE', 'Greetings', 'Greeting from Avalanche', getCurrentDate()]]);
  },

  async sendMessageFromAvalancheToNear() {
    // Cross-chain message delivering from `Avalanche` to `PlatON`. Send greeting to smart contract of `PlatON`
    await avalanche.sendTransaction(avalancheContract, 'sendGreeting', testAccountPrivateKey, ['NEAR', ['AVALANCHE', 'Greetings', 'Greeting from Avalanche', getCurrentDate()]]);
  },

  async sendOCTaskToAvalanche(nums) {
    // Cross-chain call delivering from `PlatON` to `Avalanche`.
    await platon.sendTransaction(platonContract, 'sendComputeTask', testAccountPrivateKey, ['AVALANCHE', nums]);
  },

  async sendOCTaskToPlatON(nums) {
    // Cross-chain call delivering from `Avalanche` to `PlatON`.
    await avalanche.sendTransaction(avalancheContract, 'sendComputeTask', testAccountPrivateKey, ['PlatONEVMDEV', nums]);
  },
  async queryOCResultFromAvalanche() {
    const message = await avalanche.contractCall(avalancheContract, 'ocResult', []);
    return message;
  },
  async queryOCResultFromPlatON() {
    const message = await platon.contractCall(platonContract, 'ocResult', []);
    return message;
  },
  async queryMessageFromAvalanche() {
    const message = await avalanche.contractCall(avalancheContract, 'getContext', []);
    return message;
  },
  async queryMessageFromPlatON() {
    const message = await platon.contractCall(platonContract, 'getContext', []);
    return message;
  }
}