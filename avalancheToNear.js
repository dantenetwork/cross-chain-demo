const blockchain = require('./blockchain.js');
const { program } = require('commander');

const Web3 = require('web3');
const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');
const CHAIN_ID = 43113;

async function sendGreeting() {
  ///////////////////////////////////////////////
  ///////    Avalanche To PlatON     ////////////
  ///////////////////////////////////////////////

  // send greeting to smart contract on PlatON
  await blockchain.sendMessageFromEvmToNear(web3, CHAIN_ID);

  // query greeting from smart contract on NEAR
  console.log('Wait for the message to be synchronized.');

  setTimeout(async () => {
    const message = await blockchain.queryMessageFromNear("AVALANCHE");
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
    const message = await blockchain.queryOCResultFromNear();
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