const express = require('express');
const db = require('./config/db');
const check = require('express-validator').check;
const url = require('url');

const { connectDB } = require('./config/db');

//Connect Database
connectDB();