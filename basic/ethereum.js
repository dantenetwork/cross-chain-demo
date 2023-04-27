const { request } = require('./utils');
const config = require('config');
const keyServiceApi = config.get('keyService');

module.exports = {
  // Sign with private key
  async sendTransaction(
    chainName,
    provider,
    chainId,
    targetContract,
    methodName,
    account,
    arguments
  ) {
    try {
      const to = targetContract.options.address;
      const data = targetContract.methods[methodName]
        .apply(targetContract.methods, arguments)
        .encodeABI(); // encode ABI
      const rpc = provider.currentProvider.host;
      const body = { chainName, rpc, account, to, chainId, data };
      var result = await request(keyServiceApi, 'POST', body);
      if (result.code == 0) {
        let ret = await provider.eth.sendSignedTransaction(result.message);
        return ret;
      } else {
        throw Error(result.message);
      }
    } catch (e) {
      console.error(e);
    }
  },
  // query info from blockchain node
  async contractCall(targetContract, method, arguments) {
    let methodObj = targetContract.methods[method].apply(
      targetContract.methods,
      arguments
    );
    let ret = await methodObj.call({});
    return ret;
  },
};
