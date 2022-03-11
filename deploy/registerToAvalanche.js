const Web3 = require('web3');
const fs = require('fs');
const avalanche = require('./avalanche');

const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');

// test account
let testAccountPrivateKey = fs.readFileSync('.secret');
testAccountPrivateKey = JSON.parse(testAccountPrivateKey).key;

const avalancheGreetingContractAddress = '0x7F2607b6Cd8471377CAAF9b73C20936FFbf458CD';
const platonGreetingContractAddress = '0x322C59efF021BcAd0c729Eacd02641aab0976a03';
const crossChainContractAddress = '0xe0d1951E527190C446821DeA9ce774a3Bc7E443A';

const greetingRawData = fs.readFileSync('./deploy/Greetings.json');
const greetingAbi = JSON.parse(greetingRawData).abi;
const greetingContract = new web3.eth.Contract(greetingAbi, avalancheGreetingContractAddress);

const crossChainRawData = fs.readFileSync('./deploy/TwoPhaseCommitCrossChain.json');
const crossChainAbi = JSON.parse(crossChainRawData).abi;
const crossChainContract = new web3.eth.Contract(crossChainAbi, crossChainContractAddress);

async function init() {
  // await avalanche.sendTransaction(crossChainContract, 'clearCrossChainMessage', testAccountPrivateKey, ['PlatONEVMDEV']);

  // register porters
  await avalanche.sendTransaction(crossChainContract, 'changePortersAndRequirement', testAccountPrivateKey, [['0x30ad2981E83615001fe698b6fBa1bbCb52C19Dfa'], 1]);

  // register verify
  await avalanche.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveGreeting']);
  await avalanche.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeResult']);
  await avalanche.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeTask']);
  // set cross chain contract
  await avalanche.sendTransaction(greetingContract, 'setCrossChainContract', testAccountPrivateKey, [crossChainContractAddress]);
  // register message abi
  await avalanche.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveGreeting', 'string,string,string,string', 'fromChain,title,content,date']);
  await avalanche.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeResult', 'uint256', 'result']);
  await avalanche.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeTask', 'uint256[]', 'nums']);
  // register contract abi
  await avalanche.sendTransaction(greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveGreeting', '{"inputs":[{"name":"fromChain","type":"string"},{"name":"title","type":"string"},{"name":"content","type":"string"},{"name":"date","type":"string"}],"name":"receiveGreeting","type":"function"}']);
  await avalanche.sendTransaction(greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveComputeResult', '{"inputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"name":"receiveComputeResult","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  await avalanche.sendTransaction(greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveComputeTask', '{"inputs":[{"internalType":"uint256[]","name":"nums","type":"uint256[]"}],"name":"receiveComputeTask","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  // register destination contract
  await avalanche.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveGreeting', 'PlatONEVMDEV', platonGreetingContractAddress, 'receiveGreeting']);
  await avalanche.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveComputeResult', 'PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeResult']);
  await avalanche.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveComputeTask', 'PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeTask']);

}

(async function () {
  await init();
}())
