# cross-chain-demo

This `repo` is for demos with the development of Dante Network. 
This is a "Nightly" branch for development. New features will be published here as soon as we make progresses.

## Currently
Currently, the demo smart contract to test the `service expression protocol` used for basic communication between different chains, including cross-chain message delivering and cross-chain contract invocations. 

## Coming soon
The development of the verification for multi-nodes has just been completed in [Near](https://github.com/dantenetwork/Trustless_Bridge/tree/main/near), and we're testing it now. After we finish our internal test in Near, the `solidity` version will be developed. We will deploy and test this point for ETH, Avalanche, PlatON, or other public chains with EVM soon.
The Demo of the verification on Near will be published soon(within 4 weeks).

The `SQoS` is under development in `solidity`. We will update the demo as soon as we finish it.

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
node avalancheToPlatON.js --greet
```
Send outsourcing computing task from Avalanche to PlatON
```
node avalancheToPlatON.js --compute 1,2,3,4,5
```

Send greeting from PlatON to Avalanche
```
node platONToAvalanche.js --greet
```
Send outsourcing computing task from PlatON to Avalanche
```
node platONToAvalanche.js --compute 1,2,3,4,5
```

## You can find the [source code](https://github.com/dantenetwork/solidity-contract-template/blob/demo-video/contracts/Greetings.sol) of greeting smart contract here.
