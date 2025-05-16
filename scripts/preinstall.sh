#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
cd "$SCRIPT_DIR/.."

# if [ ! -d "openbanking.nr-circuit" ]; then
#     git clone --branch main --depth 1 https://github.com/attested-frontiers/openbanking.nr-circuit
# fi
# if [ -d "node_modules/openbanking-nr" ]; then
#     rm -rf node_modules/openbanking-nr
# fi
# cp -r openbanking.nr-circuit node_modules/openbanking-nr
# cd node_modules/openbanking-nr/js
# yarn
# yarn build
