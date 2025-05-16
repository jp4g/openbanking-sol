set -e

echo "Compiling circuit..."
if ! nargo compile; then
    echo "Compilation failed. Exiting..."
    exit 1
fi


echo "Generating solidity verifier..."
bb write_vk_ultra_keccak_honk -b target/noir_solidity.json
bb contract_ultra_honk

mv target/contract.sol ../contracts/Verifier.sol

# sed -i '/0.8.27/d' ../contract/Verifier.sol

echo "Done"
