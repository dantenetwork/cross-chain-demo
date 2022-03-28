const Web3 = require('web3');
const fs = require('fs');
const avalanche = require('./deploy/avalanche');
const platon = require('./deploy/platon');

const avalancheWeb3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');
const platONWeb3 = new Web3('http://35.247.155.162:6789');

// Test account
let testAccountPrivateKey = fs.readFileSync('.secret');
testAccountPrivateKey = JSON.parse(testAccountPrivateKey).key;
const publicKey = avalancheWeb3.eth.accounts.privateKeyToAccount(testAccountPrivateKey).address;
console.log('publicKey: ' + publicKey);

// Load smart contract abi
let greetingRawData = fs.readFileSync('./deploy/OCComputing.json');
let greetingAbi = JSON.parse(greetingRawData).abi;

// Avalanche contract
let avalancheContractAddress = '0xf0219D5cA612e311317C2D7A9909D669349CC736';
let avalancheContract = new avalancheWeb3.eth.Contract(greetingAbi, avalancheContractAddress);

// PlatON contract
let platonContractAddress = '0x4d9aE11dCf5378b2A14f6Ab3E6A225ED706A125E';
let platonContract = new platONWeb3.eth.Contract(greetingAbi, platonContractAddress);

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
  async sendMessageToPlatON() {
    // Cross-chain message delivering from `Avalanche` to `PlatON`. Send greeting to smart contract of `PlatON`
    await avalanche.sendTransaction(avalancheContract, 'sendGreeting', testAccountPrivateKey, ['PlatONEVMDEV', ['AVALANCHE', 'Greetings', 'Greeting from Avalanche', getCurrentDate()]]);
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