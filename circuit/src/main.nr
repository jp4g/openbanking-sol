mod constants;
mod verify;
mod io;
use std::hash::poseidon2::Poseidon2;

use io::OpenbankingVerifierParams;
use verify::verify_openbanking_payment;


fn main(params: OpenbankingVerifierParams) -> pub (Field, Field) {
    // verify JWT and extract from payload
    let extracted = verify_openbanking_payment(params);
    // parse outputs as fields and return
    let commitment = extracted.recipient_commitment();
    let amount = extracted.parse_amount() as Field;
    (commitment, amount)
}