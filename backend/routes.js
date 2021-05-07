const express = require("express");
const router = express.Router();
const apis = require("./apis");

router.get("/getProduct", extraApis.getProduct);
