const Web3 = require('web3');
const fs = require('fs');
const platon = require('./platon');

const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');

// test account
let testAccountPrivateKey = fs.readFileSync('.secret');
testAccountPrivateKey = JSON.parse(testAccountPrivateKey).key;

const avalancheGreetingContractAddress = '0xD9F804a8B2c00fAF2ccB175dE84516A7Aa010A9E';
const platonGreetingContractAddress = '0xD566cf8Fb4C049d5b923f677807cBadaA916BD06';
const crossChainContractAddress = '0xe4f1e3A42Ba0F04c1872Dd164DC8bc11392c044f';

const greetingRawData = fs.readFileSync('./deploy/Greetings.json');
const greetingAbi = JSON.parse(greetingRawData).abi;
const greetingContract = new web3.eth.Contract(greetingAbi, platonGreetingContractAddress);

const crossChainRawData = fs.readFileSync('./deploy/TwoPhaseCommitCrossChain.json');
const crossChainAbi = JSON.parse(crossChainRawData).abi;
const crossChainContract = new web3.eth.Contract(crossChainAbi, crossChainContractAddress);

async function init() {

  // register porters
  await platon.sendTransaction(crossChainContract, 'changePortersAndRequirement', testAccountPrivateKey, [['0x30ad2981E83615001fe698b6fBa1bbCb52C19Dfa'], 1]);

  // register verify
  await platon.sendTransaction(greetingContract, 'registerSourceSender', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveGreeting']);
  // set cross chain contract
  await platon.sendTransaction(greetingContract, 'setCrossChainContract', testAccountPrivateKey, [crossChainContractAddress]);
  // register target
  await platon.sendTransaction(greetingContract, 'registerTarget', testAccountPrivateKey, ['receiveGreeting', 'string,string,string,string', 'fromChain,title,content,date', '']);
  // register interface
  await platon.sendTransaction(greetingContract, 'registerInterface', testAccountPrivateKey, ['receiveGreeting', '{"inputs":[{"name":"fromChain","type":"string"},{"name":"title","type":"string"},{"name":"content","type":"string"},{"name":"date","type":"string"}],"name":"receiveGreeting","type":"function"}']);
  // register method
  await platon.sendTransaction(greetingContract, 'registerDestinationMethod', testAccountPrivateKey, ['AVALANCHE', avalancheGreetingContractAddress, 'receiveGreeting']);
}

(async function () {
  await init();
}())