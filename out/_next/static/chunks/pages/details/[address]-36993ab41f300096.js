(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[468],{5904:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/details/[address]",function(){return n(5345)}])},8555:function(e,t){"use strict";t.Z={src:"/_next/static/media/eth.456457d6.png",height:80,width:80,blurDataURL:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA3UlEQVR42j2PzUrDUBSE7+ukz6Wo9QclSZNYRW0S6xsIbkQEu9OVblwluPEZBFcipZSs5rTNbcv03JR2tjPMzGecglRa8a2Up9ewx5ewcV8KvwevMcMcnprV4QX48Dzhy+uU++eghqowk5bp5Cg0wJ0I9d//gpAlz25QBxkY5VKapC92LwHfPmbc6Ou75m4EJndiTawBVz/Q6uFowXG15PvnjO0u6Dw3UXZyaWp/fufUGWfUQdpMFCbM4AiqtrbcP034OJjyoLs9uSbxU3gO7eQK9kgx9Vfp95TAGLMCsIqwA4GAy2QAAAAASUVORK5CYII=",blurWidth:8,blurHeight:8}},1895:function(e,t,n){"use strict";n.d(t,{bl:function(){return b},Pv:function(){return A},qD:function(){return _},w4:function(){return o},Vs:function(){return d},tg:function(){return c},Q$:function(){return p},xx:function(){return y}});var a=JSON.parse('[{"inputs":[{"internalType":"address","name":"coordinator","type":"address"},{"internalType":"address","name":"link","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"bytes32[]","name":"requestIds","type":"bytes32[]"}],"name":"RedeemRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"bytes32","name":"requestId","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Redeemed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"requestId","type":"bytes32"}],"name":"SwapRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"bytes32","name":"requestId","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Swaped","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"auctions","outputs":[{"internalType":"address","name":"winner","type":"address"},{"internalType":"uint256","name":"bidAmount","type":"uint256"},{"internalType":"uint256","name":"startedAt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"bid","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"cancelAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"createdAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"delta","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"duration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"endAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getTokenIds","outputs":[{"internalType":"uint256[]","name":"tokenIds_","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"nft","type":"address"},{"internalType":"uint256","name":"lockPeriod","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"},{"internalType":"bool","name":"isLinear","type":"bool"},{"internalType":"uint256","name":"delta","type":"uint256"},{"internalType":"uint256","name":"ratio","type":"uint256"},{"internalType":"uint256","name":"randomFee","type":"uint256"},{"internalType":"uint256","name":"tradingFee","type":"uint256"},{"internalType":"uint256","name":"startPrice","type":"uint256"}],"internalType":"struct PoolParams","name":"params","type":"tuple"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isLinear","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lockPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"manager","outputs":[{"internalType":"contract IAuctionLiquidPoolManager","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nft","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"randomFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ratio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"requestId","type":"bytes32"},{"internalType":"uint256","name":"randomness","type":"uint256"}],"name":"rawFulfillRandomness","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"recover","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"recoverNFTs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20Upgradeable","name":"token","type":"address"}],"name":"recoverTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"name":"redeem","outputs":[{"internalType":"bytes32[]","name":"requestIds","type":"bytes32[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"redeemers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"startAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"swap","outputs":[{"internalType":"bytes32","name":"requestId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"swapper","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"swaps","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tradingFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'),i=n(241),s=n(7918),u=n.n(s);n(9499),n(9076);let l=function(){try{return new i.Q(window.ethereum,"any")}catch(e){return console.log("No Wallet Extension Found"),null}}(),r=()=>{let e=new(u())(window.ethereum);return new e.eth.Contract(a,"0x9117808F6ebEAeaE94DBcC2255C13db607f00F22")},o=()=>r().methods.getTokenIds().call(),p=(e,t)=>r().methods.redeem(t).send({from:e,type:"0x2",maxFeePerGas:A,maxPriorityFeePerGas:_}),d=(e,t)=>r().methods.bid(e).send({from:t,type:"0x2",maxFeePerGas:A,maxPriorityFeePerGas:_}),c=(e,t)=>r().methods.swap(e).send({from:t,type:"0x2",maxFeePerGas:A,maxPriorityFeePerGas:_}),y=async e=>{try{let t=await (null==l?void 0:l.send("eth_sendTransaction",[e]));if(t)return m.Sent;return m.Failed}catch(n){return console.log(n),m.Rejected}},m={Failed:"Failed",New:"New",Rejected:"Rejected",Sending:"Sending",Sent:"Sent"},A="50000000000",_="2000000000",b={async GetCollectionStats(e){try{let t=await fetch("https://testnets-api.opensea.io/api/v1/collection/opensea-creature",{method:"GET",mode:"cors"}),n=await t.json();if(console.log("res"),console.log(n),200!==t.status&&201!==t.status)return{isSuccessful:!1,data:null,message:t.statusText};return{isSuccessful:!0,data:n,message:"successfulMessage"}}catch(a){return{isSuccessful:!1,data:null,message:"Unknown Error"}}}}},5345:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return Z}});var a=n(5893),i=n(7160),s=n.n(i),u=n(7294),l=n(1875),r=n.n(l),o={src:"/_next/static/media/azuki.fce642a5.jpeg",height:400,width:400,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAgACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAABQEBAQAAAAAAAAAAAAAAAAAABAf/2gAMAwEAAhADEAAAAJQFRv/EABsQAAIBBQAAAAAAAAAAAAAAABITABQlRGOy/9oACAEBAAE/ALfT5bw1rLoZ/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwB//8QAGhEAAQUBAAAAAAAAAAAAAAAAQQABAhESIf/aAAgBAwEBPwCDZs9K/9k=",blurWidth:8,blurHeight:8},p=n(8555),d=n(6886),c=n(9661),y=n(5697),m=n.n(y),A=n(1163),_=n(1703),b=n(44),f=n(5861),x=n(7357),h=n(1519),T=n(3321),w=n(6573),v=n.n(w),g=n(373),j=n.n(g);let C=e=>{let{nft:t,type:n,pool:i}=e,s=(0,A.useRouter)(),u=()=>{s.push("/".concat(n.toLowerCase(),"/").concat(i.address,"?id=").concat(t.tokenId))};return(0,a.jsxs)("div",{className:j().card,children:[(0,a.jsx)("div",{children:(0,a.jsx)("img",{className:j().nft_image,src:t.src})}),(0,a.jsx)(T.Z,{sx:{marginTop:2,height:60},variant:"contained",size:"large",className:"".concat(j().button," ").concat(j().purple),onClick:u,children:n})]})},I=e=>{let{pool:t,nfts:n,type:i}=e;return(0,A.useRouter)(),(0,a.jsx)(d.ZP,{container:!0,className:j().collection,children:n.map(e=>(0,a.jsx)(C,{pool:t,nft:e,type:i,item:!0},e.address))})};var P=n(5152),E=n.n(P),M=n(1895);let N=E()(()=>Promise.all([n.e(350),n.e(24),n.e(737)]).then(n.bind(n,9737)),{loadableGenerated:{webpack:()=>[9737]},ssr:!1});function D(e){let{children:t,value:n,index:i,...s}=e;return(0,a.jsx)("div",{className:v().tab_panel,role:"tabpanel",hidden:n!==i,id:"simple-tabpanel-".concat(i),"aria-labelledby":"simple-tab-".concat(i),...s,children:n===i&&(0,a.jsx)(x.Z,{sx:{p:0},children:(0,a.jsx)(f.Z,{children:t})})})}function F(e){return{id:"simple-tab-".concat(e),"aria-controls":"simple-tabpanel-".concat(e)}}D.propTypes={children:m().node,index:m().number.isRequired,value:m().number.isRequired};let S=async()=>{(0,M.w4)().then(e=>{B=[],e.map(e=>{B.push({tokenId:e})})})};function k(e){let{pool:t}=e,[n,i]=u.useState(0),s=(0,A.useRouter)();(0,u.useEffect)(()=>{S()});let l=(e,t)=>{i(t)},r=()=>{s.push("/redeem/".concat(t.address))};return(0,a.jsxs)(x.Z,{sx:{width:"100%"},children:[(0,a.jsx)(x.Z,{sx:{borderBottom:1,borderColor:"divider"},children:(0,a.jsxs)(_.Z,{value:n,textColor:"inherit",onChange:l,"aria-label":"basic tabs example",children:[(0,a.jsx)(b.Z,{label:"Trade $".concat(t.name),...F(0)}),(0,a.jsx)(b.Z,{label:"Buy NFTs",...F(1)}),(0,a.jsx)(b.Z,{label:"Your ".concat(t.name),...F(2)})]})}),(0,a.jsx)(D,{value:n,index:0,children:(0,a.jsx)(N,{})}),(0,a.jsxs)(D,{value:n,index:1,children:[(0,a.jsx)(I,{pool:t,nfts:B,type:"Auction"}),(0,a.jsx)(h.Z,{className:v().divider,variant:"middle"}),(0,a.jsxs)("div",{className:v().redeem,children:[(0,a.jsx)(T.Z,{sx:{marginTop:2,height:60},variant:"contained",size:"large",className:v().button,onClick:r,children:"Random Redeem"}),(0,a.jsx)("input",{className:v().redeemInput,value:1,type:"number"})]})]}),(0,a.jsx)(D,{value:n,index:2,children:(0,a.jsx)(I,{pool:t,nfts:B,type:"Swap"})})]})}let B=[];var Q=n(9076);let R=e=>{let{address:t}=e;(0,A.useRouter)();let[n,i]=(0,u.useState)({}),[s,l]=(0,u.useState)(null),[y,m]=(0,u.useState)([]),_={src:o.src,address:"0x9117808F6ebEAeaE94DBcC2255C13db607f00F22",name:"Azuki"};return(0,u.useEffect)(()=>{(async function(){let e=new Q.WU(Q.a_.MAINNET,"0x6B175474E89094C44Da98b954EedeAC495271d0F",18,"DAI","Dai Stablecoin"),t=await Q.HI.fetchPairData(e,Q.DX[e.chainId]),n=new Q.AW([t],Q.DX[e.chainId]);console.log(n.midPrice.toSignificant(6)),console.log(n.midPrice.invert().toSignificant(6)),l(n.midPrice.toSignificant(6))})()},[]),(0,u.useEffect)(()=>{let e=async()=>{let e=(await M.bl.GetCollectionStats()).data;e&&e.collection&&i(e.collection)};e()},[]),(0,u.useEffect)(()=>{if(!n||!s)return;let e=null!=n.stats.floor_price?n.stats.floor_price:0,t=e*s,a=n.stats.seven_day_volume,i=0!=Object.values(n.fees.seller_fees).length?Object.values(n.fees.seller_fees)[0]:0,u=n.stats.one_day_change,l=n.stats.num_owners;m([{title:"NFTs",value:n.stats.total_supply,subValue:null},{title:"Floor Price",value:e,subValue:"$ ".concat(t),coin:p.Z.src},{title:"7 Days Volume",value:a,subValue:"$ ".concat(a*t),coin:p.Z.src},{title:"Trading Fees",value:i,subValue:null},{title:"Swap Fees",value:9.734,subValue:null},{title:"Action Delta",value:9.734,subValue:null},{title:"1 Day Change ",value:u,subValue:null},{title:"NFT Holder",value:l,subValue:null}])},[n,s]),(0,a.jsxs)(d.ZP,{container:!0,className:r().container,children:[(0,a.jsxs)(d.ZP,{container:!0,className:r().upper_detail,children:[(0,a.jsxs)(d.ZP,{container:!0,className:r().detail_intro,children:[(0,a.jsx)(d.ZP,{xs:2,item:!0,children:(0,a.jsx)(c.Z,{src:n.image_url,alt:"pool-logo",sx:{width:150,height:150}})}),(0,a.jsxs)(d.ZP,{xs:10,className:r().details,item:!0,children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{children:(0,a.jsx)("p",{className:r().text,children:"NFT Auction Liquidity Pool:"})}),(0,a.jsx)("div",{children:(0,a.jsx)("p",{children:n.name})})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{children:(0,a.jsx)("p",{className:r().text,children:"NFT Contract Address:"})}),(0,a.jsx)("div",{children:(0,a.jsx)("p",{children:_.address})})]})]})]}),(0,a.jsx)(h.Z,{className:r().divider,variant:"middle"}),(0,a.jsx)(d.ZP,{container:!0,children:y.map(e=>{var t;return(0,a.jsxs)(d.ZP,{xs:2,item:!0,children:[(0,a.jsx)("p",{className:r().text,children:e.title}),(0,a.jsx)("p",{className:r().value,children:e.value}),(0,a.jsx)("p",{className:r().sub_value,children:null!==(t=e.subValue)&&void 0!==t?t:""})]},e.title)})})]}),(0,a.jsx)(d.ZP,{xs:12,className:r().user_actions,children:(0,a.jsx)(k,{pool:_})})]})};function Z(){let e=(0,A.useRouter)(),{address:t}=e.query;return(0,a.jsx)("div",{className:s().container,children:(0,a.jsx)("main",{className:s().main,children:(0,a.jsx)(R,{address:t})})})}},373:function(e){e.exports={button:"Collection_button__v1d22",purple:"Collection_purple__PvNum",nft_image:"Collection_nft_image__F46E2",card:"Collection_card__3Um2I",collection:"Collection_collection__rO_bm"}},6573:function(e){e.exports={"MuiTab-textColorInherit":"UserActions_MuiTab-textColorInherit__X5G7t",selected:"UserActions_selected__yrIdU",tab_panel:"UserActions_tab_panel__rH37O",button:"UserActions_button__E_3Sc",redeemInput:"UserActions_redeemInput__ncaCs",redeem:"UserActions_redeem__o3F6k",divider:"UserActions_divider__Csu99"}},1875:function(e){e.exports={content:"Details_content__qWKi_",title:"Details_title__6vwlW",subtitle:"Details_subtitle__SnmFA",subcontent:"Details_subcontent__fsod_",data:"Details_data__C64mQ",button:"Details_button__N_C9A",purple:"Details_purple__9lJN4",details:"Details_details__MxZXC",value:"Details_value__xs2ah",sub_value:"Details_sub_value__cbPVR",text:"Details_text__BwKXX",upper_detail:"Details_upper_detail__41KwS",detail_intro:"Details_detail_intro__dSLdZ",container:"Details_container__SrkCi",divider:"Details_divider__xnS8R",user_actions:"Details_user_actions__qVHiS"}},7160:function(e){e.exports={container:"Home_container__bCOhY",main:"Home_main__nLjiQ",footer:"Home_footer____T7K",title:"Home_title__T09hD",description:"Home_description__41Owk",code:"Home_code__suPER",grid:"Home_grid__GxQ85",card:"Home_card___LpL1",logo:"Home_logo__27_tb"}},8677:function(){},2808:function(){}},function(e){e.O(0,[301,650,895,586,774,888,179],function(){return e(e.s=5904)}),_N_E=e.O()}]);