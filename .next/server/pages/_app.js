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
	"container": "Header_container__bGCzb",
	"ConnectButton": "Header_ConnectButton__Nrtri",
	"accountAddress": "Header_accountAddress__q4NZU",
	"accountModalText": "Header_accountModalText__dVxFW",
	"smallButton": "Header_smallButton__yyWmF",
	"smallbutton": "Header_smallbutton__5rJrf",
	"smallIcon": "Header_smallIcon___G0C4",
	"copyHidden": "Header_copyHidden__HQW7V",
	"exploreHidden": "Header_exploreHidden__xJvq6",
	"copy": "Header_copy__Ks4xT",
	"explore": "Header_explore__p5Wwg",
	"icons": "Header_icons__lqWZM",
	"hoverButton": "Header_hoverButton__vWdP5"
};


/***/ }),

/***/ 5423:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"src":"/_next/static/media/logo.133b3054.png","height":236,"width":600,"blurDataURL":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAADCAYAAACuyE5IAAAAY0lEQVR4nGP89+8fJwMDAw8QcwExKyMjI8vPH/9/lXIyfufR+icNUmAHlHBjZGT48+8fww8mJga2R7cZebrU/kvJRzCUghQIAhXwAvHf378Y/rGxM3zZsZghamscwz/Z8H/LAV9aI7mS14KoAAAAAElFTkSuQmCC","blurWidth":8,"blurHeight":3});

/***/ }),

/***/ 9480:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": () => (/* binding */ checkChainId)
/* harmony export */ });
/* unused harmony export useChainId */
const useChainId = async ()=>{
    if (!window["ethereum"] && (!window.web3 || !window.web3.currentProvider)) {
        console.log("no web3 access!!");
        return;
    }
    const _chainId = await window.ethereum.request({
        method: "eth_chainId"
    });
    const chainId = _chainId.replace("0x", "");
    return chainId;
};
const checkChainId = async (setChainId)=>{
    const _chainId = await useChainId();
    setChainId(_chainId);
    if (_chainId != 5) {
        await window.ethereum?.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: "0x5"
                }
            ]
        });
        checkChainId(setChainId);
    }
};


/***/ }),

/***/ 9459:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "UP": () => (/* binding */ connectWallet),
  "z": () => (/* binding */ readWallet)
});

// UNUSED EXPORTS: injected

;// CONCATENATED MODULE: external "@web3-react/injected-connector"
const injected_connector_namespaceObject = require("@web3-react/injected-connector");
// EXTERNAL MODULE: external "ethers"
var external_ethers_ = __webpack_require__(1982);
;// CONCATENATED MODULE: ./components/Wallet/connectors.js


const connectWallet = async ()=>{
    if (!window["ethereum"] && (!window.web3 || !window.web3.currentProvider)) {
        console.log("no web3 access!!");
        return;
    }
    const provider = new external_ethers_.ethers.providers.Web3Provider(window["ethereum"] || window.web3.currentProvider);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    console.log(walletAddress);
    return walletAddress;
};
const readWallet = async ()=>{
    if (!window["ethereum"] && (!window.web3 || !window.web3.currentProvider)) {
        console.log("no web3 access!!");
        return null;
    }
    const provider = new external_ethers_.ethers.providers.Web3Provider(window["ethereum"] || window.web3.currentProvider);
    const signer = provider.getSigner();
    try {
        const walletAddress = await signer.getAddress();
        return walletAddress;
    } catch (e) {
        return null;
    }
};
const injected = new injected_connector_namespaceObject.InjectedConnector({
    // Change to [1] when push to prod.
    supportedChainIds: [
        1,
        5
    ]
});


/***/ }),

/***/ 2818:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ AccountModal)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mui_material_Box__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);
/* harmony import */ var _mui_material_Box__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_mui_material_Box__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _mui_material_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3819);
/* harmony import */ var _mui_material_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_mui_material_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mui_material_Typography__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7163);
/* harmony import */ var _mui_material_Typography__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_mui_material_Typography__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _mui_material_Modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9564);
/* harmony import */ var _mui_material_Modal__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_mui_material_Modal__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _IdentIcon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8510);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1982);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ethers__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(3722);
/* harmony import */ var _header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _context_wallet__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2817);
/* harmony import */ var _mui_icons_material_ContentCopy__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(6843);
/* harmony import */ var _mui_icons_material_ContentCopy__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_ContentCopy__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _mui_icons_material_PowerSettingsNew__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(8768);
/* harmony import */ var _mui_icons_material_PowerSettingsNew__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_PowerSettingsNew__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _mui_icons_material_ArrowOutward__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(3987);
/* harmony import */ var _mui_icons_material_ArrowOutward__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_ArrowOutward__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _mui_icons_material_ChevronRight__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(9438);
/* harmony import */ var _mui_icons_material_ChevronRight__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_ChevronRight__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _pool_contract_poolContract__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(3757);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_pool_contract_poolContract__WEBPACK_IMPORTED_MODULE_13__]);
_pool_contract_poolContract__WEBPACK_IMPORTED_MODULE_13__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];















