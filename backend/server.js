require('dotenv').config();

const app = require('./src/app.js');
const ConnectDB = require('./src/db/db.js');


const PORT = process.env.PORT || 3000;


ConnectDB();



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});