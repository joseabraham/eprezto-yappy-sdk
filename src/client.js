module.exports = (function () {
  'use strict'

  var axios = require('axios')
  var CryptoJS = require('crypto-js')
  var atob = require('atob');
  /*
   *  [Client's instance]
   *
   *  @param {string} config.secretToken Yappy's secret token
   *  @param {string} config.merchantId  Yappy's merchantid
   *  @param {string} config.successUrl  Yappy's successUrl
   *  @param {string} config.failUrl  Yappy's failUrl
   *  @param {string} config.domainUrl  Yappy's domainUrl
   *  @param {string} config.checkoutUrl  Yappy's checkoutUrl
   *  @param {string} config.sandbox  Yappy's sandbox (yes,no)
   */
  function Client (config) {
    
    this.secretToken = config.secretToken;
    this.merchantId = config.merchantId;
    this.successUrl = config.successUrl;
    this.failUrl = config.failUrl;
    this.domainUrl = config.domainUrl;
    this.checkoutUrl = config.checkoutUrl;
    this.sandbox = config.sandbox; 

    //URL ENDPOINT TO GET JWT TOKEN
    this.MAIN_URL = 'https://pagosbg.bgeneral.com/validateapikeymerchand'
  }

  /*
   *
   *  @returns {string} The base url for yappy redirection
   *  e.g. https://pagosbg.bgeneral.com?sbx=no&donation=no&checkoutUrl=https://eprezto.com/checkout&signature=af31e41846b745612bd8974b3e5d6d9ffe0547884ccc6078990abbceafa6d790&merchantId=2298f59dfae0de34e1e7b21fdd39dcd4&total=3&subtotal=2&taxes=1&paymentDate=1614311638549&paymentMethod=YAP&transactionType=VEN&orderId=123475&successUrl=https%3A%2F%2Feprezto.com%2Fcheckout-success&failUrl=https%3A%2F%2Feprezto.com%2Fcheckout-fail&domain=https%3A%2F%2Feprezto.com&aliasYappy=&platform=desarrollopropiophp&jwtToken=eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZHQ00ifQ.CfAbi7OHEghhbfF7PFWwWXEuBsHCYrXW_TxSRD-62OKsRWFqkaofcSPhWBI4xt1bY7JKmnUllgs-9BGXa0r6aQYSBKxSbm1_6U7F1iSGnBXdmO4XrRdSpCI7oJAp2PEI3Ywm1YYjjookOQlZxb2V8AYz0aNhMOtFWcqNafuH2i4.RsnFfq4CTmVLIsBM.akKI2ZpotyjbfohjsPHeICqUSsSiXw417unb7BC7RcMjr6bvm50YpjKXxKFOn3-aYDaoAw2j7gZSUnjdm525YhUUZnWKEaTf945JiSWXvvT0.Nef24KXhdEhw1l4fYLs43g
   */
  Client.prototype.generate_payment_link = async function (data) {
    let _this = this
    let orderId = data.orderId;
    let total = data.total;
    let subTotal = data.subTotal;
    let taxes = data.taxes;
    let paymentDate = Date.now();        
    const decodedSecret = atob(this.secretToken);    
    let secret = decodedSecret.split('.');
    let merchantSecret = secret[1];

    let body = {
      merchantId: this.merchantId,
      urlDomain: this.domainUrl
    };

    let headers = {
      headers: {
        'x-api-key': merchantSecret,
        'Content-Type': 'application/json',
        version: 'P1.0.0',
      },
    };

    try {
      let postReq = await axios
        .post(this.MAIN_URL, body, headers)
        .then(r => r)
        .catch(e => new Error(e));        

      if (postReq.data.success) {
        let jwtToken = postReq.data.accessToken;           
        let redUrl = _this.redirectUrl({
          jwtToken,
          orderId,
          total,
          subTotal,
          taxes,
          paymentDate,              
          }
        );
        return {
          "redirectUrl": redUrl,
          "status": true
        };    
      }else{
         return new Error("Error en llamado JWT")
      }
    } catch(e){            
      return new Error("Error en llamado a Yappy JWT")
    }
  }

  /*
  * Generates an the URL that users should be redirected to Yappy
  *
  * @return {String}
  */

  Client.prototype.redirectUrl = function (data) {

     let token = data.jwtToken;
     let orderId = data.orderId;
     let total = data.total;
     let subTotal = data.subTotal;
     let taxes = data.taxes;
     let paymentDate = data.paymentDate;
     let sandbox = this.sandbox;
     let successUrl = this.successUrl;
     let failUrl = this.failUrl;
     let domainUrl = this.domainUrl;
     let checkoutUrl = this.checkoutUrl;
     let merchantId = this.merchantId;  
     let secretToken = this.secretToken;   

     let val = atob(secretToken);
     let secret = val.split('.');         
     let totString =
       total.toFixed(2).toString() +
       merchantId.toString() +
       subTotal.toFixed(2).toString() +
       taxes.toFixed(2).toString() +
       paymentDate +
       'YAP' +
       'VEN' +
       orderId +
       successUrl +
       failUrl +
       domainUrl;    
         
     var hash_signature = CryptoJS.HmacSHA256(totString, secret[0]);
          
     var searchParametersData = {
       merchantId: merchantId,
       total: total,
       subtotal: subTotal,
       taxes: taxes,
       paymentDate: paymentDate,
       paymentMethod: 'YAP',
       transactionType: 'VEN',
       orderId: orderId,      
       successUrl: successUrl,
       failUrl: failUrl,
       domain: domainUrl,       
       aliasYappy: '',
       platform: 'desarrollopropiophp',
       jwtToken: token,
     };
     
     var searchParameters = new URLSearchParams();
   
     Object.keys(searchParametersData).forEach(function(parameterName) {
       searchParameters.append(parameterName, searchParametersData[parameterName]);
     });            
     return `https://pagosbg.bgeneral.com?sbx=${sandbox}&donation=no&checkoutUrl=${checkoutUrl}&signature=${hash_signature}&${searchParameters}`;
  }

  return Client
})()
