# cross-chain-demo

This `repo` provides two demos showing common message communication and contracts invocation between multi-chains. 
This is a "Nightly" branch for development. New features will be published here as soon as we make progresses.

## Currently

**Demo for interoperation between EVM chains and WASM chains like NEAR can now be experienced!**


## Coming soon
The development and test of a fully basic functions version has been completed on NEAR. We will publish the test report soon.

A Demo showing how the router evaluation algorithm works has been published [here](https://github.com/dantenetwork/Routers-Evaluation-Demo).

A Demo showing how the router selection algorithm works will be published soon. Actually it's like a randomly selection game, and we will make some related community activities based on this algorithm.

The `SQoS` is under development in `solidity`. We have finished some of the SQoS items, and it's under testing.

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

Send greeting from PlatON to NEAR
```
node platONEVMToNear.js --greet
```

Send greeting from Avalanche to NEAR
```
node avalancheToNear.js --greet
```

Send outsourcing computing task from PlatON to NEAR
```
node platONEVMToNear.js --compute 9,9,8
```

## You can find the [source code](https://github.com/dantenetwork/solidity-contract-template/blob/demo-video/contracts/Greetings.sol) of greeting smart contract here.
