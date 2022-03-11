const Web3 = require('web3');
const fs = require('fs');
const platon = require('./platon');

const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');

// test account
let testAccountPrivateKey = fs.readFileSync('.secret');
testAccountPrivateKey = JSON.parse(testAccountPrivateKey).key;

const avalancheGreetingContractAddress = '0x7F2607b6Cd8471377CAAF9b73C20936FFbf458CD';
const platonGreetingContractAddress = '0x322C59efF021BcAd0c729Eacd02641aab0976a03';
const crossChainContractAddress = '0x472F57079e2d2AB82F7b011Adb90Bfa751062b28';

const greetingRawData = fs.readFileSync('./deploy/Greetings.json');
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
  await platon.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveGreeting']);
  await platon.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeResult']);
  await platon.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeTask']);
  // set cross chain contract
  await platon.sendTransaction(greetingContract, 'setCrossChainContract', testAccountPrivateKey, [crossChainContractAddress]);
  // register message abi
  await platon.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveGreeting', 'string,string,string,string', 'fromChain,title,content,date']);
  await platon.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeResult', 'uint256', 'result']);
  await platon.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeTask', 'uint256[]', 'nums']);
  // register contract abi
  await platon.sendTransaction(greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveGreeting', '{"inputs":[{"name":"fromChain","type":"string"},{"name":"title","type":"string"},{"name":"content","type":"string"},{"name":"date","type":"string"}],"name":"receiveGreeting","type":"function"}']);
  await platon.sendTransaction(greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveComputeResult', '{"inputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"name":"receiveComputeResult","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  await platon.sendTransaction(greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveComputeTask', '{"inputs":[{"internalType":"uint256[]","name":"nums","type":"uint256[]"}],"name":"receiveComputeTask","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  // register destination contract
  await platon.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveGreeting', 'AVALANCHE', avalancheGreetingContractAddress, 'receiveGreeting']);
  await platon.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveComputeResult', 'AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeResult']);
  await platon.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveComputeTask', 'AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeTask']);
}

(async function () {
  await init();
}())