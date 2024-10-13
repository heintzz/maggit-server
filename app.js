const express = require('express');
const bodyParser = require('body-parser');
const notificationRoutes = require('./routes/notificationRoutes');
const tokenRoutes = require('./routes/tokenRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api/v1', notificationRoutes);
app.use('/api/v1', tokenRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
