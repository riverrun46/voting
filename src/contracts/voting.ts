import { assert, ByteString, fill, FixedArray, hash256, method, prop, SmartContract, toByteString } from 'scrypt-ts'

export type Name = ByteString
export type Candidate = {
  name: Name
  votesReceived: bigint
}
export const N = 3

export type Candidates = FixedArray<Candidate, typeof N>

export class Voting extends SmartContract {
  @prop(true)
  candidates: Candidates

  constructor(names: FixedArray<Name, typeof N>) {
    super(...arguments)

    this.candidates = fill(
      {
        name: toByteString(''),
        votesReceived: 0n,
      },
      N,
    )

    for (let i = 0; i < N; i++) {
      this.candidates[i] = {
        name: names[i],
        votesReceived: 0n,
      }
    }
  }

  @method()
  public vote(name: Name) {
    this.increaseVotesReceived(name)

    let outputs: ByteString = this.buildStateOutput(this.ctx.utxo.value)
    outputs += this.buildChangeOutput()

    assert(this.ctx.hashOutputs === hash256(outputs), 'invalid outputs')
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
