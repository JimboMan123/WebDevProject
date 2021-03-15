require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const nodemailer = require("nodemailer");

const PORT = 3000;

var mysql = require("mysql");
var session = require("express-session");
const { error } = require("console");
app.set("view engine", "ejs");

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DBNAME,
});

connection.connect(function (err) {
    if (err) {
        return console.error("error: " + err.message);
    }

    console.log("Connected to the MySQL server.");

    connection.query("SELECT * FROM users", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});

app.get("/", function (request, response) {
    if (request.session.loggedin) {
        response.render("index.ejs", {
            isLoggedIn: true,
            username: request.session.username,
            isAdmin : request.session.isAdmin
        });
    } else {
        response.render("index.ejs");
    }
    response.end();
});

app.get("/index", function (request, response) {
    if (request.session.loggedin) {
        response.render("index.ejs", {
            isLoggedIn: true,
            username: request.session.username,
            isAdmin : request.session.isAdmin
        });
    } else {
        response.render("index.ejs");
    }
    response.end();
});

app.get("/cart", function (request, response) {
    if (request.session.loggedin) {
        response.render("cart.ejs", {
            isLoggedIn: true,
            username: request.session.username,
        });
    } else {
        response.render("cart.ejs");
    }
    response.end();
});

app.get("/aboutUs", function (request, response) {
    response.sendFile((__dirname = "/public/views/aboutUs.ejs"));
    if (request.session.loggedin) {
        response.render("aboutUs.ejs", {
            isLoggedIn: true,
            username: request.session.username,
        });
    } else {
        response.render("aboutUs.ejs");
    }
    response.end();
});

app.post("/", (req, res) => {
    console.log(req.body);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "mailAdress@gmail.com",
            pass: "password",
        },
    });

    const mailOptions = {
        from: req.body.email,
        to: "emil.assarsson@hotmail.se",
        subject: `Message from ${req.body.email}: ${req.body.subject}`,
        text: req.body.message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send("error");
        } else {
            console.log("Email sent: " + info.response);
            res.send("success");
        }
    });
});

app.get("/phones", function (request, response) {
    if (request.session.loggedin) {
        response.render("phones.ejs", {
            isLoggedIn: true,
            username: request.session.username,
        });
    } else {
        response.render("phones.ejs");
    }
    response.end();
});

app.get("/computers", function (request, response) {
    if (request.session.loggedin) {
        response.render("computers.ejs", {
            isLoggedIn: true,
            username: request.session.username,
        });
    } else {
        response.render("computers.ejs");
    }
    response.end();
});

app.get("/iphone12", function (request, response) {
    if (request.session.loggedin) {
        response.render("phone1.ejs", {
            isLoggedIn: true,
            username: request.session.username,
        });
    } else {
        response.render("phone1.ejs");
    }
    response.end();
});

app.get("/tv", function (request, response) {
    if (request.session.loggedin) {
        response.render("tv.ejs", {
            isLoggedIn: true,
            username: request.session.username,
        });
    } else {
        response.render("tv.ejs");
    }
    response.end();
});

app.get("/login", function (request, response) {
    response.render("login.ejs");

    response.end();
});

app.get("/logout", function (request, response) {
    request.session.destroy();

    response.render("index.ejs");

    response.end();
});

app.get("/register", function (request, response) {
    response.render("register.ejs");

    response.end();
});

app.post("/registerAction", function (request, response) {
    var username = request.body.name;
    var password = request.body.password;
    var email = request.body.email;
    var newAdmin = request.body.newAdmin;
    var isAdmin = request.session.isAdmin;


    console.log(username);
    console.log(password);
    console.log(email);

    if (username && password && email) {
        connection.query(
            "SELECT * FROM users WHERE email = ? ",
            [email],
            function (error, results, fields) {
                if (results.length > 0) {
                    response.render("register.ejs", {
                        registerSuccesful: false,
                    });
                    response.end();
                } else {

                    if(isAdmin){
                        if(newAdmin=="1"){
                            connection.query(
                                "INSERT INTO users(username, password, email, isAdmin) VALUES (?, ?, ?, ?)",
                                [username, password, email, newAdmin],
                                function (error, results, fields) {
                                    if(error){
                                        console.log(error);
                                    }
                                   // console.log("new Row Id:" + results.insertId);
                                    response.render("adminPage.ejs", {
                                        registerSuccesful: true,
                                    });
                                    response.end();
                                }
                            );
                    } else{
                        connection.query(
                            "INSERT INTO users(username, password, email) VALUES (?, ?, ?)",
                            [username, password, email],
                            function (error, results, fields) {
                                if(error){
                                    console.log(error);
                                }
                               // console.log("new Row Id:" + results.insertId);
                                response.render("adminPage.ejs", {
                                    registerSuccesful: true,
                                });
                                response.end();
                            }
                        );
                    }
                    } else{
                        connection.query(
                            "INSERT INTO users(username, password, email) VALUES (?, ?, ?)",
                            [username, password, email],
                            function (error, results, fields) {
                                if(error){
                                    console.log(error);
                                }
                               // console.log("new Row Id:" + results.insertId);
                                response.render("register.ejs", {
                                    registerSuccesful: true,
                                });
                                response.end();
                            }
                        );
                    }
                }
            }
        );
    } else {
        response.send("Please enter Username and Password!");
        response.end();
    }
});

app.post("/auth", function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    console.log(username);
    console.log(password);
    if (username && password) {
        connection.query(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            [username, password],
            function (error, results, fields) {
                if (results.length > 0) {
                    request.session.loggedin = true;
                    request.session.username = username;
                    request.session.isAdmin = results[0].isAdmin;
                    response.render("login.ejs", {
                        isLoggedIn: true,
                        username: username,
                        isAdmin : results[0].isAdmin
                    });
                } else {
                    response.send("Incorrect Username and/or Password!");
                }
                response.end();
            }
        );
    } else {
        response.send("Please enter Username and Password!");
        response.end();
    }
});

app.get('/adminPage', function(request, response) {

    if (request.session.isAdmin) {
        response.render("adminPage.ejs", {
            username: request.session.username,
        });
    } else {
        response.status(403).send("You are trying to access restricted content");
    }
	
	 
response.end();
});

app.get("/getUsers",(req,res) => {
    connection.query('SELECT id, username, email, isAdmin FROM users', (err, rows) => {
        if(err) throw err;
        console.log('The data from accounts table are: \n', rows);
        res.send(rows)

       // connection.end();
    });
});

app.post("/showUserInfo",(req,res) => {

	//var { email }  = JSON.parse(req.body)
	var email   = req.body.email;
	console.log("The email is: "+ email);
    connection.query('SELECT id, username, email, isAdmin FROM users where email = ?', [email], (err, rows) => {
        if(err) throw err;
        console.log('The data from accounts table are: \n', rows);
        res.send(rows)

       // connection.end();
    });
});

app.post("/deleteUser",(req,res) => {

	//var { email }  = JSON.parse(req.body)
	var email   = req.body.email;
	console.log("The email is: "+ email);
    connection.query('DELETE FROM users WHERE email = ?', [email], (err, result) => {
        if(err) throw err;
        console.log('Affected rows: \n', result.affectedRows);
        res.send({success:true});

       // connection.end();
    });
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log("App is listening at http://localhost:" + PORT);
});
