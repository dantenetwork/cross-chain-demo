const Web3 = require('web3');
const fs = require('fs');
const avalanche = require('./avalanche');

const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');

// test account
let testAccountPrivateKey = fs.readFileSync('.secret');
testAccountPrivateKey = JSON.parse(testAccountPrivateKey).key;

const avalancheGreetingContractAddress = '0x49766f787b1E184c5EeAEA36d1eC090Cf25BD72e';
const platonGreetingContractAddress = '0x9b50fA3A1f4C5efbbCCceCC906b153aeFFe98cAF';
const crossChainContractAddress = '0x27ED6b8E928Fb7d393EBE4C1ddBc353424a5F3ae';

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
  await avalanche.sendTransaction(greetingContract, 'registerSourceSender', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveGreeting']);
  await avalanche.sendTransaction(greetingContract, 'registerSourceSender', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeResult']);
  await avalanche.sendTransaction(greetingContract, 'registerSourceSender', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeTask']);
  // set cross chain contract
  await avalanche.sendTransaction(greetingContract, 'setCrossChainContract', testAccountPrivateKey, [crossChainContractAddress]);
  // register target
  await avalanche.sendTransaction(greetingContract, 'registerTarget', testAccountPrivateKey, ['receiveGreeting', 'string,string,string,string', 'fromChain,title,content,date', '']);
  await avalanche.sendTransaction(greetingContract, 'registerTarget', testAccountPrivateKey, ['receiveComputeResult', 'uint256', 'result', '']);
  await avalanche.sendTransaction(greetingContract, 'registerTarget', testAccountPrivateKey, ['receiveComputeTask', 'uint256[]', 'nums', '']);
  // register interface
  await avalanche.sendTransaction(greetingContract, 'registerInterface', testAccountPrivateKey, ['receiveGreeting', '{"inputs":[{"name":"fromChain","type":"string"},{"name":"title","type":"string"},{"name":"content","type":"string"},{"name":"date","type":"string"}],"name":"receiveGreeting","type":"function"}']);
  await avalanche.sendTransaction(greetingContract, 'registerInterface', testAccountPrivateKey, ['receiveComputeResult', '{"inputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"name":"receiveComputeResult","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  await avalanche.sendTransaction(greetingContract, 'registerInterface', testAccountPrivateKey, ['receiveComputeTask', '{"inputs":[{"internalType":"uint256[]","name":"nums","type":"uint256[]"}],"name":"receiveComputeTask","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  // register method
  await avalanche.sendTransaction(greetingContract, 'registerDestinationMethod', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveGreeting', 'receiveGreeting']);
  await avalanche.sendTransaction(greetingContract, 'registerDestinationMethod', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeResult', 'receiveComputeResult']);
  await avalanche.sendTransaction(greetingContract, 'registerDestinationMethod', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeTask', 'receiveComputeTask']);

}

(async function () {
  await init();
}())
