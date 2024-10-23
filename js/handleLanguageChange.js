const selectWrapper = document.querySelector('.language-select-wrapper');
const enLink = document.querySelector('li.en a');
const cnLink = document.querySelector('li.cn a');
const openArrow = document.querySelector('.selector-open');
const closedArrow = document.querySelector('.selector-closed');

/* English to chinese mappings */
const pageMappings = {
  '/': '/cn/',
  '/builders/': '/cn/builders/',
  '/builders/ethereum/libraries/': '/cn/builders/libraries/',
  '/builders/ethereum/libraries/ethersjs/':
    '/cn/builders/libraries/ethersjs/',
  '/builders/ethereum/libraries/ethersrs/':
    '/cn/builders/libraries/ethersrs/',
  '/builders/ethereum/libraries/viem/': '/cn/builders/libraries/viem/',
  '/builders/ethereum/libraries/web3js/': '/cn/builders/libraries/web3js/',
  '/builders/ethereum/libraries/web3py/': '/cn/builders/libraries/web3py/',
  '/builders/ethereum/dev-env/': '/cn/builders/dev-env/',
  '/builders/ethereum/dev-env/hardhat/': '/cn/builders/dev-env/hardhat/',
  '/builders/ethereum/dev-env/foundry/': '/cn/builders/dev-env/foundry/',
  '/builders/ethereum/dev-env/remix/': '/cn/builders/dev-env/remix/',
  '/builders/ethereum/dev-env/tenderly/': '/cn/builders/dev-env/tenderly/',
  '/builders/ethereum/dev-env/thirdweb/': '/cn/builders/dev-env/thirdweb/',
  '/builders/ethereum/dev-env/openzeppelin/contracts/':
    '/cn/builders/dev-env/oz-contracts/',
  '/builders/integrations/': '/cn/builders/integrations/',
  '/builders/integrations/wallets/metamask/':
    '/cn/builders/integrations/metamask/',
  '/builders/integrations/wallets/particle-network/':
    '/cn/builders/integrations/particle-network/',
  '/builders/integrations/wallets/walletconnect/':
    '/cn/builders/integrations/walletconnect/',
  '/tutorials/': '/cn/tutorials/',
  '/tutorials/': '/cn/tutorials/eth-api/',
  '/tutorials/eth-api/how-to-build-a-dapp/':
    '/cn/tutorials/eth-api/how-to-build-a-dapp/',
  '/tutorials/eth-api/batch-approve-swap/': '/cn/tutorials/eth-api/batch-approve-swap/',
  '/tutorials/eth-api/call-permit-gasless-txs/':
    '/cn/tutorials/eth-api/call-permit-gasless-txs/',
};

const processWindowLocation = (pathname, origin) => {
  let displaySelector = false;
  for (const [key, value] of Object.entries(pageMappings)) {
    if (key === pathname || value === pathname) {
      // Set paths
      enLink.href = origin + key;
      cnLink.href = origin + value;

      // Update flag to display the language selector
      displaySelector = true;
    }
  }

  if (displaySelector) {
    selectWrapper.classList.add('display');
  } else {
    const removeSelector = selectWrapper.classList.contains('display');
    if (removeSelector) {
      selectWrapper.classList.remove('display');
    }
  }
};

// With the navigation.instant feature of mkdocs, when navigating between pages they aren't reloaded.
// So, we need to listen for page changes and if we are on one of the pages where a CN page exists,
// we need to render the language selector.
window.location$.subscribe((newLocation) => {
  const { pathname, origin } = newLocation;
  processWindowLocation(pathname, origin);
});

// On page load, check the window location and see if we need to add the language selector
const { pathname } = window.location;
processWindowLocation(pathname, origin);

// Add event listeners
selectWrapper.addEventListener('click', () => {
  selectWrapper.classList.toggle('active');
  openArrow.classList.toggle('active');
  closedArrow.classList.toggle('active');
});
