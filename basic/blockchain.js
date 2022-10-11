const Web3 = require('web3');
const fs = require('fs');
const near = require('./near');
const ethereum = require('./ethereum');
const utils = require('./utils');

const rinkebyWeb3 = new Web3('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
const moonbeamWeb3 = new Web3('https://moonbase-alpha.public.blastapi.io');
const fujiWeb3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');
const platonWeb3 = new Web3('https://openapi.platon.network/rpc');

let evmGreetingContracts = {};
let evmComputeContracts = {};
let evmCrossChainContracts = {};
let evmProviders = {};

evmProviders['RINKEBY'] = [rinkebyWeb3, 4];
evmProviders['MOONBASEALPHA'] = [moonbeamWeb3, 1287];
evmProviders['FUJI'] = [fujiWeb3, 43113];
evmProviders['PLATONEVM'] = [platonWeb3, 210425];

// Test account
let testAccount = '0x8408925fD39071270Ed1AcA5d618e1c79be08B27';

// Load smart contract abi
let greetingRawData = fs.readFileSync('./res/Greetings.json');
let greetingAbi = JSON.parse(greetingRawData).abi;

let ocComputeRawData = fs.readFileSync('./res/OCComputing.json');
let ocComputeAbi = JSON.parse(ocComputeRawData).abi;

let crossChainRawData = fs.readFileSync('./res/ICrossChain.json');
let crossChainAbi = JSON.parse(crossChainRawData).abi;

// Moonbeam contracts
let moonbeamGreetingContractAddress = '0x49bC1f09474993103ECa96d96f4C3f7000B5fB7b';
let moonbeamGreetingContract = new moonbeamWeb3.eth.Contract(greetingAbi, moonbeamGreetingContractAddress);
evmGreetingContracts['MOONBASEALPHA'] = moonbeamGreetingContract;

let moonbeamComputeContractAddress = '0x8c5d8Df81C670b5154fe27930C0289289e94a52f';
let moonbeamComputeContract = new moonbeamWeb3.eth.Contract(ocComputeAbi, moonbeamComputeContractAddress);
evmComputeContracts['MOONBASEALPHA'] = moonbeamComputeContract;

// Fuji contracts
let fujiGreetingContractAddress = '0x1723f39e05Ca8b14ACaf244bAFFBd79801d42A63';
let fujiGreetingContract = new fujiWeb3.eth.Contract(greetingAbi, fujiGreetingContractAddress);
evmGreetingContracts['FUJI'] = fujiGreetingContract;

let fujiComputeContractAddress = '0x7F5b6F5F7a786F63383E8681Da7ACCEed76Ab209';
let fujiComputeContract = new fujiWeb3.eth.Contract(ocComputeAbi, fujiComputeContractAddress);
evmComputeContracts['FUJI'] = fujiComputeContract;

// Rinkeby contracts
let rinkebyGreetingContractAddress = '0x71375852616ef7196B07bA3f16805B512e21813E';
let rinkebyGreetingContract = new rinkebyWeb3.eth.Contract(greetingAbi, rinkebyGreetingContractAddress);
evmGreetingContracts['RINKEBY'] = rinkebyGreetingContract;

let rinkebyComputeContractAddress = '0x6Aa89C654907445a35Da1109C5fD7A75F1546Ef6';
let rinkebyComputeContract = new rinkebyWeb3.eth.Contract(ocComputeAbi, rinkebyComputeContractAddress);
evmComputeContracts['RINKEBY'] = rinkebyComputeContract;

let rinkebyCrossChainContractAddress = '0x2999fe13d3CAa63C0bC523E8D5b19A265637dbd2';
let rinkebyCrossChainContract = new platonWeb3.eth.Contract(crossChainAbi, rinkebyCrossChainContractAddress);
evmCrossChainContracts['RINKEBY'] = rinkebyCrossChainContract;

// PlatON contracts
let platonGreetingContractAddress = '0xbd2c1e271A60281AAeD8F42A91613fbD3ae18B65';
let platonGreetingContract = new platonWeb3.eth.Contract(greetingAbi, platonGreetingContractAddress);
evmGreetingContracts['PLATONEVM'] = platonGreetingContract;

let platonComputeContractAddress = '0xD756Dcfc5F37D545496DbE12256b290e49B8Bfe3';
let platonComputeContract = new platonWeb3.eth.Contract(ocComputeAbi, platonComputeContractAddress);
evmComputeContracts['PLATONEVM'] = platonComputeContract;

let platonCrossChainContractAddress = '0xf61C4699B99d1988EB235AF06F270029D9Ed3b63';
let platonCrossChainContract = new platonWeb3.eth.Contract(crossChainAbi, platonCrossChainContractAddress);
evmCrossChainContracts['PLATONEVM'] = platonCrossChainContract;

// NEAR contract
let nearContractId = 'd8ae7a513eeaa36a4c6a42127587dbf0f2adbbda06523c0fba4a16bd275089f9';
let nearSumContractId = "4dc61b77ef1336cb0887b4a3f14447f2493cbd29ee4bb44cb70372e6fd3142c6";
let nearSender = "shanks.testnet";
let nearNetworkId = "testnet";
// const keyFilePath = path.resolve(
//   homedir,
//   `./.near-credentials/${nearNetworkId}/${nearSender}.json`
// );
// const keyFile = require(keyFilePath);
const callGreetingPrivateKey = "ed25519:2ujXoT1SktY2tspiAMimY5ZEji1MNdP1fRCUPqzrpdzkkQ7JkPVDg9nS5BV5Yefb2GgHqaE8anC1KfhGLJmmU3Af";
const callSumPrivateKey = "ed25519:4RPNB4FkrqtEMAm6obq184R5dPrkjRqHBRNuzm1qM1qHMcaxNgbfMcuHyvSVx3HWjxF2hwkrqaGVKMVV5hYj1jV3";
// Get current date
function getCurrentDate() {
  var today = new Date();
  let ret = JSON.stringify(today);
  console.log('date', ret);
  return ret;
}

module.exports = {  
  async sendMessageFromNearToEthereum(chainName) {
    return near.sendTransaction(nearContractId, nearSender, callGreetingPrivateKey, "send_greeting", {to_chain: chainName, title: 'Greetings', content: 'Greeting from NEAR', date: getCurrentDate()})
  },

  async sendOCTaskFromNearToEthereum(chainName, nums) {
    return near.sendTransaction(nearSumContractId, nearSender, callSumPrivateKey, 'send_compute_task', {to_chain: chainName, nums: nums});
  },
  
  async queryMessageFromNear(chainName, id) {
    const message = await near.contractCall(nearContractId, "get_greeting", { "from_chain": chainName, "id": id });
    return message;
  },
  
  async queryOCResultFromNear(chainName, id) {
    const message = await near.contractCall(nearSumContractId, 'get_compute_task', {to_chain: chainName, id: id});
    return message;
  },

  async sendMessageFromEthereum(fromChain, toChain) {
    await ethereum.sendTransaction(fromChain, evmProviders[fromChain][0], evmProviders[fromChain][1], evmGreetingContracts[fromChain], 'sendGreeting', testAccount, [toChain, [fromChain, 'Greetings', 'Greeting from ' + fromChain, getCurrentDate()]]);
    await utils.sleep(5);
    let id = await ethereum.contractCall(evmCrossChainContracts[fromChain], 'getSentMessageNumber', [toChain]);
    console.log('id', id);
    return id;
  },

  async sendOCTaskFromEthereum(fromChain, toChain, nums) {
    await ethereum.sendTransaction(fromChain, evmProviders[fromChain][0], evmProviders[fromChain][1], evmComputeContracts[fromChain], 'sendComputeTask', testAccount, [toChain, nums]);
    await utils.sleep(5);
    let messages = await ethereum.contractCall(evmComputeContracts[fromChain], 'getResults', [toChain]);
    return messages[messages.length - 1].session;
  },
  
  async queryMessageFromEthereum(chainName, fromChain, id) {
    const message = await ethereum.contractCall(evmGreetingContracts[chainName], 'getGreetings', [fromChain]);
    if (id == null) {
      return message;
    }
    let ret = null;
    for (let i = 0; i < message.length; i++) {
      if (message[i].session == id) {
        ret = message[i];
      }
    }
    return ret;
  },
  
  async queryOCResultFromEthereum(chainName, toChain, id) {
    const message = await ethereum.contractCall(evmComputeContracts[chainName], 'getResults', [toChain]);
    let ret = null;
    for (let i = 0; i < message.length; i++) {
      if (message[i].session == id) {
        ret = message[i];
      }
    }
    return ret;
  },
}