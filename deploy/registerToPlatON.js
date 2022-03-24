const Web3 = require('web3');
const fs = require('fs');
const platon = require('./platon');

const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');

// test account
let testAccountPrivateKey = fs.readFileSync('.secret');
testAccountPrivateKey = JSON.parse(testAccountPrivateKey).key;

const avalancheGreetingContractAddress = '0x7CcE6d14cff9E658a6B1f14FC1Ee3C2AFAEdC190';
const platonGreetingContractAddress = '0xE2F890AAa5D5280862A50C04a90FbBa5daBE9226';
const crossChainContractAddress = '0xd7b1AEDf20505B09AB578D04e687eb64238EE0f1';

const greetingRawData = fs.readFileSync('./deploy/GreetingAdvanced.json');
const greetingAbi = JSON.parse(greetingRawData).abi;
const greetingContract = new web3.eth.Contract(greetingAbi, platonGreetingContractAddress);

const crossChainRawData = fs.readFileSync('./deploy/TwoPhaseCommitCrossChain.json');
const crossChainAbi = JSON.parse(crossChainRawData).abi;
const crossChainContract = new web3.eth.Contract(crossChainAbi, crossChainContractAddress);

async function init() {
  // await platon.sendTransaction(crossChainContract, 'clearCrossChainMessage', testAccountPrivateKey, ['AVALANCHE']);

  // register porters
  await platon.sendTransaction(crossChainContract, 'changePortersAndRequirement', testAccountPrivateKey, [['0x30ad2981E83615001fe698b6fBa1bbCb52C19Dfa'], 1]);

  // register verify
  await platon.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeTask']);
  await platon.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'crossChainCallback']);
  // set cross chain contract
  await platon.sendTransaction(greetingContract, 'setCrossChainContract', testAccountPrivateKey, [crossChainContractAddress]);
  // register message abi
  await platon.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeTask', 'uint256[]', 'nums']);
  // register contract abi
  await platon.sendTransaction(greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveComputeTask', '{"inputs":[{"internalType":"uint256[]","name":"nums","type":"uint256[]"}],"name":"receiveComputeTask","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  // register destination contract
  await platon.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveComputeTask', 'AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeTask']);
  await platon.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['crossChainCallback', 'AVALANCHE', avalancheGreetingContractAddress, 'crossChainCallback']);
}

(async function () {
  await init();
}())