const Web3 = require('web3');
const fs = require('fs');
const avalanche = require('./avalanche');

const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');

// test account
let testAccountPrivateKey = fs.readFileSync('.secret');
testAccountPrivateKey = JSON.parse(testAccountPrivateKey).key;

const avalancheGreetingContractAddress = '0x2B8fa110bbe8a6A3E3bd65DDFa21666237589BeD';
const platonGreetingContractAddress = '0x10022eADCE4569F15236E4182486b6AEc4174E09';
const crossChainContractAddress = '0xD00977274897FfC1D2c5c8A3aEA2e55Fd4863E41';

const greetingRawData = fs.readFileSync('./deploy/GreetingAdvanced.json');
const greetingAbi = JSON.parse(greetingRawData).abi;
const greetingContract = new web3.eth.Contract(greetingAbi, avalancheGreetingContractAddress);

const crossChainRawData = fs.readFileSync('./deploy/TwoPhaseCommitCrossChain.json');
const crossChainAbi = JSON.parse(crossChainRawData).abi;
const crossChainContract = new web3.eth.Contract(crossChainAbi, crossChainContractAddress);

async function init() {
  // await avalanche.sendTransaction(crossChainContract, 'clearCrossChainMessage', testAccountPrivateKey, ['PlatONEVMDEV']);

  // register porters
  await avalanche.sendTransaction(crossChainContract, 'changePortersAndRequirement', testAccountPrivateKey, [['0x30ad2981E83615001fe698b6fBa1bbCb52C19Dfa'], 1]);

  // register callback abi
  await avalanche.sendTransaction(greetingContract, 'registerCallbackAbi', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeTask', '{"inputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"name":"receiveComputeResult","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  // register verify
  await avalanche.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeTask']);
  await avalanche.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeResult']);
  // set cross chain contract
  await avalanche.sendTransaction(greetingContract, 'setCrossChainContract', testAccountPrivateKey, [crossChainContractAddress]);
  // register message abi
  await avalanche.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeTask', 'uint256[]', 'nums']);
  await avalanche.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, ['PlatONEVMDEV', platonGreetingContractAddress, 'callback', 'uint256', 'result']);
  // register contract abi
  await avalanche.sendTransaction(greetingContract, 'registerContractABI', testAccountPrivateKey, ['receiveComputeTask', '{"inputs":[{"internalType":"uint256[]","name":"nums","type":"uint256[]"}],"name":"receiveComputeTask","outputs":[],"stateMutability":"nonpayable","type":"function"}']);
  // register destination contract
  await avalanche.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveComputeTask', 'PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeTask']);
  await avalanche.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, ['receiveComputeResult', 'PlatONEVMDEV', platonGreetingContractAddress, 'receiveComputeResult']);

}

(async function () {
  await init();
}())
