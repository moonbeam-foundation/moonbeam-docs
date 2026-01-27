require('dotenv').config();
const ethers = require('ethers');
const {
  PaymasterMode,
  createSmartAccountClient,
} = require('@0xgasless/smart-account');
