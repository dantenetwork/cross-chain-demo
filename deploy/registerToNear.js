const { providers, utils, transactions } = require("near-api-js");
const fs = require('fs');
const path = require("path");
const homedir = require("os").homedir();

// const { sendTransaction } = require("./avalanche");
// const networkId = "testnet";
// const provider = new providers.JsonRpcProvider({
//   url: `https://rpc.${networkId}.near.org`,
// });
const near = require('./near');

const avalancheGreetingContractAddress = '0xE08e58eC8d78Bf4e68Eea4131F4a305002926EC3';
const platonGreetingContractAddress = '0xF31562eF36Ffa449CEbdD1eC97c94aFa9D2C6862';
const networkId = "testnet";
const greetingContractId = "greeting.datlocker.testnet";
const sumContractId = "sum.datlocker.testnet";
const greetingKeyFilePath = path.resolve(
  homedir,
  `./.near-credentials/${networkId}/${greetingContractId}.json`
);
const greetingKeyFile = require(greetingKeyFilePath);
const greetingPrivateKey = greetingKeyFile.private_key;

const sumKeyFilePath = path.resolve(
  homedir,
  `./.near-credentials/${networkId}/${sumContractId}.json`
);
const sumKeyFile = require(sumKeyFilePath);
const sumPrivateKey = sumKeyFile.private_key;

let crossContractId = "d-hub.testnet";

async function init() {
  // await avalanche.sendTransaction(crossChainContract, 'clearCrossChainMessage', testAccountPrivateKey, ['PlatONEVMDEV']);

  // register greeting to 
  // await near.sendTransaction(crossContractId, greetingContractId, greetingPrivateKey, "register", {});
  // chain_name: String,
  // locker_contract_account: String,
  // locker_action_name: String,
  
  // register PlatON greeting
  // await near.sendTransaction(greetingContractId, greetingContractId, greetingPrivateKey, "add_locker_info", {chain_name: "PlatON", locker_contract_account: platonGreetingContractAddress, locker_action_name: "receiveGreeting"});

    // register Avalanche greeting 
  await near.sendTransaction(greetingContractId, greetingContractId, greetingPrivateKey, "add_locker_info", { chain_name: "AVALANCHE", locker_contract_account: avalancheGreetingContractAddress, locker_action_name: "receiveGreeting" });

  await near.sendTransaction(sumContractId, sumContractId, sumPrivateKey, "add_locker_info", { chain_name: "AVALANCHE", locker_contract_account: avalancheGreetingContractAddress, locker_action_name: "receiveComputeTask" });
}

(async function () {
  await init();
  // await near.contractCall(crossContractId, "get_lockers", "");
}())