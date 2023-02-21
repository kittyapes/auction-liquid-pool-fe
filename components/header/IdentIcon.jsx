import { useEffect, useRef } from "react";
import { useWeb3Context } from "../../utils/web3-context";

if (typeof window !== "undefined") {
  var jazzicon = require("jazzicon");
}

export default function Identicon() {
  const avatarRef = useRef();
  const { account } = useWeb3Context();

  useEffect(() => {
    if (!account) return;
    const element = avatarRef.current;
    if (element && account) {
      const addr = account.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = jazzicon(20, seed);
      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  }, [account, avatarRef]);

  return <div ref={avatarRef}></div>;
}
