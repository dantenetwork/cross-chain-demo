# Demos for Multichain Interoperation

This `repo` provides demos showing common message communication and contracts invocation between multi-chains. 
This is a "Nightly" branch for development. New features will be published here as soon as we make progresses.

## Introduction
The demo smart contract to test basic communication between different chains, including cross-chain message delivering and cross-chain contract invocations. 

## Coming soon
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

## Usage

### Install
```
npm install -d
```

### Test script

#### Interoperation between Polkadot parachain and EVM compatible chains
Send greeting from `rinkeby` to `AStar Testnet`
```
node rinkebyToAstar.js --greet
```

(TODO)from Polkadot parachain to  EVM compatible chains
(operate with polkadot.js/app)
(contract address and metadata.json)

####
Send greeting from Moonbeam to NEAR
```
node MoonbeamToNear.js --greet
```

Send outsourcing computing task from Moonbeam to NEAR
```
node MoonbeamToNear.js --compute 9,9,8
```

Send greeting from NEAR to Moonbeam
```
node NearToMoonbeam.js --greet
```

Send outsourcing computing task from NEAR to Moonbeam 
```
node NearToMoonbeam.js --compute 9,9,8
```

### Other Demos
* Demo for interoperation between Near and EVM chains is [here](https://github.com/dantenetwork/cross-chain-demo/tree/demo-video);
* Demo for interoperation between EVM chains is [here](https://github.com/dantenetwork/cross-chain-demo/tree/demo-video)
