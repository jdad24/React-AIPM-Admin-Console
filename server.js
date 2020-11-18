const express = require('express')
const app = express()
const cookie_parser = require('cookie-parser')
const path = require('path')
const session = require('express-session')
var bodyParser = require('body-parser');

const PORT = process.env.port || 3000
const publicPath = path.join(__dirname, "admin-ui", "build")

const user = {
    username: "gscuser",
    password: "gscind"
}

// app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookie_parser())

app.use(session({
    key: 'user_sid',
    secret: 'credentials',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 300000
    }
}))

app.use('/', (req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        console.log("Clear cookie")
        res.clearCookie('user_sid')
    }
    next()
})

app.get('/', (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/settings')
    } else {
    res.redirect('/login')
    }
})

app.use(express.static(publicPath))

app.get('/login', (req, res, next) => {
    console.log("login")
        if(req.session.user && req.cookies.user_sid) {
            res.redirect('/settings')
        } else {
            console.log(__dirname)
            res.sendFile(__dirname + '/admin-ui/build/index.html')
        }
    })

    app.post('/login', (req, res, next) => {
        console.log(req)
        var username = req.body.username
        var password = req.body.password

        console.log(username)
        console.log(password)

        if((username==user.username) && (password==user.password)) {
            req.session.user = {
                username: username,
                password: password
            }
            res.redirect('/settings')
            console.log("Login Success")
        } else {
            res.redirect('/login')
            console.log("Login Error")
        }

    })

app.get('/settings', (req, res, next) => {
    if(req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/admin-ui/build/index.html')
        console.log("Settings success")
    } else {
        console.log("Settings error")
        res.redirect('/login')
    }
})

// app.get('/logout', (req, res, next) => {
//     res.redirect('/login')
// })

app.listen(PORT, () => {
    console.log("Admin UI Server Running on Port: ", PORT)
})
