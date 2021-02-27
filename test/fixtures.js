/*
 *	Utilities for tests
 */

var Yappy = require("../index");

var Fixtures = {};

Fixtures.getNewClientInstance = function () {
  var client = new Yappy.Client({
    secretToken: process.env.YAPPY_SECRET_TOKEN,
    merchantId: process.env.YAPPY_MERCHANT_ID,
    successUrl: process.env.YAPPY_SUCCESS_URL,
    failUrl: process.env.YAPPY_FAIL_URL,
    domainUrl: process.env.YAPPY_DOMAIN_URL,
    checkoutUrl: process.env.YAPPY_CHECKOUT_URL,
    sandbox: process.env.YAPPY_SANDBOX,
  });  
  return client;
};

Fixtures.orderData = {
  orderId: 12345,
  total: 10.55,
  subTotal: 9.01,
  taxes: 1.54,
};

module.exports = Fixtures;
