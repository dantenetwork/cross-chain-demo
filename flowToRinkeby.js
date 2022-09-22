const blockchain = require('./basic/blockchain.js');
const { program } = require('commander');

let fromChain = 'FLOWTEST';
let toChain = 'RINKEBY';

async function queryGreetings() {
  let message = await blockchain.queryMessageFromEthereum(toChain, fromChain);
  console.log(message);
}

(async function() {
	function list(val) {
		return val.split(',')
	}

  program
	  .version('0.1.0')
	  .option('-q, --query', 'get greeting message from RINKEBY')
	  .parse(process.argv);

  if (program.opts().query) {
    await queryGreetings(program.opts().query);
  }
})();