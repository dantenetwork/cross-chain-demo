# cross-chain-demo

This is a `greeting` smart contract based on DANTE from Avalanche to PlatON.

### Work flow

* User A sends a greeting message to the smart contract of Avalanche.
* Greeting contract call cross-chain contract of DANTE.
* DANTE cross-chain service sync message from Avalanche to PlatON.
* User A query greeting message on PlatON.


### Install
```
npm install -d
```

### Test script

Send greeting from Avalanche to PlatON
```
node avalancheToPlatON.js
```

Send greeting from PlatON to Avalanche
```
node platONToAvalanche.js
```

### The [source code](https://github.com/dantenetwork/dante-cross-chain/blob/main/avalanche/contracts/examples/Greetings.sol) of greeting smart contract: 
```
contract Greetings is ConsumerBase {
    struct Greeting {
        string fromChain;
        string title;
        string content;
        string date;
    }
    
    // Store greetings
    Greeting[] public greetings;

    function registerInterface(string calldata _funcName, string calldata _interface) onlyOwner override external {
        crossChainContract.registerInterface(_funcName, _interface);
    }

    function receiveGreeting(string calldata _fromChain, string calldata _title, string calldata _content, string calldata _date) external {
        require(msg.sender == address(crossChainContract), "Locker: caller is not CrossChain");
        Greeting storage g = greetings.push();
        g.fromChain = _fromChain;
        g.title = _title;
        g.content = _content;
        g.date = _date;
    }

    function sendGreeting(string calldata _toChain, string calldata _title, string calldata _content, string calldata _date) external {
        DestinationMethod storage method = methodMap[_toChain];
        require(method.used, "method not registered");

        bytes memory data = abi.encode("Avalanche", _title, _content, _date);
        SQOS memory sqos = SQOS(1);
        crossChainContract.sendMessage(_toChain, method.contractAddress, method.methodName, tx.origin, sqos, data);
    }
}
```