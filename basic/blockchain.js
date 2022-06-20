const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const homedir = require("os").homedir();
const near = require('./near');
const ethereum = require('./ethereum');
const utils = require('./utils');

const platONWeb3 = new Web3('http://35.247.155.162:6789');
const ethereumWeb3 = new Web3('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
const platONEvmWeb3 = new Web3('wss://devnetopenapi2.platon.network/ws');
platONEvmWeb3.eth.handleRevert = true;
const avalancheWeb3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');
const astarWeb3 = new Web3('wss://devnetopenapi2.platon.network/ws');

let evmGreetingContracts = {};
let evmComputeContracts = {};
let evmProviders = {};

evmProviders['RINKEBY'] = [ethereumWeb3, 4];
evmProviders['PLATONEVMDEV'] = [platONEvmWeb3, 2203181];
evmProviders['AVALANCHETEST'] = [avalancheWeb3, 43113];
// evmProviders['AVALANCHETEST'] = [avalancheWeb3, 43113];

// Test account
let testAccountPrivateKey = fs.readFileSync('.secret').toString();

// Load smart contract abi
let greetingRawData = fs.readFileSync('./res/Greetings.json');
let greetingAbi = JSON.parse(greetingRawData).abi;

let ocComputeRawData = fs.readFileSync('./res/OCComputing.json');
let ocComputeAbi = JSON.parse(ocComputeRawData).abi;

// Load advanced smart contract abi
let greetingRawDataAdvanced = fs.readFileSync('./res/GreetingsAdvanced.json');
let greetingAbiAdvanced = JSON.parse(greetingRawDataAdvanced).abi;

// Rinkeby contracts
let rinkebyGreetingContractAddress = '0x1F5f615336763f61c617a0D8254C7e7eaA9326A7';
let rinkebyGreetingContract = new platONWeb3.eth.Contract(greetingAbiAdvanced, rinkebyGreetingContractAddress);
evmGreetingContracts['PLATONEVMDEV'] = rinkebyGreetingContract;


// NEAR contract
let nearContractId = '9f9350eb575cae7aac7f85a8c62b08d94dcac70a84e3c765464ff87c669fa4e5';
let nearSumContractId = "a7d1736372266477e0d0295d34ae47622ba50d007031a009976348f954e681fe";
let nearSender = "shanks.testnet";
let nearNetworkId = "testnet";
// const keyFilePath = path.resolve(
//   homedir,
//   `./.near-credentials/${nearNetworkId}/${nearSender}.json`
// );
// const keyFile = require(keyFilePath);
const callGreetingPrivateKey = "ed25519:2ujXoT1SktY2tspiAMimY5ZEji1MNdP1fRCUPqzrpdzkkQ7JkPVDg9nS5BV5Yefb2GgHqaE8anC1KfhGLJmmU3Af";
const callSumPrivateKey = "ed25519:4RPNB4FkrqtEMAm6obq184R5dPrkjRqHBRNuzm1qM1qHMcaxNgbfMcuHyvSVx3HWjxF2hwkrqaGVKMVV5hYj1jV3";
// Get current date
function getCurrentDate() {
  var today = new Date();
  let ret = JSON.stringify(today);
  console.log('date', ret);
  return ret;
}

module.exports = {  
  async sendMessageFromNearToEthereum(chainName) {
    await near.sendTransaction(nearContractId, nearSender, callGreetingPrivateKey, "send_greeting", {to_chain: chainName, title: 'Greetings', content: 'Greeting from NEAR', date: getCurrentDate()})
  },

  async sendOCTaskFromNearToEthereum(chainName, nums) {
    // Cross-chain call delivering from `PlatON` to `Avalanche`.
    return await near.sendTransaction(nearSumContractId, nearSender, callSumPrivateKey, 'sum', {to_chain: chainName, params_vector: nums});
  },
  
  async queryMessageFromNear(chainName) {
    const message = await near.contractCall(nearContractId, "get_greeting", { "from_chain": chainName });
    return message;
  },
  
  async queryOCResultFromNear(id) {
    const message = await near.contractCall(nearSumContractId, 'get_compute_task', {id: id});
    return message;
  },

  async sendMessageFromEthereum(fromChain, toChain) {
    await ethereum.sendTransaction(evmProviders[fromChain][0], evmProviders[fromChain][1], evmGreetingContracts[fromChain], 'sendGreeting', testAccountPrivateKey, [toChain, [fromChain, 'Greetings', 'Greeting from ' + fromChain, getCurrentDate()]]);
  },

  async sendOCTaskFromEthereum(fromChain, toChain, nums) {
    await ethereum.sendTransaction(evmProviders[fromChain][0], evmProviders[fromChain][1], evmComputeContracts[fromChain], 'sendComputeTask', testAccountPrivateKey, [toChain, nums]);
    await utils.sleep(5);
    let id = await ethereum.contractCall(evmComputeContracts[fromChain], 'currentId', []);
    return id;
  },
  
  async queryMessageFromEthereum(chainName) {
    const message = await ethereum.contractCall(evmGreetingContracts[chainName], 'getContext', []);
    return message;
  },
  
  async queryOCResultFromEthereum(chainName, id) {
    const message = await ethereum.contractCall(evmComputeContracts[chainName], 'ocResult', [id]);
    return message;
  },
}