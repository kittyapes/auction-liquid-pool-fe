import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
  // Change to [1] when push to prod.
  supportedChainIds: [1,5],
});
