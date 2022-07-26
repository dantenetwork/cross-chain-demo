const blockchain = require('./basic/blockchain.js');
const { program } = require('commander');

let fromChain = 'MOONBASEALPHA';
let toChain = 'NEARTEST';

async function sendGreeting() {
  ///////////////////////////////////////////////
  ///////      MOONBEAM To NEAR      ////////////
  ///////////////////////////////////////////////

  // send greeting to smart contract
  let id = await blockchain.sendMessageFromEthereum(fromChain, toChain);

  // query greeting from smart contract
  console.log('Wait for the message to be synchronized.', id);

  let interval = setInterval(async() => {
    const message = await blockchain.queryMessageFromNear(fromChain, parseInt(id));
    if (message) {
      clearInterval(interval);
      console.log(message);
      return;
    }
  }, 5 * 1000);
}

async function sendOCTask(nums) {
  ///////////////////////////////////////////////
  ///////      MOONBEAM To NEAR      ////////////
  ///////////////////////////////////////////////

  // send outsourcing computing task to smart contract from NEAR to MOONBEAM
  let id = await blockchain.sendOCTaskFromEthereum(fromChain, toChain, nums);
  // query greeting from smart contract on NEAR
  console.log('Wait for the message to be synchronized.', id);

  let interval = setInterval(async() => {
    const message = await blockchain.queryOCResultFromEthereum(fromChain, toChain, id);
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
	  .option('-g, --greet', 'send greeting to MOONBEAM')
	  .option('-c, --compute <num1, ..., numn>', 'send outsourcing computing task to MOONBEAM', list)
	  .parse(process.argv);

  if (program.opts().greet) {
    await sendGreeting();
  }
  else if (program.opts().compute) {
    await sendOCTask(program.opts().compute);
  }
})();