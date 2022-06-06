const blockchain = require('./blockchain.js');
const { program } = require('commander');
const fs = require('fs');

const Web3 = require('web3');
const web3 = new Web3('wss://devnetopenapi2.platon.network/ws');
const CHAIN_ID = 2203181;

// Load smart contract abi
let greetingRawData = fs.readFileSync('./deploy/Greetings.json');
let greetingAbi = JSON.parse(greetingRawData).abi;

// Greeting contract
let contractAddress = '0xdf8f763936aa996Ad1FAC4CcF0b0153952dB617b';
let contract = new web3.eth.Contract(greetingAbi, contractAddress);

async function sendGreeting() {
  ///////////////////////////////////////////////
  ///////    Avalanche To PlatON     ////////////
  ///////////////////////////////////////////////

  // send greeting to smart contract on PlatON
  await blockchain.sendMessageFromEvmToNear(web3, CHAIN_ID, contract, 'PLATON');

  // query greeting from smart contract on PlatON
  console.log('Wait for the message to be synchronized.');

  setTimeout(async () => {
    const message = await blockchain.queryMessageFromEvm(contract);
    console.log(message);
  }, 30 * 1000);
}

async function sendOCTask(nums) {
  ///////////////////////////////////////////////
  ///////    Avalanche To PlatON     ////////////
  ///////////////////////////////////////////////

  // send outsourcing computing task to smart contract from Avalanche to PlatON
  await blockchain.sendOCTaskToPlatON(web3, CHAIN_ID, nums);

  // query greeting from smart contract on Avalanche
  console.log('Wait for the message to be synchronized.');

  setTimeout(async () => {
    const message = await blockchain.queryOCResultFromAvalanche();
    console.log(message);
  }, 60 * 1000);
}

(async function() {
	function list(val) {
		return val.split(',')
	}

  program
	  .version('0.1.0')
	  .option('-g, --greet', 'send greeting to PlatON')
	  .option('-c, --compute <num1, ..., numn>', 'send outsourcing computing task to PlatON', list)
	  .parse(process.argv);

  if (program.opts().greet) {
    await sendGreeting();
  }
  else if (program.opts().compute) {
    await sendOCTask(program.opts().compute);
  }
})();