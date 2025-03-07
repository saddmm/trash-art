import express from "express"
const app = express()
const port = process.env.PORT || 5000
import userRoutes from './routes/userRoutes.js'
import ejs from 'ejs'
import cors from 'cors'
// import fileUpload from "express-fileupload"


app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('index')
});
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(fileUpload())

app.use('/user', userRoutes)

app.use((req, res) => {
    res.status(404).send({
        status: 404,
        error: 'Not found'
    });
});


app.listen(port, () => {
    console.log(`server up and running on port ${port}`)
})