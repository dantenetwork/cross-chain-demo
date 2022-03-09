const Web3 = require('web3');
const fs = require('fs');
const platon = require('./platon');

const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');

// test account
let testAccountPrivateKey = fs.readFileSync('.secret');
testAccountPrivateKey = JSON.parse(testAccountPrivateKey).key;

const avalancheGreetingContractAddress = '0x49766f787b1E184c5EeAEA36d1eC090Cf25BD72e';
const platonGreetingContractAddress = '0x9b50fA3A1f4C5efbbCCceCC906b153aeFFe98cAF';
const crossChainContractAddress = '0xe4f1e3A42Ba0F04c1872Dd164DC8bc11392c044f';

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
  await platon.sendTransaction(greetingContract, 'registerSourceSender', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveGreeting']);
  await platon.sendTransaction(greetingContract, 'registerSourceSender', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeResult']);
  await platon.sendTransaction(greetingContract, 'registerSourceSender', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeTask']);
  // set cross chain contract
  await platon.sendTransaction(greetingContract, 'setCrossChainContract', testAccountPrivateKey, [crossChainContractAddress]);
  // register target
  await platon.sendTransaction(greetingContract, 'registerTarget', testAccountPrivateKey, ['receiveGreeting', 'string,string,string,string', 'fromChain,title,content,date', '']);
  await platon.sendTransaction(greetingContract, 'registerTarget', testAccountPrivateKey, ['receiveComputeResult', 'uint256', 'result', '']);
  await platon.sendTransaction(greetingContract, 'registerTarget', testAccountPrivateKey, ['receiveComputeTask', 'uint256[]', 'nums', '']);
  // register interface
  await platon.sendTransaction(greetingContract, 'registerInterface', testAccountPrivateKey, ['receiveGreeting', '{"inputs":[{"name":"fromChain","type":"string"},{"name":"title","type":"string"},{"name":"content","type":"string"},{"name":"date","type":"string"}],"name":"receiveGreeting","type":"function"}']);
  await platon.sendTransaction(greetingContract, 'registerInterface', testAccountPrivateKey, ['receiveComputeResult', '{"inputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"name":"receiveComputeResult","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  await platon.sendTransaction(greetingContract, 'registerInterface', testAccountPrivateKey, ['receiveComputeTask', '{"inputs":[{"internalType":"uint256[]","name":"nums","type":"uint256[]"}],"name":"receiveComputeTask","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  // register method
  await platon.sendTransaction(greetingContract, 'registerDestinationMethod', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveGreeting', 'receiveGreeting']);
  await platon.sendTransaction(greetingContract, 'registerDestinationMethod', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeResult', 'receiveComputeResult']);
  await platon.sendTransaction(greetingContract, 'registerDestinationMethod', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveComputeTask', 'receiveComputeTask']);
}

(async function () {
  await init();
}())