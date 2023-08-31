const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // This will allow any domain to access your API

// ... your other middleware and routes
app.listen(3000);