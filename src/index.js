import  express from 'express'
import router from './routes/index.js';
import cors from 'cors';
import 'dotenv/config'

const app = express()
const port = 3001
app.use(express.json())
app.use("/", router);
app.use(cors)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

