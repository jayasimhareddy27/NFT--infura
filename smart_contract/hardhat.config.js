const fs = require('fs');
require('@nomiclabs/hardhat-waffle');

const API_URL="https://eth-goerli.g.alchemy.com/v2/eTnv1wn6cNFuV7ecmWYeHrQCbv5WvCyh"
const PRIVATE_KEY="62624e010f07bac8001e9b3698a043fcbef757d204327d5b93f5e90058ea4e93"

//const privateKey = fs.readFileSync('.secret').toString().trim();
//0xb5F0C7F7960597aBB522a92b9D5A83FE23F2DF88
module.exports = {
  networks: {
    goerli: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    },
  },
  solidity: '0.8.4',
};
