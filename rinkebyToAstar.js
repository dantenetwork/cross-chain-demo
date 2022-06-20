const blockchain = require('./basic/blockchain.js');
const { program } = require('commander');

let fromChain = 'RINKEBY';
let toChain = 'ASTAR';

async function sendGreeting() {
  ///////////////////////////////////////////////
  ///////      RINKEBY To ASTAR      ////////////
  ///////////////////////////////////////////////

  // send greeting to smart contract
  await blockchain.sendMessageFromEthereum(fromChain, toChain);
}

(async function() {
	function list(val) {
		return val.split(',')
	}

  program
	  .version('0.1.0')
	  .option('-g, --greet', 'send greeting to PlatON')
	  .parse(process.argv);

  if (program.opts().greet) {
    await sendGreeting();
  }
})();