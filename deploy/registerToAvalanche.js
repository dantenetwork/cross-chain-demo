const Web3 = require('web3');
const fs = require('fs');
const avalanche = require('./avalanche');

const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');

// test account
let testAccountPrivateKey = fs.readFileSync('.secret');
testAccountPrivateKey = JSON.parse(testAccountPrivateKey).key;

const avalancheGreetingContractAddress = '0xE08e58eC8d78Bf4e68Eea4131F4a305002926EC3';
const platonGreetingContractAddress = '0xF31562eF36Ffa449CEbdD1eC97c94aFa9D2C6862';
const nearGreetingContractAddress = 'greeting.datlocker.testnet';
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
  // await avalanche.sendTransaction(crossChainContract, 'changePortersAndRequirement', testAccountPrivateKey, [['0x30ad2981E83615001fe698b6fBa1bbCb52C19Dfa'], 1]);

  // // register verify
  // await avalanche.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveGreeting']);
  // await avalanche.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeResult']);
  // await avalanche.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeTask']);
  // await avalanche.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['NEAR', nearGreetingContractAddress, 'receiveGreeting']);
  // await avalanche.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['NEAR', nearGreetingContractAddress, 'receiveComputeResult']);
  // await avalanche.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['NEAR', 'sum.datlocker.testnet', 'receiveComputeTask']);
  // // set cross chain contract
  // await avalanche.sendTransaction(greetingContract, 'setCrossChainContract', testAccountPrivateKey, [crossChainContractAddress]);
  // // register message abi
  // await avalanche.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveGreeting', 'tuple(string,string,string,string)', 'greeting']);
  // await avalanche.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeResult', 'uint256', 'result']);
  // await avalanche.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeTask', 'uint256[]', 'nums']);
  // await avalanche.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['NEAR', nearGreetingContractAddress, 'receive_greeting', 'tuple(string,string,string,string)', 'greeting']);
  await avalanche.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['NEAR', 'sum.datlocker.testnet', 'cross_chain_vc_sum_callback', 'uint256', 'result']);
  // // register contract abi
  // await avalanche.sendTransaction(greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveGreeting', '{"inputs":[{"components":[{"internalType":"string","name":"fromChain","type":"string"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"content","type":"string"},{"internalType":"string","name":"date","type":"string"}],"internalType":"struct Greeting","name":"greeting","type":"tuple"}],"name":"receiveGreeting","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  // await avalanche.sendTransaction(greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveComputeResult', '{"inputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"name":"receiveComputeResult","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  // await avalanche.sendTransaction(greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveComputeTask', '{"inputs":[{"internalType":"uint256[]","name":"nums","type":"uint256[]"}],"name":"receiveComputeTask","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  // // register destination contract
  // await avalanche.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveGreeting', 'PlatONEVMDEV', platonGreetingContractAddress, 'receiveGreeting']);
  // await avalanche.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveComputeResult', 'PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeResult']);
  // await avalanche.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveComputeTask', 'PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeTask']);
  // await avalanche.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveGreeting', 'NEAR', nearGreetingContractAddress, 'receive_greeting']);
  await avalanche.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveComputeResult', 'NEAR', 'sum.datlocker.testnet', 'cross_chain_vc_sum_callback']);

}

(async function () {
  await init();
}())
