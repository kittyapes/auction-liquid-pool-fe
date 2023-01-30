(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 3722:
/***/ ((module) => {

// Exports
module.exports = {
	"content": "Header_content__ZO0nG",
	"title": "Header_title__0XOgp",
	"subtitle": "Header_subtitle__tfvAI",
	"subcontent": "Header_subcontent__kRb5E",
	"data": "Header_data__zmYSJ",
	"button": "Header_button__LpK35",
	"purple": "Header_purple__UhfTg",
	"logo": "Header_logo__s_7p5",
	"right": "Header_right__yi57C",
	"container": "Header_container__bGCzb"
};


/***/ }),

/***/ 2817:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "n": () => (/* binding */ WalletProvider),
/* harmony export */   "t": () => (/* binding */ useWalletContext)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const WalletContext = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createContext(undefined);
WalletContext.displayName = "WalletContext";
const WalletProvider = ({ children  })=>{
    const [account, setAccount] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [chainId, setChainId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (account) {
            localStorage.setItem("__HYPEX_walletAddress", account);
        }
    }, [
        account
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(WalletContext.Provider, {
        value: {
            account,
            setAccount
        },
        children: children
    });
};
function useWalletContext() {
    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(WalletContext);
    if (!context) {
        throw new Error("Cannot Use without WalletProvider");
    }
    return context;
}


/***/ }),

/***/ 6021:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ _app)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: ./styles/globals.css
var globals = __webpack_require__(6764);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
;// CONCATENATED MODULE: ./static/images/logo.png
/* harmony default export */ const logo = ({"src":"/_next/static/media/logo.133b3054.png","height":236,"width":600,"blurDataURL":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAADCAYAAACuyE5IAAAAY0lEQVR4nGP89+8fJwMDAw8QcwExKyMjI8vPH/9/lXIyfufR+icNUmAHlHBjZGT48+8fww8mJga2R7cZebrU/kvJRzCUghQIAhXwAvHf378Y/rGxM3zZsZghamscwz/Z8H/LAV9aI7mS14KoAAAAAElFTkSuQmCC","blurWidth":8,"blurHeight":3});
// EXTERNAL MODULE: ./components/header/style/Header.module.css
var Header_module = __webpack_require__(3722);
var Header_module_default = /*#__PURE__*/__webpack_require__.n(Header_module);
;// CONCATENATED MODULE: external "@web3-react/injected-connector"
const injected_connector_namespaceObject = require("@web3-react/injected-connector");
// EXTERNAL MODULE: external "ethers"
var external_ethers_ = __webpack_require__(1982);
;// CONCATENATED MODULE: ./components/Wallet/connectors.js


const connectWallet = async ()=>{
    const provider = new external_ethers_.ethers.providers.Web3Provider(window["ethereum"] || window.web3.currentProvider);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    return walletAddress;
};
const injected = new injected_connector_namespaceObject.InjectedConnector({
    // Change to [1] when push to prod.
    supportedChainIds: [
        1,
        5
    ]
});

// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
// EXTERNAL MODULE: ./context/wallet.js
var wallet = __webpack_require__(2817);
;// CONCATENATED MODULE: ./components/header/Header.jsx









if (false) { var jazzicon; }
const Header = ()=>{
    const router = (0,router_.useRouter)();
    const avatarRef = (0,external_react_.useRef)();
    const { account , setAccount  } = (0,wallet/* useWalletContext */.t)();
    const useToHome = ()=>{
        router.push("/");
    };
    (0,external_react_.useEffect)(()=>{
        async function connect() {
            const address = await connectWallet();
            setAccount(address);
        }
        if (account != null) return;
        connect();
    });
    (0,external_react_.useEffect)(()=>{
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
    }, [
        account,
        avatarRef
    ]);
    const abbreviateWalletAddress = (address)=>{
        return address.slice(0, 5) + "..." + address.slice(-4);
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (Header_module_default()).container,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                    className: (Header_module_default()).logo,
                    onClick: useToHome,
                    children: /*#__PURE__*/ jsx_runtime_.jsx("img", {
                        src: logo.src,
                        alt: "hypex-logo"
                    })
                })
            }),
            account && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: (Header_module_default()).right,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        ref: avatarRef
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        children: abbreviateWalletAddress(account)
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const header_Header = (Header);

;// CONCATENATED MODULE: external "@web3-react/core"
const core_namespaceObject = require("@web3-react/core");
// EXTERNAL MODULE: external "web3"
var external_web3_ = __webpack_require__(8519);
var external_web3_default = /*#__PURE__*/__webpack_require__.n(external_web3_);
// EXTERNAL MODULE: external "next/head"
var head_ = __webpack_require__(968);
var head_default = /*#__PURE__*/__webpack_require__.n(head_);
// EXTERNAL MODULE: external "@mui/material/styles"
var styles_ = __webpack_require__(8442);
;// CONCATENATED MODULE: ./pages/_app.js








function getLibrary(provider) {
    return new (external_web3_default())(provider);
}
const THEME = (0,styles_.createTheme)({
    typography: {
        "fontFamily": `"Poppins"`,
        "fontSize": 14,
        "fontWeightLight": 600,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500
    },
    palette: {
        primary: {
            main: "#7924FF"
        },
        secondary: {
            main: "#1F1927"
        }
    }
});
function MyApp({ Component , pageProps  }) {
    return /*#__PURE__*/ jsx_runtime_.jsx(core_namespaceObject.Web3ReactProvider, {
        getLibrary: getLibrary,
        children: /*#__PURE__*/ jsx_runtime_.jsx(wallet/* WalletProvider */.n, {
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(styles_.ThemeProvider, {
                theme: THEME,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)((head_default()), {
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("title", {
                                children: "Hypex"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                                name: "description",
                                content: "Generated by create next app"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("link", {
                                rel: "icon",
                                href: "/favicon.ico"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("link", {
                                rel: "preconnect",
                                href: "https://fonts.googleapis.com"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("link", {
                                rel: "preconnect",
                                href: "https://fonts.gstatic.com",
                                crossOrigin: "true"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("link", {
                                href: "https://fonts.googleapis.com/css2?family=Poppins&display=swap",
                                rel: "stylesheet"
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(header_Header, {}),
                    /*#__PURE__*/ jsx_runtime_.jsx(Component, {
                        ...pageProps
                    })
                ]
            })
        })
    });
}
/* harmony default export */ const _app = (MyApp);


/***/ }),

/***/ 6764:
/***/ (() => {



/***/ }),

/***/ 8442:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/material/styles");

/***/ }),

/***/ 1982:
/***/ ((module) => {

"use strict";
module.exports = require("ethers");

/***/ }),

/***/ 968:
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ 1853:
/***/ ((module) => {

"use strict";
module.exports = require("next/router");

/***/ }),

/***/ 6689:
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 8519:
/***/ ((module) => {

"use strict";
module.exports = require("web3");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(6021));
module.exports = __webpack_exports__;

})();