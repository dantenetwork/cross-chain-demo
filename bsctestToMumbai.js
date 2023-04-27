const blockchain = require('./basic/blockchain.js');
const { program } = require('commander');

let FROM_CHAIN = 'BSCTEST';
let TO_CHAIN = 'MUMBAI';

async function sendGreeting() {
  ///////////////////////////////////////////////
  ///////      FROM_CHAIN To TO_CHAIN      ////////////
  ///////////////////////////////////////////////

  // send greeting to smart contract
  let id = await blockchain.sendMessageFromEthereum(FROM_CHAIN, TO_CHAIN);

  // query greeting from smart contract
  console.log('Wait for the message to be synchronized.', id);

  let interval = setInterval(async() => {
    const message = await blockchain.queryMessageFromEthereum(TO_CHAIN, FROM_CHAIN, id);
    if (message) {
      clearInterval(interval);
      console.log(message);
      return;
    }
  }, 5 * 1000);
}

async function sendOCTask(nums) {
  ///////////////////////////////////////////////
  ///////      FROM_CHAIN To TO_CHAIN      ////////////
  ///////////////////////////////////////////////

  // send outsourcing computing task to smart contract from FROM_CHAIN to TO_CHAIN
  let id = await blockchain.sendOCTaskFromEthereum(FROM_CHAIN, TO_CHAIN, nums);
  // query greeting from smart contract on TO_CHAIN
  console.log('Wait for the message to be synchronized.', id);

  let interval = setInterval(async() => {
    const message = await blockchain.queryOCResultFromEthereum(FROM_CHAIN, TO_CHAIN, id);
    if (message.used) {
      clearInterval(interval);
      console.log(message);
      return;
    }
  }, 5 * 1000);
}

(async function() {
	function list(val) {
		return val.split(',')
	}

  program
	  .version('0.1.0')
	  .option('-g, --greet', 'send greeting from ' + FROM_CHAIN + ' to ' + TO_CHAIN)
	  .option('-c, --compute <num1, ..., numn>', 'send outsourcing computing task from ' + FROM_CHAIN + ' to ' + TO_CHAIN, list)
	  .parse(process.argv);

  if (program.opts().greet) {
    await sendGreeting();
  }
  else if (program.opts().compute) {
    await sendOCTask(program.opts().compute);
  }
})();