const style = {
    position: "absolute",
    top: 96,
    right: 0,
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid transparent",
    p: 2,
    borderRadius: 2
};
function AccountModal({ setAccountModalOpen  }) {
    const provider = (0,_pool_contract_poolContract__WEBPACK_IMPORTED_MODULE_13__/* .getProvider */ .VH)();
    const handleOpen = ()=>setAccountModalOpen(true);
    const handleClose = ()=>setAccountModalOpen(false);
    const { account , pendingTxs  } = (0,_context_wallet__WEBPACK_IMPORTED_MODULE_8__/* .useWalletContext */ .t)();
    const [ethBalance, setEthBalance] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    const [copyLabel, setCopyLabel] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("copy");
    const formatFloatNumber = (x)=>Number.parseFloat(x).toFixed(3);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        async function fetchUserWalletETHBalance() {
            const balance = await provider.getBalance(account);
            setEthBalance(formatFloatNumber(ethers__WEBPACK_IMPORTED_MODULE_7__.ethers.utils.formatEther(balance)));
        }
        fetchUserWalletETHBalance();
    });
    const copy = ()=>{
        navigator.clipboard.writeText(account);
        setCopyLabel("copied!");
    };
    const explore = ()=>{
        window.open(`https://goerli.etherscan.io/address/${account}`, "_blank");
    };
    const logout = async ()=>{
        const res = await window.ethereum.request({
            method: "eth_requestAccounts",
            params: [
                {
                    eth_accounts: {}
                }
            ]
        });
        console.log(res);
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_mui_material_Modal__WEBPACK_IMPORTED_MODULE_5___default()), {
            open: true,
            onClose: handleClose,
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_mui_material_Box__WEBPACK_IMPORTED_MODULE_2___default()), {
                sx: style,
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        },
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    height: "30px",
                                    paddingBottom: "15px"
                                },
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_IdentIcon__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {}),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                        className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default().accountModalText),
                                        children: account.slice(0, 5) + "..." + account.slice(-4)
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default().icons),
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default().hoverButton),
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default().smallButton),
                                                id: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default().copy),
                                                onClick: copy,
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_mui_icons_material_ContentCopy__WEBPACK_IMPORTED_MODULE_9___default()), {
                                                    className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default().smallIcon)
                                                })
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default().copyHidden),
                                                children: copyLabel
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default().hoverButton),
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default().smallButton),
                                                id: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default().explore),
                                                onClick: explore,
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_mui_icons_material_ArrowOutward__WEBPACK_IMPORTED_MODULE_11___default()), {
                                                    className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default().smallIcon)
                                                })
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default().exploreHidden),
                                                children: "explore"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_mui_material_Typography__WEBPACK_IMPORTED_MODULE_4___default()), {
                        id: "modal-modal-title",
                        variant: "h6",
                        component: "h2",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                            className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_14___default().accountModalText),
                            children: [
                                "ETH Balance: ",
                                ethBalance
                            ]
                        })
                    }),
                    pendingTxs.size != 0 && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                children: "Pending transactions:"
                            }),
                            [
                                ...pendingTxs
                            ].map((tx)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    children: tx
                                }))
                        ]
                    })
                ]
            })
        })
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1984:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ header_ConnectButton)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./context/wallet.js
var wallet = __webpack_require__(2817);
// EXTERNAL MODULE: external "@mui/material/styles"
var styles_ = __webpack_require__(8442);
// EXTERNAL MODULE: ./components/header/IdentIcon.jsx
var IdentIcon = __webpack_require__(8510);
// EXTERNAL MODULE: ./components/header/style/Header.module.css
var Header_module = __webpack_require__(3722);
var Header_module_default = /*#__PURE__*/__webpack_require__.n(Header_module);
;// CONCATENATED MODULE: external "@mui/icons-material/KeyboardArrowDown"
const KeyboardArrowDown_namespaceObject = require("@mui/icons-material/KeyboardArrowDown");
var KeyboardArrowDown_default = /*#__PURE__*/__webpack_require__.n(KeyboardArrowDown_namespaceObject);
;// CONCATENATED MODULE: external "@mui/lab/LoadingButton"
const LoadingButton_namespaceObject = require("@mui/lab/LoadingButton");
// EXTERNAL MODULE: external "@mui/material/Button"
var Button_ = __webpack_require__(3819);
;// CONCATENATED MODULE: external "@mui/icons-material/Save"
const Save_namespaceObject = require("@mui/icons-material/Save");
;// CONCATENATED MODULE: external "@mui/material/CircularProgress"
const CircularProgress_namespaceObject = require("@mui/material/CircularProgress");
var CircularProgress_default = /*#__PURE__*/__webpack_require__.n(CircularProgress_namespaceObject);
;// CONCATENATED MODULE: ./components/header/ConnectButton.jsx











