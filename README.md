[![Known Vulnerabilities](https://snyk.io/test/github/joseabraham/eprezto-yappy-sdk/badge.svg)](https://snyk.io/test/github/snyk/goof)

# EPREZTO - YAPPY SDK

This is the repository for Yappy's payment button nodejs client library as ported by Eprezto's team. 

Yappy is a payment button and wallet in Panama developed by Banco General. 

At Eprezto we use Yappy actively, the SDK was not available in NodeJS at the time of this release so we decided to port it from their PHP SDK and share it with the community.

## Installation
```
npm install eprezto-yappy
```

## Updating
Please remember to check the changelog for important information whenever updating to the latest version! BG might update their endpoints from time to time so this might affect this SDK.

## Notes and Recommendations 
* Use environment variables for your credentials.
* merchantID and secretToken are provided by BG only for business accounts.
* This SDK is for backend use (NodeJS)
* Include in the URLS the orderId such as https://yourdomain.com/checkout-success/12345 so that your frontend knows which order is being confirmed.
* Don't pass query-strings or search params as  RFC 3986 is not directly supported in JS yet and it is not correctly converted when sending to Yappy.
* There are no webhooks yet, it'd be a nice to have whenever the Yappy team adds them, this could avoid several issues related to missed redirects. 

## How does Yappy work
1.  User clicks on Yappy Button
2.  Frontend Sends the request to NodeJS server with parameters 
3.  This SDK receives the parameters and generates a redirect URL
4.  Frontend receives the URL and redirects the user to Yappy's payment portal
5.  User inputs their phone number and receive a push notification at Yappy's app
6.  User accepts the payment at Yappy's app and is redirected to your site

## Parameters
```
secretToken : PROVIDED BY BG,
merchantId :  PROVIDED BY BG
successUrl :  URL WHERE THE USER IS REDIRECTED ON SUCCESSFUL PAYMENT
failUrl :     URL WHERE THE USER IS REDIRECTED ON A FAILED PAYMENT
domainUrl :   DOMAIN NAME OF YOUR SITE
checkoutUrl : CHECKOUT URL WHERE THE USER INITIATES THE PAYMENT
sandbox :     SANDBOX MODE [yes, no]
```

## API overview
You can interact with the api through Yappy.Client instance
```javascript
var Yappy = require('eprezto-yappy');

var yappy = new Yappy.Client({
  secretToken : process.env.YAPPY_SECRET_TOKEN,
  merchantId : process.env.YAPPY_MERCHANT_ID,
  successUrl : process.env.YAPPY_SUCCESS_URL,
  failUrl : process.env.YAPPY_FAIL_URL,
  domainUrl : process.env.YAPPY_DOMAIN_URL,
  checkoutUrl : process.env.YAPPY_CHECKOUT_URL,
  sandbox : process.env.YAPPY_SANDBOX,
})
```
Generate the payment link:

```javascript

var paymentData = {
  orderId : 12345,
  total : 10,
  subTotal : 9,
  taxes : 1
}

//Generate the payment link
yappy.generate_payment_link(paymentData)
.then(function(response){
    let redirectUrl = response.redirectUrl
    return redirectUrl
})

// Returns URL with signed parameters
{
 redirectUrl: "YAPPY_REDIRECT_URL",
 status: true 
}

```
