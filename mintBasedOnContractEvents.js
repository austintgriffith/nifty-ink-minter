const { ethers } = require("ethers");

//
//
// open an incognito window and visit nifty ink
//
// (a burner wallet is generated for you on page load)
//
// create a drawing and set the limit to '0' or a larger enough number -- hit ink!
//
// in the (i) info section of your drawing, find drawingHash: Qm....
//
const drawingHash = "QmeFXDxXT71q2gVk9zbPe3jyFvFjwakQ5tS3LtL67yN9DK"

// send some xdai to your account to bypass the meta transaction stuff
//
// click on your wallet icon and find the private key
//
const pk = "0xXXXXXX____YOUR___XXXXXX___PK__XXXXXXXXXXXX___HERE_____XXXXX"


//we want to listen to events from a contract and then mint a nifty to the addresses
//
// this contract is on mainnet but we will be minting nifties on xdai
//
// our provider for mainnet:
const someContractProvider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/https://mainnet.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad")

// use etherscan to get the address and ABI of the contract you want to listen to
//
const someContractAddress = "0x7b9FC971C701A1BCF5A1f44a67616a14Dc299Ad9"

const someContractABI = [{"inputs":[{"internalType":"uint256","name":"_roundDuration","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Distribute","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"Donate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"total","type":"uint256"}],"name":"MatchingPoolDonation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"bytes32","name":"data","type":"bytes32"},{"indexed":false,"internalType":"string","name":"link","type":"string"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"RecipientAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"roundStart","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"roundDuration","type":"uint256"}],"name":"RoundStarted","type":"event"},{"inputs":[{"internalType":"address payable","name":"addr","type":"address"},{"internalType":"bytes32","name":"data","type":"bytes32"},{"internalType":"string","name":"link","type":"string"}],"name":"addRecipient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"to","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"distribute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"donate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getBlockTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"recipientCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"roundDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"roundStart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startRound","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]

let someContract = new ethers.Contract(someContractAddress, someContractABI, someContractProvider)


const run = async () => {
  let nonce = await provider.getTransactionCount(wallet.address)

  // Here we trigger off the Donate event and mint a nifty for each address that donated:
  //Donate: address sender, uint256 value, uint256 index
  let events = await someContract.queryFilter("Donate")
  let promises = []
  for(let e in events){
    console.log("MINT",events[e].args.sender, drawingHash)
    promises.push( mint( events[e].args.sender, drawingHash, nonce++ ) )
  }
  await Promise.all(promises)

}

const provider = new ethers.providers.JsonRpcProvider("https://dai.poa.network");

let wallet = new ethers.Wallet(pk, provider);

const mint = async ( toAddress, drawingHash, nonce )=>{
  let cleanAddress = (ethers.utils.getAddress( toAddress )).replace("0x","")
  console.log(cleanAddress)
  const callData = "0xd0def521000000000000000000000000"+
    cleanAddress+
    "0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002e"+
    ethers.utils.hexlify(ethers.utils.toUtf8Bytes(drawingHash)).replace("0x","")+
    "000000000000000000000000000000000000"
  console.log("callData",callData)

  const tx = {
       gasLimit: 400000,
       gasPrice: 1010010010,
       to: "0xCF964c89f509a8c0Ac36391c5460dF94B91daba5",
       data: callData,
       nonce: nonce
  }
  console.log("tx",tx)

  return wallet.sendTransaction(tx);
}



run()