const theme = (0,styles_.createTheme)({
    palette: {
        neutral: {
            main: "#64748B",
            contrastText: "#fff"
        }
    }
});
const ConnectButton = ({ handleOnClick  })=>{
    const { account , pendingTxs  } = (0,wallet/* useWalletContext */.t)();
    return account ? pendingTxs.size != 0 ? /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
        className: (Header_module_default()).ConnectButton,
        style: {
            display: "flex"
        },
        onClick: handleOnClick,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx((CircularProgress_default()), {
                sx: {
                    p: 1
                },
                size: 40
            }),
            " ",
            /*#__PURE__*/ jsx_runtime_.jsx("span", {
                children: "Transaction Pending..."
            })
        ]
    }) : /*#__PURE__*/ jsx_runtime_.jsx("button", {
        className: (Header_module_default()).ConnectButton,
        onClick: handleOnClick,
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            style: {
                display: "flex",
                alignItems: "center"
            },
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx(IdentIcon/* default */.Z, {}),
                /*#__PURE__*/ jsx_runtime_.jsx("p", {
                    className: (Header_module_default()).accountAddress,
                    children: account.slice(0, 5) + "..." + account.slice(-4)
                }),
                /*#__PURE__*/ jsx_runtime_.jsx((KeyboardArrowDown_default()), {})
            ]
        })
    }) : /*#__PURE__*/ jsx_runtime_.jsx("button", {
        className: (Header_module_default()).ConnectButton,
        onClick: handleOnClick,
        children: "Connect to your wallet"
    });
};
/* harmony default export */ const header_ConnectButton = (ConnectButton);


/***/ }),

/***/ 6557:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _static_images_logo_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5423);
/* harmony import */ var _header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(3722);
/* harmony import */ var _header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _Wallet_connectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9459);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _api_contract__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(9480);
/* harmony import */ var _context_wallet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2817);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1982);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ethers__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _ConnectButton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1984);
/* harmony import */ var _AccountModal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2818);
/* harmony import */ var _pool_contract_poolContract__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(3757);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_AccountModal__WEBPACK_IMPORTED_MODULE_8__, _pool_contract_poolContract__WEBPACK_IMPORTED_MODULE_9__]);
([_AccountModal__WEBPACK_IMPORTED_MODULE_8__, _pool_contract_poolContract__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);












if (false) { var jazzicon; }
const Header = ()=>{
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();
    const [accountModalOpen, setAccountModalOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { account , setAccount , pendingTxs , setPendingTxs , chainId , setChainId  } = (0,_context_wallet__WEBPACK_IMPORTED_MODULE_5__/* .useWalletContext */ .t)();
    const useToHome = ()=>{
        router.push("/");
    };
    const clickConnectButton = async ()=>{
        if (!account) {
            await (0,_Wallet_connectors__WEBPACK_IMPORTED_MODULE_3__/* .connectWallet */ .UP)();
        } else {
            setAccountModalOpen(true);
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        window.ethereum.on("accountsChanged", function(accounts) {
            if (accounts[0] == undefined) {
                setAccount(null);
            } else {
                setAccount(accounts[0]);
            }
        });
        async function readExistingWalletAddress() {
            let address = await (0,_Wallet_connectors__WEBPACK_IMPORTED_MODULE_3__/* .readWallet */ .z)();
            if (address) setAccount(address);
        }
        readExistingWalletAddress();
        (0,_api_contract__WEBPACK_IMPORTED_MODULE_10__/* .checkChainId */ .s)(setChainId);
    });
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (account != null) {
            window.ethereum.on("networkChanged", function(networkId) {
                if (chainId != networkId) {
                    setChainId(networkId);
                }
            });
        }
    }, [
        account
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_11___default().container),
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_11___default().logo),
                    onClick: useToHome,
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                        src: _static_images_logo_png__WEBPACK_IMPORTED_MODULE_2__/* ["default"].src */ .Z.src,
                        alt: "hypex-logo"
                    })
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_header_style_Header_module_css__WEBPACK_IMPORTED_MODULE_11___default().right),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_ConnectButton__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z, {
                        handleOnClick: clickConnectButton
                    }),
                    accountModalOpen && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_AccountModal__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, {
                        setAccountModalOpen: setAccountModalOpen
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Header);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8510:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Identicon)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _context_wallet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2817);



