const expect = require("chai").expect;
const axios = require("axios");
const index = require("../index");
const Web3 = require("web3");

const MockAdapter = require("axios-mock-adapter");
const mock = new MockAdapter(axios);
