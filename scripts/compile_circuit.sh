#!/bin/bash
# SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

# cd "$SCRIPT_DIR/../circuit"

# echo "Compiling OpenBanking.nr binary"
# nargo compile --force --silence-warnings

    
# echo "Generating OpenBanking.nr vkey"
# bb write_vk -b ./target/openbanking.json -o ./target --oracle_hash keccak

# echo "Writing Solidity Verifier"
# bb write_solidity_verifier -k ./target/vk -o ../contracts/Verifier.sol