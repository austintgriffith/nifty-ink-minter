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
const drawingHash = "QmVECwSLqBinYyH2yCyUKdYq21y9iSfLqq3fkzchiDisXd"

// send some xdai to your account to you bypass the meta transaction stuff
//
// click on your wallet icon and find the private key
//
const pk = "0xXXXXXX____YOUR___XXXXXX___PK__XXXXXXXXXXXX___HERE_____XXXXX"


// enter the addresses to mint to and run `node index.js` in this folder
let mintList = [
  "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  "0xB2ac59aE04d0f7310dC3519573BF70387b3b6E3a"
]



//////////////////////////----------   no need to edit past this point i hope    -------//////////////////////

const provider = new ethers.providers.JsonRpcProvider("https://dai.poa.network");

let wallet = new ethers.Wallet(pk, provider);

const run = async () => {

  for(let l in mintList){
    let cleanAddress = (ethers.utils.getAddress( mintList[l] )).replace("0x","")
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
         data: callData
    }
    console.log("tx",tx)

    const result = await wallet.sendTransaction(tx);
    console.log("result",result)
  }
}
run()
