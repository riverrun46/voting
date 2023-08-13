import { assert, ByteString, hash256, method, prop, SmartContract, FixedArray, fill, toByteString } from 'scrypt-ts'

export type Name = ByteString

export type Candidate = {
  name: Name
  votesReceived: bigint
}

export const N = 2

export type Candidates = FixedArray<Candidate, typeof N>

export class V2 extends SmartContract {
  @prop(true)
  candidates: Candidates

  constructor(names: FixedArray<Name, typeof N>) {
    super(...arguments)
    // initialize fixed array
    this.candidates = fill(
      {
        name: toByteString(''),
        votesReceived: 0n,
      },
      N,
    )
    // set names and set votes they received to 0
    for (let i = 0; i < N; i++) {
      this.candidates[i] = {
        // ok
        name: names[i],
        votesReceived: 0n,
      }
      // this.candidates[i].name = names[i] // invalid
    }
  }

  /**
   * vote for a candidate
   * @param name candidate's name
   */
  @method()
  public vote(name: Name) {
    // change contract state: add one vote to `candidate` in the list
    this.increaseVotesReceived(name)
    // output containing the latest state and the same balance
    let outputs: ByteString = this.buildStateOutput(this.ctx.utxo.value)
    outputs += this.buildChangeOutput()
    assert(this.ctx.hashOutputs === hash256(outputs), 'hashOutputs mismatch')
  }

  @method()
  increaseVotesReceived(name: Name): void {
    for (let i = 0; i < N; i++) {
      if (this.candidates[i].name === name) {
        this.candidates[i].votesReceived++
      }
    }
  }
}
