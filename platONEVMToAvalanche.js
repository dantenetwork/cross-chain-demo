const blockchain = require('./blockchain.js');
const { program } = require('commander');

async function sendGreeting() {
  ///////////////////////////////////////////////
  ///////    Avalanche To PlatON     ////////////
  ///////////////////////////////////////////////

  // send greeting to smart contract on PlatON
  let id = await blockchain.sendMessageFromEthereum('PLATONEVMDEV', 'AVALANCHETEST');

  // query greeting from smart contract on PlatON
  console.log('Wait for the message to be synchronized.');

  setTimeout(async () => {
    const message = await blockchain.queryMessageFromEthereum('AVALANCHETEST', id);
    console.log(message);
  }, 60 * 1000);
}

async function sendOCTask(nums) {
  ///////////////////////////////////////////////
  ///////    Avalanche To PlatON     ////////////
  ///////////////////////////////////////////////

  // send outsourcing computing task to smart contract from Avalanche to PlatON
  let id = await blockchain.sendOCTaskFromEthereum('PLATONEVMDEV', 'AVALANCHETEST', nums);

  // query greeting from smart contract on Avalanche
  console.log('Wait for the message to be synchronized.', id);

  setTimeout(async () => {
    const message = await blockchain.queryOCResultFromEthereum('PLATONEVMDEV', id);
    console.log(message);
  }, 75 * 1000);
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