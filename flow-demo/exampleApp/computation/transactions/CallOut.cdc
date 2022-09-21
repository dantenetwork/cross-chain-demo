import Cocomputation from 0xc133efc4b43676a0

transaction (toChain: String, 
            contractName: [UInt8], 
            actionName: [UInt8], 
            inputs: [UInt32]) {

    prepare(acct: AuthAccount) {
        
    }

    execute {
        Cocomputation.testCallOut(toChain: toChain, 
                                    contractName: contractName, 
                                    actionName: actionName, 
                                    numbers: inputs);
    }
}
