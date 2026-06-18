const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const workflowRoutes = require('./routes/workflows');
const executionRoutes = require('./routes/executions');

app.use('/api/workflows', workflowRoutes);
app.use('/api/executions', executionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
