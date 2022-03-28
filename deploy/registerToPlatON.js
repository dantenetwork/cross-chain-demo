const Web3 = require('web3');
const fs = require('fs');
const platon = require('./platon');

const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');

// test account
let testAccountPrivateKey = fs.readFileSync('.secret');
testAccountPrivateKey = JSON.parse(testAccountPrivateKey).key;

const avalancheGreetingContractAddress = '0xf0219D5cA612e311317C2D7A9909D669349CC736';
const platonGreetingContractAddress = '0x4d9aE11dCf5378b2A14f6Ab3E6A225ED706A125E';
const crossChainContractAddress = '0xd7b1AEDf20505B09AB578D04e687eb64238EE0f1';

const greetingRawData = fs.readFileSync('./deploy/OCComputing.json');
const greetingAbi = JSON.parse(greetingRawData).abi;
const greetingContract = new web3.eth.Contract(greetingAbi, platonGreetingContractAddress);

const crossChainRawData = fs.readFileSync('./deploy/TwoPhaseCommitCrossChain.json');
const crossChainAbi = JSON.parse(crossChainRawData).abi;
const crossChainContract = new web3.eth.Contract(crossChainAbi, crossChainContractAddress);

async function init() {
  // await platon.sendTransaction(crossChainContract, 'clearCrossChainMessage', testAccountPrivateKey, ['AVALANCHE']);

  // // register porters
  // await platon.sendTransaction(crossChainContract, 'changePortersAndRequirement', testAccountPrivateKey, [['0x30ad2981E83615001fe698b6fBa1bbCb52C19Dfa'], 1]);

  // // register callback abi
  // await platon.sendTransaction(greetingContract, 'registerCallbackAbi', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeTask', '{"inputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"name":"receiveComputeResult","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  // // register verify
  // await platon.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeTask']);
  // await platon.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeResult']);
  // // set cross chain contract
  // await platon.sendTransaction(greetingContract, 'setCrossChainContract', testAccountPrivateKey, [crossChainContractAddress]);
  // // register message abi
  // await platon.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeTask', 'uint256[]', 'nums']);
  await platon.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeTaskCallback', 'uint256', 'result']);
  // // register contract abi
  // await platon.sendTransaction(greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveComputeTask', '{"inputs":[{"internalType":"uint256[]","name":"nums","type":"uint256[]"}],"name":"receiveComputeTask","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  // // register destination contract
  // await platon.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveComputeTask', 'AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeTask']);
  // await platon.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveComputeResult', 'AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeResult']);
}

(async function () {
  await init();
}())