require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://1rpc.io/sepolia",
      gas: "auto",
      accounts: [
        "7b0db22a78ea9135df5a6662302d962dac52d606a4dbc07c561274da6b9794f4",
        "5b4441a952584e7875e22ecc6a6a2c2f7acbc8638aa39ac34b6997ff8b71f5a6",
        "66ae1c66fc295bf2a1914764335e5c441eff297bcc09a3ed44be2725521556ff",
        "e4d197106918bf13c4dff2a7e1bbb9aaac3087daeda023e24288695a2f6d7f6e",
      ],
    },
  },
  defaultNetwork: "sepolia",
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
    ],
  },
};
