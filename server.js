import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import * as xp from './model/progressBar.js';


let __dirname = path.resolve();

let user
let bar = 0

const app = express()
app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use('/model', express.static('model'))
app.use('/view', express.static('view'))

app.set('view engine', 'pug');

// xp.getUser('lyon', '/lyon/challenge-lyon-2122').then(function(result){
//     console.log(result)
//     user = result
//   }
// )


xp.getUserProgress().then(function(result) {
    // console.log(result)
    user = result
        // console.log(user["user"])
        // console.log(user[0]["user"])

})

app.get('/', (req, res) => {
    // console.log(user["user"])
    // console.log(user[1]["progress"])
    res.render(path.join(__dirname, 'index.pug'), {
        user: xp.users,
        b1A: xp.classB1A,
        b1B: xp.classB1B
    })
})

app.listen(3000, () => {
    console.log("Server up and running")
})