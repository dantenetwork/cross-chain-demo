# cross-chain-demo

This `repo` is for demos with the development of Dante Network. 

## Currently
Currently, the demo smart contract to test the `service expression protocol` used for basic communication between different chains, including cross-chain message delivering and cross-chain contract invocations. 

## Coming soon
The development of the verification for multi-nodes has just been completed in [Near](https://github.com/dantenetwork/Trustless_Bridge/tree/main/near), and we're testing it now. After we finish our internal test in Near, the `solidity` version will be developed. 
The Demo of the verification on Near will be published soon(within 4 weeks).

The `SQoS` is under development. We will update the demo as soon as we finish it.

Besides, we will make `npm packages` for contract developers along with our SDK for `easy cross-chain DApps`'s development.

The test network is planning to be online in early Q3(2022).

# Current Work flow

**This chapter will be updated as the project progresses.**

* User A sends a greeting message to the smart contract of Avalanche.
* Greeting contract call cross-chain contract of DANTE.
* DANTE cross-chain service sync message from Avalanche to PlatON.
* User A query greeting message on PlatON.


## Install
```
npm install -d
```

## Test script

Send greeting from Avalanche to PlatON
```
node avalancheToPlatON.js
```

Send greeting from PlatON to Avalanche
```
node platONToAvalanche.js
```

## The [source code](https://github.com/dantenetwork/dante-cross-chain/blob/main/avalanche/contracts/examples/Greetings.sol) of greeting smart contract: 
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