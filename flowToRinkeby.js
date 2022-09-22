const blockchain = require('./basic/blockchain.js');
const { program } = require('commander');

let fromChain = 'FLOWTEST';
let toChain = 'RINKEBY';

async function queryGreetings(id) {
  let interval = setInterval(async() => {
    let message = await blockchain.queryMessageFromEthereum(toChain, fromChain, id);
    if (message) {
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
	  .option('-q, --query <ID>', 'get greeting message from RINKEBY')
	  .parse(process.argv);

  if (program.opts().query) {
    await queryGreetings(program.opts().query);
  }
})();