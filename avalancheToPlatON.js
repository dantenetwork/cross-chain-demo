const blockchain = require('./blockchain.js');

(async function () {
  ///////////////////////////////////////////////
  ///////    Avalanche To PlatON     ////////////
  ///////////////////////////////////////////////

  // send greeting to smart contract on Avalanche
  await blockchain.sendMessageToAvalanche();

  // query greeting from smart contract on PlatON
  console.log('Wait for the message to be synchronized.');

  setTimeout(async () => {
    const message = await blockchain.queryMessageFromPlatON();
    console.log(message);
  }, 10 * 1000);
})();