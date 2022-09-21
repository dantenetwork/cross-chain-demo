import Cocomputation from 0xc133efc4b43676a0

pub fun main(addr: Address): {UInt128: Cocomputation.RequestRecord} {
    let acct = getAuthAccount(addr);
    let requesterRef = acct.borrow<&Cocomputation.Requester>(from: /storage/requester)!;
    return requesterRef.recorder;
}
