require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

const PORT = 3000;

var mysql = require("mysql");
var session = require("express-session");
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
                    connection.query(
                        "INSERT INTO users(username, password, email) VALUES (?, ?, ?)",
                        [username, password, email],
                        function (error, results, fields) {
                            console.log("new Row Id:" + results.insertId);
                            response.render("register.ejs", {
                                registerSuccesful: true,
                            });
                            response.end();
                        }
                    );
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
                    response.render("login.ejs", {
                        isLoggedIn: true,
                        username: username,
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
	
	response.render('adminPage.ejs');
	 
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
