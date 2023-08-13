import { Name, Voting, N } from './src/contracts/voting'
import { bsv, TestWallet, DefaultProvider, toByteString, FixedArray } from 'scrypt-ts'

// Load the .env file

// Read the private key from the .env file.
// The default private key inside the .env file is meant to be used for the Bitcoin testnet.
// See https://scrypt.io/docs/bitcoin-basics/bsv/#private-keys
const privateKey = bsv.PrivateKey.fromWIF('cNFjrWuq9taLhM42NFdVSN9FQNxdnbdSTsH3thoUx6zwVqTw3YgS')

// Prepare signer.
// See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
const signer = new TestWallet(
  privateKey,
  new DefaultProvider({
    network: bsv.Networks.testnet,
  }),
)

async function main() {
  await Voting.compile()

  const candidateNames: FixedArray<Name, typeof N> = [
    toByteString('iPhone', true),
    toByteString('Android', true),
    toByteString('Windows', true),
  ]

  const instance = new Voting(candidateNames)

  // Connect to a signer.
  await instance.connect(signer)

  // Contract deployment.
  const amount = 1
  const deployTx = await instance.deploy(amount)
  console.log('Voting contract deployed: ', deployTx.id)
}

main()
