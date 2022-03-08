const Web3 = require('web3');
const fs = require('fs');
const avalanche = require('./avalanche');

const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');

// test account
let testAccountPrivateKey = fs.readFileSync('.secret');
testAccountPrivateKey = JSON.parse(testAccountPrivateKey).key;

const avalancheGreetingContractAddress = '0xD9F804a8B2c00fAF2ccB175dE84516A7Aa010A9E';
const platonGreetingContractAddress = '0xD566cf8Fb4C049d5b923f677807cBadaA916BD06';
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
  // set cross chain contract
  await avalanche.sendTransaction(greetingContract, 'setCrossChainContract', testAccountPrivateKey, [crossChainContractAddress]);
  // register target
  await avalanche.sendTransaction(greetingContract, 'registerTarget', testAccountPrivateKey, ['receiveGreeting', 'string,string,string,string', 'fromChain,title,content,date', '']);
  // register interface
  await avalanche.sendTransaction(greetingContract, 'registerInterface', testAccountPrivateKey, ['receiveGreeting', '{"inputs":[{"name":"fromChain","type":"string"},{"name":"title","type":"string"},{"name":"content","type":"string"},{"name":"date","type":"string"}],"name":"receiveGreeting","type":"function"}']);
  // register method
  await avalanche.sendTransaction(greetingContract, 'registerDestinationMethod', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveGreeting']);

}

(async function () {
  await init();
}())
