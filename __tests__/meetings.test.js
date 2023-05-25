require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
const db = require("../models/db");
const resetDB = require("../data/resetDB");
const getToken = require("../utils/generateTokens");
let adminToken = "";
let userToken = "";
let unsignedToken = "";
