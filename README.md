# Demos for Multichain Interoperation

This `repo` provides demos showing common message communication and contracts invocation between multi-chains.  
This is a "Nightly" branch for development. New features will be published here as soon as we make progresses.  
The test network is planned to be online in early Q3(2022).

# Current Work flow
We provide two situations:
- **Greetings**
  * User α sends a greeting message to the greeting contract on chain A.
  * Greeting contract call cross-chain contract of DANTE on chain A.
  * DANTE cross-chain service sync message from chain A to chain B.
  * User β query greeting message on chain B.

- **Computation**
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

### Prepare private key
The private key is used to sign transations which will be sent to Rinkeby and Moonbeam.  
You can use the default private key file `.secret`. If the amount is not enough to pay gas fee, you can get token from faucet listed below.  

**If you do not want to use default private key file, you can create it yourself**
- Create a evm-compatible account(private key is neccessary), MetaMask will be ok
- Paste private key into the file `.secret`
- Get token for test, faucets are shown below
  - Moonbeam: https://docs.moonbeam.network/learn/platform/networks/moonbase/#moonbase-alpha-faucet
  - Rinkeby: https://rinkebyfaucet.com/

### Test script

**Interoperation between Polkadot parachain and EVM compatible chains**

**Prepare**
- Open Polkadot Apps - Shibuya Testnet: [https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpublic-rpc.pinknode.io%2Fshibuya#/contracts](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpublic-rpc.pinknode.io%2Fshibuya#/contracts)
- We have deployed these smart contracts on `Contracts on Rococo`:
    - `cross_chain.contract`: 
        - Address: `YoF56GBPEGKKeokDzLxwsZyYsmCaWYPQ7eiiqdGtAZRswdd`
        - Related [metadata](./res/ink/cross_chain.metadata)
    - `greeting.contract`:          
        - Address: `a1mydsZDKLQJh8mwB1NZ86XVJ8ApiyNVWikMrhoLwoGfZex`
        - Related [metadata](./res/ink/greeting.metadata)
    - `oscomputing.contract`:
        - Address: `ZakeYTFPNkC9Cgceui2aBZ6G23nA6ieB3KVWfmdNDv6UfM1`
        - Related [metadata](./res/ink/computing.metadata)
- Prepare an test account:
    - Click `Add account` on `Accounts` page, and finish creating an account
    - Get token from [faucet](https://portal.astar.network/#/assets)
    - Test with this account

![image](https://user-images.githubusercontent.com/83757490/180929676-fa41e851-d3de-4d68-9298-8ab370cf7cf6.png)

#### **Interoperation between `Shibuya Testnet` and `Avalanche`**

- Send greeting from `Avalanche` to `Shibuya Testnet`. 

  - Send greeting from `Avalanche` with command
  
  ```
  node avalancheToAstar.js --greet
  ```
  - Check what happened on [Avalanche greeting smart contract](https://testnet.snowtrace.io/address/0x1723f39e05Ca8b14ACaf244bAFFBd79801d42A63)
  - Query result from **Greeting** contract on `Shibuya Testnet`

  ![image](https://user-images.githubusercontent.com/83757490/174969839-f4733c11-02b7-4c82-942c-5cecbff87e51.png)

- Send greeting from `Shibuya Testnet` to `Avalanche`

  - Send greeting with **Greeting** contract on `Shibuya Testnet`

  ![image](https://user-images.githubusercontent.com/83757490/174970370-b6cc7bf5-dc77-45c6-b377-7316b2c88529.png)

  - Query message id
  
  After the transaction has been executed successfully, query the id of the message from **Cross Chain** contract on `Shibuya Testnet`. The id is the same as the number of all sent messages.

  ![image](https://user-images.githubusercontent.com/83757490/175046819-1c4adfca-ea46-466d-a0bb-0bb75d68bfd4.png)

  - Query result on `Avalanche` with command
  
  ```
  node avalancheToAstar.js --query <ID>
  ```
  `<ID>` is the id queryed above. 
  
  - Check related transaction in [Avalanche Scan](https://testnet.snowtrace.io/address/0x8177cBe1c9a0B08B536C55097b569dfaEc5cb520)


- Send computing task from `Shibuya Testnet` to `Avalanche`

  Here, we have registered the destination chain contract address and method name to the **OSComputing** contract with the method `multiDestContracts::registerDestContract`, so the method `sendComputingTask` just needs the destination chain name and numbers to be computed as parameters.

  You can query the destination contract and method name with the method `multiDestContracts::getDestContractInfo`.

  ![image](https://user-images.githubusercontent.com/83757490/175050523-834eefc0-f742-4cec-9e3d-ff23a1a24482.png)

  The prefix "X" is added because the hex string will be handled specially.

  - Send computing task with **OSComputing** contract on `Shibuya Testnet`

  ![image](https://user-images.githubusercontent.com/83757490/174970600-bb4855ff-5a7f-4b1f-b744-193d97c297fe.png)

  You can query the message sent to Avalanche on [Avalanche Scan](https://testnet.snowtrace.io/address/0x8177cBe1c9a0B08B536C55097b569dfaEc5cb520)

  - Query result from **OSComputing** contract on `Shibuya Testnet`, it may take 1 minute after the computing task was sent.

  ![image](https://user-images.githubusercontent.com/83757490/174970671-81320a68-4d66-407f-8998-a85aee26fdb9.png)

#### **Interoperation between `Moonbeam` and `NEAR`**  

**Check related transaction in [Moonbeam Scan](https://moonbase.moonscan.io/)**  
**Check related transaction in [Near Scan](https://explorer.testnet.near.org/)**

- Send greeting from Moonbeam to NEAR
```
node moonbeamToNear.js --greet
```

- Send outsourcing computing task from Moonbeam to NEAR
```
node moonbeamToNear.js --compute 9,9,8
```

- Send greeting from NEAR to Moonbeam
```
node nearToMoonbeam.js --greet
```

- Send outsourcing computing task from NEAR to Moonbeam 
```
node nearToMoonbeam.js --compute 9,9,8
```

### Other Demos
* Check more demo shows based on Dante protocol stack [here](https://github.com/dantenetwork/Demo-Show)
