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
let avalancheContractAddress = '0xD9F804a8B2c00fAF2ccB175dE84516A7Aa010A9E';
let avalancheContract = new avalancheWeb3.eth.Contract(greetingAbi, avalancheContractAddress);

// PlatON contract
let platonContractAddress = '0xD566cf8Fb4C049d5b923f677807cBadaA916BD06';
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
    // Send greeting to smart contract of Avalanche
    await avalanche.sendTransaction(avalancheContract, 'sendGreeting', testAccountPrivateKey, ['PlatONEVMDEV', 'Greetings', 'Greeting from Avalanche', getCurrentDate()]);
  },
  async sendMessageToPlatON() {
    // Send greeting to smart contract of PlatON
    await platon.sendTransaction(platonContract, 'sendGreeting', testAccountPrivateKey, ['AVALANCHE', 'Greetings', 'Greeting from PlatON', getCurrentDate()]);
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