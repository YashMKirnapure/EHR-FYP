// Setup: npm install alchemy-sdk
// Github: https://github.com/alchemyplatform/alchemy-sdk-js
import { Network, Alchemy } from "alchemy-sdk";

// Optional config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: "CatEVOziMyIwrdQLCdhO_pEE4ovyGgAh", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

alchemy.core.getBlock(15221026).then(console.log);

// https://eth-mainnet.g.alchemy.com/v2/CatEVOziMyIwrdQLCdhO_pEE4ovyGgAh