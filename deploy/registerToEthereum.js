const Web3 = require('web3');
const fs = require('fs');
const ethereum = require('./ethereum');

const web3 = new Web3('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
const CHAIN_ID = 4;

// test account
let testAccountPrivateKey = fs.readFileSync('.secret');
testAccountPrivateKey = JSON.parse(testAccountPrivateKey).key;

const ethereumGreetingContractAddress = '0xF0e63AC2F2D17171C1235615b45D1EC8f9e792C4';
const nearGreetingContractAddress = 'greeting.datlocker.testnet';
const crossChainContractAddress = '0x1ca32B2dc57CFEe209Eb50C7bFe946E7B1EeE74D';

const greetingRawData = fs.readFileSync('./deploy/Greetings.json');
const greetingAbi = JSON.parse(greetingRawData).abi;
const greetingContract = new web3.eth.Contract(greetingAbi, ethereumGreetingContractAddress);

const crossChainRawData = fs.readFileSync('./deploy/TwoPhaseCommitCrossChain.json');
const crossChainAbi = JSON.parse(crossChainRawData).abi;
const crossChainContract = new web3.eth.Contract(crossChainAbi, crossChainContractAddress);

async function init() {
  // await ethereum.sendTransaction(web3, CHAIN_ID, crossChainContract, 'clearCrossChainMessage', testAccountPrivateKey, ['NEAR']);

  // register porters
  // await ethereum.sendTransaction(web3, CHAIN_ID, crossChainContract, 'changePortersAndRequirement', testAccountPrivateKey, [['0x30ad2981E83615001fe698b6fBa1bbCb52C19Dfa'], 1]);

  // // register verify
  await ethereum.sendTransaction(web3, CHAIN_ID, greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['NEAR', nearGreetingContractAddress, 'receiveGreeting']);
  await ethereum.sendTransaction(web3, CHAIN_ID, greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['NEAR', nearGreetingContractAddress, 'receiveComputeResult']);
  await ethereum.sendTransaction(web3, CHAIN_ID, greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['NEAR', 'sum.datlocker.testnet', 'receiveComputeTask']);
  // // set cross chain contract
  await ethereum.sendTransaction(web3, CHAIN_ID, greetingContract, 'setCrossChainContract', testAccountPrivateKey, [crossChainContractAddress]);
  // // register message abi
  await ethereum.sendTransaction(web3, CHAIN_ID, greetingContract, 'registerMessageABI', testAccountPrivateKey, ['NEAR', nearGreetingContractAddress, 'receive_greeting', 'tuple(string,string,string,string)', 'greeting']);
  await ethereum.sendTransaction(web3, CHAIN_ID, greetingContract, 'registerMessageABI', testAccountPrivateKey, ['NEAR', 'sum.datlocker.testnet', 'cross_chain_vc_sum_callback', 'uint256', 'result']);
  // // register contract abi
  await ethereum.sendTransaction(web3, CHAIN_ID, greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveGreeting', '{"inputs":[{"components":[{"internalType":"string","name":"fromChain","type":"string"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"content","type":"string"},{"internalType":"string","name":"date","type":"string"}],"internalType":"struct Greeting","name":"greeting","type":"tuple"}],"name":"receiveGreeting","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  await ethereum.sendTransaction(web3, CHAIN_ID, greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveComputeResult', '{"inputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"name":"receiveComputeResult","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  await ethereum.sendTransaction(web3, CHAIN_ID, greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveComputeTask', '{"inputs":[{"internalType":"uint256[]","name":"nums","type":"uint256[]"}],"name":"receiveComputeTask","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  // // register destination contract
  await ethereum.sendTransaction(web3, CHAIN_ID, greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveGreeting', 'NEAR', nearGreetingContractAddress, 'receive_greeting']);
  await ethereum.sendTransaction(web3, CHAIN_ID, greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveComputeResult', 'NEAR', 'sum.datlocker.testnet', 'cross_chain_vc_sum_callback']);

}

(async function () {
  await init();
}())
