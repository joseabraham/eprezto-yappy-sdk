/*
 *	EPREZTO YAPPY NodeJS SDK
 *   	https://eprezto.com
 *
 *	Copyright (c) 2021 Eprezto Tech
 *
 *	For informations email us at jose@eprezto.com
 *
 */

"use strict"

var path = require('path');

// Module
var Yappy = {};

// REST client
Yappy.Client = require(path.join(__dirname,'src','client'))

module.exports = Yappy;
