const blockchain = require('./blockchain.js');

(async function () {
  ///////////////////////////////////////////////
  ///////    PlatON To Avalanche     ////////////
  ///////////////////////////////////////////////

  // send greeting to smart contract on Avalanche
  await blockchain.sendMessageToPlatON();

  // query greeting from smart contract on PlatON
  console.log('Wait for the message to be synchronized.');

  setTimeout(async () => {
    const message = await blockchain.queryMessageFromAvalanche();
    console.log(message);
  }, 10 * 1000);
})();