if (false) { var jazzicon; }
function Identicon() {
    const avatarRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();
    const { account  } = (0,_context_wallet__WEBPACK_IMPORTED_MODULE_2__/* .useWalletContext */ .t)();
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
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
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        ref: avatarRef
    });
}


/***/ }),

/***/ 8484:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6764);
/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_header_Header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6557);
/* harmony import */ var _web3_react_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8054);
/* harmony import */ var _web3_react_core__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_web3_react_core__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var web3__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8519);
/* harmony import */ var web3__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(web3__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _context_wallet__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2817);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8442);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_mui_material_styles__WEBPACK_IMPORTED_MODULE_7__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_header_Header__WEBPACK_IMPORTED_MODULE_2__]);
_components_header_Header__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];








function getLibrary(provider) {
    return new (web3__WEBPACK_IMPORTED_MODULE_4___default())(provider);
}
const THEME = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_7__.createTheme)({
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
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_web3_react_core__WEBPACK_IMPORTED_MODULE_3__.Web3ReactProvider, {
        getLibrary: getLibrary,
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_context_wallet__WEBPACK_IMPORTED_MODULE_6__/* .WalletProvider */ .n, {
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material_styles__WEBPACK_IMPORTED_MODULE_7__.ThemeProvider, {
                theme: THEME,
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((next_head__WEBPACK_IMPORTED_MODULE_5___default()), {
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("title", {
                                children: "Hypex"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                                name: "description",
                                content: "Generated by create next app"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("link", {
                                rel: "icon",
                                href: "/favicon.ico"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("link", {
                                rel: "preconnect",
                                href: "https://fonts.googleapis.com"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("link", {
                                rel: "preconnect",
                                href: "https://fonts.gstatic.com",
                                crossOrigin: "true"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("link", {
                                href: "https://fonts.googleapis.com/css2?family=Poppins&display=swap",
                                rel: "stylesheet"
                            })
                        ]
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_header_Header__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z, {}),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
                        ...pageProps
                    })
                ]
            })
        })
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6764:
/***/ (() => {



/***/ }),

/***/ 3987:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/icons-material/ArrowOutward");

/***/ }),

/***/ 9438:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/icons-material/ChevronRight");

/***/ }),

/***/ 6843:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/icons-material/ContentCopy");

/***/ }),

/***/ 8768:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/icons-material/PowerSettingsNew");

/***/ }),

/***/ 19:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/material/Box");

/***/ }),

/***/ 3819:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/material/Button");

/***/ }),

/***/ 9564:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/material/Modal");

/***/ }),

/***/ 7163:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/material/Typography");

/***/ }),

/***/ 8442:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/material/styles");

/***/ }),

/***/ 9716:
/***/ ((module) => {

"use strict";
module.exports = require("@uniswap/sdk");

/***/ }),

/***/ 8054:
/***/ ((module) => {

"use strict";
module.exports = require("@web3-react/core");

/***/ }),

/***/ 1982:
/***/ ((module) => {

"use strict";
module.exports = require("ethers");

/***/ }),

/***/ 2424:
/***/ ((module) => {

"use strict";
module.exports = require("jsbi");

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

/***/ }),

/***/ 9766:
/***/ ((module) => {

"use strict";
module.exports = import("bignumber.js");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [25], () => (__webpack_exec__(8484)));
module.exports = __webpack_exports__;

})();