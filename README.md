# OpenBanking Solidity Onramp

## Run instructions
1. `(cd circuit && ./build.sh)`
2. `yarn` (or npm or whatever)
3. `yarn test`

Runs a full, e2e demonstration of
1. locking funds in escrow (offramp perspective, will recieve bank fiat in exchange for tokens)
2. depositing dormant funds in mocked aave
3. proving correctness of openbanking proof in Noir
4. verifying openbanking proof in solidity
5. withdrawing funds locked in aave and releasing escrow (onramp perspective, recieved tokens in exchange for bank fiat)