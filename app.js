const express = require('express');
const app = express();

require("./startup/logining.js")();
require("./startup/routes.js")(app);
require("./startup/DB.js")(app);


  


