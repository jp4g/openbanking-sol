mod constants;
mod verify;
mod io;
use std::hash::poseidon2::Poseidon2;

use io::OpenbankingVerifierParams;
use verify::verify_openbanking_payment;
// use /


fn main(params: OpenbankingVerifierParams, x: pub Field) {
    // verify JWT and extract from payload
    let extracted = verify_openbanking_payment(params);
    // assert(extracted.amount.len() <= MAX_AMOUNT_VALUE_LENGTH, "amount too large");
    // parse outputs as fields and return
    // let commitment = extracted.recipient_commitment();
    // let amount = extracted.parse_amount() as Field;
    // (commitment, amount)
    assert(x == 1, "fuck");
}