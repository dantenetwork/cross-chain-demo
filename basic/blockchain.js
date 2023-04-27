const Web3 = require('web3');
const fs = require('fs');
const near = require('./near');
const ethereum = require('./ethereum');
const utils = require('./utils');
const config = require('config');

// Test account
let testAccount = config.get('signer');

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

function loadContract(chainName, key) {
  let cfg = config.get('networks.' + chainName);
  if (!cfg) {
    console.log('Configuration not found for ', chainName);
    return;
  }

  const web3 = new Web3(cfg.nodeAddress);
  web3.eth.handleRevert = true;
  let contract;
  if (key == 'GREETING') {
    let greetingRawData = fs.readFileSync('./res/Greetings.json');
    let greetingAbi = JSON.parse(greetingRawData).abi;
    contract = new web3.eth.Contract(greetingAbi, cfg.greetingContractAddress);
  }
  else if (key == 'COMPUTING') {
    let ocComputeRawData = fs.readFileSync('./res/OCComputing.json');
    let ocComputeAbi = JSON.parse(ocComputeRawData).abi;
    contract = new web3.eth.Contract(ocComputeAbi, cfg.computingContractAddress);
  }
  else if (key == 'CROSSCHAIN') {
    let crossChainRawData = fs.readFileSync('./res/ICrossChain.json');
    let crossChainAbi = JSON.parse(crossChainRawData).abi;
    contract = new web3.eth.Contract(crossChainAbi, cfg.crossChainContractAddress);
  }

  return [web3, contract, cfg];
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
    let contract = loadContract(fromChain, 'GREETING');
    await ethereum.sendTransaction(fromChain, contract[0], contract[2].chainId, contract[1], 'sendGreeting', testAccount, [toChain, [fromChain, 'Greetings', 'Greeting from ' + fromChain, getCurrentDate()]]);
    await utils.sleep(5);
    let crossChainContract = loadContract(fromChain, 'CROSSCHAIN');
    let id = await ethereum.contractCall(crossChainContract[1], 'getSentMessageNumber', [toChain]);
    console.log('id', id);
    return id;
  },

  async sendOCTaskFromEthereum(fromChain, toChain, nums) {
    let contract = loadContract(fromChain, 'COMPUTING');
    await ethereum.sendTransaction(fromChain, contract[0], contract[2].chainId, contract[1], 'sendComputeTask', testAccount, [toChain, nums]);
    await utils.sleep(5);
    let messages = await ethereum.contractCall(contract[1], 'getResults', [toChain]);
    return messages[messages.length - 1].session;
  },
  
  async queryMessageFromEthereum(chainName, fromChain, id) {
    let contract = loadContract(chainName, 'GREETING');
    const message = await ethereum.contractCall(contract[1], 'getGreetings', [fromChain]);
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
    let contract = loadContract(chainName, 'COMPUTING');
    const message = await ethereum.contractCall(contract[1], 'getResults', [toChain]);
    let ret = null;
    for (let i = 0; i < message.length; i++) {
      if (message[i].session == id) {
        ret = message[i];
      }
    }
    return ret;
  },
}