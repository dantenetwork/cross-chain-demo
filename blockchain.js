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
let greetingRawData = fs.readFileSync('./deploy/Greetings.json');
let greetingAbi = JSON.parse(greetingRawData).abi;

// Avalanche contract
let avalancheContractAddress = '0x7F2607b6Cd8471377CAAF9b73C20936FFbf458CD';
let avalancheContract = new avalancheWeb3.eth.Contract(greetingAbi, avalancheContractAddress);

// PlatON contract
let platonContractAddress = '0x322C59efF021BcAd0c729Eacd02641aab0976a03';
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
    await platon.sendTransaction(platonContract, 'sendGreeting', testAccountPrivateKey, ['AVALANCHE', 'Greetings', 'Greeting from PlatON', getCurrentDate()]);
  },
  async sendMessageToPlatON() {
    // Cross-chain message delivering from `Avalanche` to `PlatON`. Send greeting to smart contract of `PlatON`
    await avalanche.sendTransaction(avalancheContract, 'sendGreeting', testAccountPrivateKey, ['PlatONEVMDEV', 'Greetings', 'Greeting from Avalanche', getCurrentDate()]);
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
    const message = await avalanche.contractCall(avalancheContract, 'getLastMessage', []);
    return message;
  },
  async queryMessageFromPlatON() {
    const message = await platon.contractCall(platonContract, 'getLastMessage', []);
    return message;
  }
}