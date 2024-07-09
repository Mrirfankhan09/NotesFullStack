require('dotenv').config()
const express = require('express');
const cors = require('cors');
const notesRouter = require('./routes/notes');


const server = express();

server.use(express.json());
const corsOptions = {
  origin: 'https://notes-backend-i48x64vlp-mrirfankhan09s-projects.vercel.app',
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

server.use(cors(corsOptions));
server.use('/notes',notesRouter);
const mongoose = require('mongoose');

main().catch(err => console.log(err));
// console.log(process.env.MONGO_URL,process.env.PUBLIC_DIR,process.env.PORT)
//'mongodb://127.0.0.1:27017/notesapp'
async function main() {
  await mongoose.connect(process.env.MONGO_URL);

  // use `await mongoose.connect('');` if your database has auth enabled
  console.log('server connected')
}



server.listen(process.env.PORT,()=>{
    console.log('server started')
})
