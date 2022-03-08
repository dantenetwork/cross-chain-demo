const Web3 = require('web3');
const web3 = new Web3('http://35.247.155.162:6789');
web3.eth.handleRevert = true;

const chainId = 210309;

module.exports = {
  // 通过私钥签名交易
  async sendTransaction(
    targetContract, methodName, accountPrivateKey, arguments) {
    try {
      const account =
        web3.eth.accounts.privateKeyToAccount(accountPrivateKey)
          .address;  // 私钥导出公钥
      const to = targetContract.options.address;
      const nonce = web3.utils.numberToHex(
        await web3.eth.getTransactionCount(account));  // 获取生成 nonce
      const data = targetContract.methods[methodName]
        .apply(targetContract.methods, arguments)
        .encodeABI();  // encode ABI
      const gas = web3.utils.numberToHex(
        parseInt((await web3.eth.getBlock('latest')).gasLimit - 1));
      let gasPrice = await web3.eth.getGasPrice();
      gasPrice = 50000000000;

      // 准备交易数据
      const tx = { account, to, chainId, data, nonce, gasPrice, gas };
      // console.log(tx);

      // 签名交易
      let signTx =
        await web3.eth.accounts.signTransaction(tx, accountPrivateKey);
      let ret = await web3.eth.sendSignedTransaction(signTx.rawTransaction);
      console.log('gasUsed: ' + methodName + ' ' + ret.gasUsed);
      return ret;
    } catch (e) {
      console.error(e);
    }
  },
  // query info from blockchain node
  async contractCall(targetContract, method, arguments) {
    let methodObj =
      targetContract.methods[method].apply(targetContract.methods, arguments);
    let ret = await methodObj.call({});
    return ret;
  }
}