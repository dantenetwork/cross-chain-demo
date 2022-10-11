const blockchain = require('./basic/blockchain.js');
const { program } = require('commander');

let fromChain = 'NEARTEST';
let toChain = 'PLATONEVM';

async function sendGreeting() {
  ///////////////////////////////////////////////
  ///////      NEAR To PLATON      ////////////
  ///////////////////////////////////////////////

  // send greeting to smart contract on PLATON
  let id = await blockchain.sendMessageFromNearToEthereum(toChain);

  // query greeting from smart contract on PLATON
  console.log('Wait for the message to be synchronized.', id);

  let interval = setInterval(async() => {
    const message = await blockchain.queryMessageFromEthereum(toChain, fromChain, id);
    if (message) {
      clearInterval(interval);
      console.log(message);
      return;
    }
  }, 5 * 1000);
};

async function sendOCTask(nums) {
  ///////////////////////////////////////////////
  ///////     NEAR To PLATON     ////////////
  ///////////////////////////////////////////////

  // send outsourcing computing task to smart contract from NEAR to PLATON
  let id = await blockchain.sendOCTaskFromNearToEthereum(toChain, nums);
  // query greeting from smart contract on NEAR
  console.log('Wait for the message to be synchronized.', id);

  var interval = setInterval(async() => {
    const message = await blockchain.queryOCResultFromNear(toChain, id);
    if (message.result) {
      clearInterval(interval);
      console.log(message);
      return;
    }
  }, 5 * 1000);
  
};

(async function() {
  function list(val) {
    let nums = val.split(',').map(function (val) {
      return parseInt(val);
    });
    return nums;
	}

  program
	  .version('0.1.0')
	  .option('-g, --greet', 'send greeting to PLATON')
	  .option('-c, --compute <num1, ..., numn>', 'send outsourcing computing task to PLATON', list)
	  .parse(process.argv);

  if (program.opts().greet) {
    await sendGreeting();
  }
  else if (program.opts().compute) {
    await sendOCTask(program.opts().compute);
  }
})();

async function sleep(seconds) {
  await new Promise((resolve) => {
      setTimeout(() => {
      resolve();
      }, seconds * 1000);
  });
}