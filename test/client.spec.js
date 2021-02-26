'use strict';
var Fixtures = require('./fixtures.js');

var expect = require('chai').expect;


describe('Yappy module',function(){


	it('Should create an instance of the client',function(){

			var client = Fixtures.getNewClientInstance();
			
			expect(client).to.not.be.an('undefined');
	});


	it('Should be able to generate JWT TOKEN and generate the Yappy redirection URL ',function(){
		// This test covers automatic re-authentication. For this reason we are increasing the default timeout time
		this.timeout(6000);
		var client = Fixtures.getNewClientInstance();
		var orderData = Fixtures.orderData;

		return client.generate_payment_link(orderData)
		.then(function(response){
			console.log("response", response)
			expect(response.status).to.equal(true);
		})
		.catch(function(response){
			console.log("response", response)
			expect(false).to.be.true;
		})


	})

})