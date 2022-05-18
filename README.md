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

**Greetings**
* User α sends a greeting message to the greeting contract on chain A.
* Greeting contract call cross-chain contract of DANTE on chain A.
* DANTE cross-chain service sync message from chain A to chain B.
* User β query greeting message on chain B.


**Computation**
* User α sends a transaction for a simple computation to the calculation contract on chain A.
* Calculation contract on chain A call cross-chain contract of DANTE on chain A.
* DANTE cross-chain service sync the calling information from chain A to chain B.
* Calculation contract on chain B make the real computation with its own mode(maybe it's a special mode like VC based on zk-snark).
* Calculation contract on chain B call cross-chain contract of DANTE to return the result of the computation to chain A.
* DANTE cross-chain service sync the result information from chain B to chain A.
* User α query the result on chain A.


## Install
```
npm install -d
```

## Test script

Send greeting from Avalanche to NEAR
```
node avalancheToNear.js --greet
```

Send greeting from NEAR to Avalanche
```
node nearToAvalanche.js --greet
```

Send outsourcing computing task from NEAR to Avalanche
```
node nearToAvalanche.js --compute 1,2,3,4,5,8
```

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
