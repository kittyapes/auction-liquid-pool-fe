import { useEffect, useRef } from "react";
import { useWalletContext } from "../../context/wallet";
if (typeof window !== "undefined") {
  var jazzicon = require("jazzicon");
}

export default function Identicon() {
  const avatarRef = useRef();
  const { account } = useWalletContext();

  useEffect(() => {
    if (!account) return;
    const element = avatarRef.current;
    if (element && account) {
      const addr = account.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = jazzicon(20, seed); //generates a size 20 icon
      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  }, [account, avatarRef]);

  return <div ref={avatarRef}></div>;
}
