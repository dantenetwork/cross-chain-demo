const blockchain = require('./blockchain.js');
const { program } = require('commander');

async function sendGreeting() {
  ///////////////////////////////////////////////
  ///////    Avalanche To PlatON     ////////////
  ///////////////////////////////////////////////

  // send greeting to smart contract on PlatON
  await blockchain.sendMessageToPlatON();

  // query greeting from smart contract on PlatON
  console.log('Wait for the message to be synchronized.');

  setTimeout(async () => {
    const message = await blockchain.queryMessageFromPlatON();
    console.log(message);
  }, 30 * 1000);
}

async function sendOCTask(nums) {
  ///////////////////////////////////////////////
  ///////    Avalanche To PlatON     ////////////
  ///////////////////////////////////////////////

  // send outsourcing computing task to smart contract from Avalanche to PlatON
  await blockchain.sendOCTaskToPlatON(nums);

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
	  .option('-c, --compute <num1, ..., numn>', 'send outsourcing computing task to PlatON', list)
	  .parse(process.argv);

  if (program.opts().compute) {
    await sendOCTask(program.opts().compute);
  }
})();