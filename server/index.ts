import * as express from 'express'
import * as bodyParser from 'body-parser';
import * as os from 'os'
import { ENDPOINTS, PORT } from '../src/constants';
import * as cors from 'cors'

const app = express();
// require('physical-cpu-count')
var corsOptions = {
    origin: 'http://localhost:1234',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

app.use(bodyParser.json());
app.use(express.static('server'));

const cpus = os.cpus().length

app.get(`/${ENDPOINTS.getCpuAverage}`, async (req, res) => {
    res.send({ load: os.loadavg()[0] / cpus })
})

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`CPU app listening on port ${PORT}!`)
});
