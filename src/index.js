import  express from 'express'
import router from './routes/index.js';
import cors from 'cors';
import 'dotenv/config'
import path from "path"
const app = express()
const port = 3001
const __dirname = path.resolve();

// use modules
app.use(express.json())
app.use("/", router);
app.use(cors)
app.set("view engine", "ejs");
app.set("views", __dirname + "/src/views");

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

