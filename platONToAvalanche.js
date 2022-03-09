const blockchain = require('./blockchain.js');
const { program } = require('commander');

async function sendGreeting() {
  ///////////////////////////////////////////////
  ///////    PlatON To Avalanche     ////////////
  ///////////////////////////////////////////////

  // send greeting to smart contract on Avalanche
  await blockchain.sendMessageToAvalanche();

  // query greeting from smart contract on PlatON
  console.log('Wait for the message to be synchronized.');

  setTimeout(async () => {
    const message = await blockchain.queryMessageFromAvalanche();
    console.log(message);
  }, 10 * 1000);
};

async function sendOCTask(nums) {
  ///////////////////////////////////////////////
  ///////    PlatON To Avalanche     ////////////
  ///////////////////////////////////////////////

  // send outsourcing computing task to smart contract from PlatON to Avalanche
  await blockchain.sendOCTaskToAvalanche(nums);

  // query greeting from smart contract on PlatON
  console.log('Wait for the message to be synchronized.');

  setTimeout(async () => {
    const message = await blockchain.queryOCResultFromPlatON();
    console.log(message);
  }, 45 * 1000);
};

(async function() {
	function list(val) {
		return val.split(',')
	}

  program
	  .version('0.1.0')
	  .option('-g, --greet', 'send greeting to Avalanche')
	  .option('-c, --compute <num1, ..., numn>', 'send outsourcing computing task to Avalanche', list)
	  .parse(process.argv);

  if (program.opts().greet) {
    await sendGreeting();
  }
  else if (program.opts().compute) {
    await sendOCTask(program.opts().compute);
  }
})();