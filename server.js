const express = require('express');                         //Import Express framework
const helmet = require('helmet');                           //Import Helmet security protection
const session = require('express-session');                 //Import session for storing data
const app = express();
app.use(helmet());
// var MySQLStore = require('express-mysql-session')(session);
app.use(session({
    secret: "yj34uasd934nd3gfd83n5a0",
    resave: false,
    saveUninitialized: true
    // store: new MySQLStore({
    //     host: 'localhost',
    //     // port: 3000,
    //     user: 'root',
    //     password: '123456',
    //     database: 'bData'
    // })
}));
const http = require('http').Server(app);                   //Setting app to HTTP
const io = require('socket.io')(http, {wsEngine: 'ws'});    //Import Socket.io
const port = process.env.PORT || 3000;                      //Setting port
const mysql = require('mysql');                             //Import MYSQL for database
const bcrypt = require('bcrypt');                           //Import for password encryption
const ejs = require('ejs');                                 //Javascript template
const engine = require('ejs-mate');
const randomID = require("random-id");                      //Random ID creator
const bodyParser = require('body-parser');                  //To get HTML body values
const nodemailer = require('nodemailer');                   //To send Reminder emails
const schedule = require('node-schedule');                  //Schedule check for reminders
var request;                                                //HTTP request

app.use(express.static(__dirname + '/public'));
app.use('ejs', engine);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

/*
-Description : Redirect when opening website URL
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.get('/', function (req, res) {
    res.redirect('/login')
});


console.log("Server running on http://localhost:3000/");

/*
-Description : Setting up database information
*/
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'bData'
});

/*
-Description : Connecting to database
*/
con.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

http.listen(port);
/*
-Description : Setting up the email client to send reminders
*/
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

/*
-Description : Checks first minute of every hour for reminders and send emails
*/
schedule.scheduleJob('1 * * * *', function () {
    list = remindersToday();
    setTimeout(function () {
        getEmail();
    }, 500);
    setTimeout(function () {
        sendEmail()
    }, 1000);
});

var list = [];
var emailList = [];

/*
-Description : Gets users email addresses and sends email
*/
function sendEmail() {
    // console.log(emailList.length + " " + list.length)
    for (var n = 0; n < emailList.length; n++) {
        for (var k = 0; k < list.length; k++) {
            // console.log(list[k][0])
            // console.log(emailList[n][1])
            //Create email text and send email.
            if (emailList[n][1] === list[k][0]) {
                var mail = {
                    from: 'lionvstiger0987654321@gmail.com',
                    to: emailList[n][0],
                    subject: 'Reminder For Today',
                    html: "<h1>Board: " + list[k][1] + "</h1> </br> <h2>Set by: " + list[k][2] + "</h2>" +
                    "</br> <h3>Reminder For:" + list[k][3] + " " + list[k][4] + "</h3> </br><p>" + list[k][5] + "</p>" +
                    "<h4>Reminder set on: " + list[k][6] + "</h4>"
                };
                transporter.sendMail(mail, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        }
    }
    //Update the database to finalise the email has been sent.
    for (var t = 0; t < list.length; t++) {
        var sql = "UPDATE bdata.reminders SET send = true WHERE bid = '" +
            list[t][0] + "' AND time = '" + list[t][4] + "';";

        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Send true")
        })
    }
    list = [];
    emailList = [];
}

/*
-Description : Get email address of users with reminders
*/
function getEmail() {
    for (var i = 0; i < list.length; i++) {
        var id = list[i][0];
        //Gets
        var sql = "SELECT email from bdata.login WHERE username IN " +
            "(SELECT user FROM bdata.boardusers WHERE wid = '" + list[i][0] + "')";
        console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
            for (var k = 0; k < result.length; k++) {
                emailList.push([result[k].email, id])
            }
        });

        var sql = "SELECT email from bdata.login WHERE id = " +
            "(SELECT creator FROM bdata.whiteboard WHERE wid = '" + list[i][0] + "')";
        console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
            for (var j = 0; j < result.length; j++) {
                emailList.push([result[j].email, id])
            }
        });
    }
}

/*
-Description : Checks reminders within this hour
-Return : List containing users detail
*/
function remindersToday() {
    var d = new Date();
    var results = [];
    var nextHour = d.getHours() + 1;
    var sql = "SELECT bid, time FROM bdata.reminders WHERE date = '" + "2018-03-25" + "' AND time >'" +
        d.getHours() + ":" + d.getMinutes() + ":00' AND time < '" + nextHour + ":00:00'";
    // var sql = "SELECT bid, bname, username, date, time, remindtext, setTime" +
    //     " FROM bdata.reminders WHERE date = '" + "2018-03-25" + "' AND time >'" +
    //     "22:00:00' AND time < '" + "23:00:00'";

    con.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        for (var i = 0; i < result.length; i++) {
            results.push([result[i].bid, result[i].bname, result[i].username,
                result[i].date, result[i].time, result[i].remindtext,
                result[i].setTime]);
        }
    });
    return results;
}

/*
-Description : Check login details
-Parameter : 1) HTTP request, 2) HTTP response
*/
function checkLoginDetails(user, pass, req, res) {
    var queryString = "";
    if (user.indexOf('@') > 0) {
        queryString = "Select id, username, password from bdata.login where email = " + mysql.escape(user);
    } else {
        queryString = "Select id, username, password from bdata.login where username = " + mysql.escape(user);
    }
    console.log(queryString);

    con.query(queryString, function (err, result) {
        if (err) {
            console.log("SQL ERROR" + result);
            res.redirect('/login')
        }
        else if (result.length != 1) {
            console.log("login failed. found " + result.length + " users.");
            res.redirect('/login')
        } else {
            console.log(result);
            bcrypt.compare(pass, result[0].password, function (err, res) {
                if (res) {
                    req.session.idHold = result[0].id;
                    req.session.name = result[0].username;
                    console.log("id is : " + req.session.idHold);
                    console.log("name is :" + req.session.name);
                    req.session.loggedIn = true;
                }
            });
        }
    });
}

/*
-Description : Retrieve usernames of users from the keyword
-Parameter : 1) username
-Return : List containing usernames similar to the keyword
*/
function searchFriend(user) {
    var sql = "SELECT username from bdata.login where username like " +
        mysql.escape(user);
    console.log(sql);
    var friends = [];

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        for (var i = 0; i < result.length; i++) {
            // console.log(result[i].wid)
            friends.push(result[i].username)
        }
    });
    return friends;
}

/*
-Description : Search for friends of the user
-Parameter : 1) HTTP request
-Return : List containing friends of primary user
*/
function getFriends(req) {
    var sql = "SELECT friend from bdata.friends where userid = '" +
        req.session.idHold + "'";
    var friends = [];

    con.query(sql, function (err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            // console.log(result[i].wid)
            friends.push(result[i].friend)
        }
    });
    return friends;
}

/*
-Description : Retrieve collaborators of the whiteboard.
-Parameter : 1) HTTP request
-Return : List containing all the collaborators of current whiteboard.
*/
function getCollaborators(req) {
    var collabs = [];
    var sql = "SELECT user from bdata.boardusers where wid = " +
        mysql.escape(req.session.boardID);

    con.query(sql, function (err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            // console.log(result[i].user)
            collabs.push(result[i].user)
        }
    });

    return collabs;
}

/*
-Description : Retrieve whiteboards shared to the user.
-Parameter : 1) HTTP request
-Return : List containing all whiteboard shared to user.
*/
function sharedBoards(req) {
    var boards = [];
    var sql = "SELECT wid, title from bdata.boardusers where user = " +
        mysql.escape(req.session.name);
    console.log(sql)
    console.log("GETTING SHARED BOARDS")
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)
        for (var i = 0; i < result.length; i++) {
            console.log("shared list " + result[i].wid + " " + result[i].title)
            boards.push([result[i].wid, result[i].title])
        }
    });
    // console.log("SHARED BOARDS " + boards.length)
    return boards;
}

/*
-Description : Registering new user.
-Parameter : 1) Email address, 2) Username, 3) Password
*/
function createData(email, user, pass) {
    var userID = randomID(16, "aA0");
    var salt = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    console.log(salt)
    bcrypt.genSalt(salt, function (err, salt) {
        bcrypt.hash(pass, salt, function (err, hash) {
            if (err) throw err;
            // console.log(hash)
            var sql = "INSERT INTO bdata.login (id, username, email, password) values (" +
                mysql.escape(userID) + "," + mysql.escape(user) + " , " + mysql.escape(email) + " , " + mysql.escape(hash) + ")";

            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Created user");
            })
        })
    });
};

/*
-Description : Creating a new whiteboard.
-Parameter : 1) HTTP request
*/
function createBoard(req) {
    var boardID = randomID(15, "aA0");
    var date = new Date();
    var month = date.getMonth() + 1;
    console.log(boardID)
    // console.log(date.getDate(), month, date.getFullYear());
    var sql = "INSERT INTO bdata.whiteboard (wid, creator, created, openWorld, title) values (" +
        mysql.escape(boardID) + ", '" + req.session.idHold + "','" + date.getFullYear() + "-" + month + "-" + date.getDate() + "'," +
        "false, 'untitled')";
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
        }
        ;
        console.log("Created whiteboard data")
    });

    req.session.boardID = boardID;
    req.session.boardName = "untitled";
    req.session.creator = true;
}

/*
-Description : Retrieve user's whiteboard IDs.
-Parameter : 1) HTTP request
-Return : List containing all board IDs related to user
*/
function usersBoards(req) {
    var boardList = [];
    var sql = "SELECT wid,title FROM bdata.whiteboard WHERE creator = '" + req.session.idHold +
        "';";

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)
        for (var i = 0; i < result.length; i++) {
            // console.log(result[i])
            boardList.push([result[i].wid, result[i].title])
        }
    });

    return boardList;
}

/*
-Description : Retrieve whiteboard data.
-Parameter : 1) Whiteboard ID, 2) HTTP request
*/
function retrieveBoard(id, req) {
    var sql = "SELECT boarddata, title FROM bdata.whiteboard WHERE wid = '" +
        id + "';";

    con.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result[0].boarddata)
        // data = result[0].boarddata;
        req.session.boardData = result[0].boarddata;
        req.session.boardName = result[0].title;
        console.log("SET DATA FOR SESSION " + req.session.boardData)
        console.log("SET DATA FOR SESSION " + req.session.boardName)
    });
}

/*
-Description : Creating a new reminder.
-Parameter : 1) Date, 2) Time, 3)Reminder text, 4) HTTP request
*/
function addReminder(date, time, text, req) {
    var sql = "INSERT INTO bdata.reminders (bid, bname, username, date, time, remindtext)" +
        "values ('" + req.session.boardID + "','" + req.session.boardName + "','" +
        req.session.name + "','" + date + "','" + time + "'," + mysql.escape(text) + ")";

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Reminder Set")
    })
}

/*
-Description : Retrieve whiteboard title.
-Parameter : 1) HTTP request
*/
function getBoardName(req) {
    var sql = "SELECT title FROM bdata.whiteboard WHERE wid = '" +
        req.session.boardID + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        req.session.boardName = result[0].title;
    });
}

/*
-Description : Retrieve comments on shared whiteboard.
-Parameter : 1) HTTP request
-Return : List containing all comments made on certain whiteboard.
*/
function retrieveComments(req) {
    var list = [];
    var sql = "SELECT name, comment, time FROM bdata.comments WHERE wid ='" +
        req.session.guestID + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)
        for (var i = 0; i < result.length; i++) {
            list.push({
                name: result[i].name, comment: result[i].comment,
                time: result[i].time
            });
        }
    });
    return list;
}

/*
-Description : Save text chat made on whiteboard page.
-Parameter : 1) Chat text
*/
function saveChat(data) {
    var split = data.split(":");
    var sql = "INSERT INTO bdata.chat (wid, user, message) values ('" +
        request.session.boardID + "'," + mysql.escape(split[0]) + "," +
        mysql.escape(split[1]) + ")";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Added Chat");
    });
}

/*
-Description : Check if logged in user is creator for whiteboard permissions.
-Parameter : 1) HTTP request
*/
function creatorCheck(req) {
    var sql = "SELECT creator FROM bdata.whiteboard WHERE wid ='" +
        req.session.boardID + "'";
    req.session.creator = false;
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result[0].creator === req.session.idHold) {
            req.session.creator = true;
        }
    });
}

/*
-Description : Socket.io event handler for all the incoming connections.
-Parameter : 1) Socket
*/
//event handler for incoming connections
io.on('connection', function (socket) {
    //Socket.io for the chat message transfer.
    socket.on('chat message', function (msg) {
        socket.broadcast.emit('chat message', msg);
        saveChat(msg);
    });
    //Socket.io for data on whiteboard.
    socket.on('draw', function (data) {
        // console.log(data);
        socket.broadcast.emit('draw', data);
    });

    socket.on('disconnect', function () {
        console.log("User disconnected")
    });
});

/*
-Description : Save whiteboard data to database.
-Parameter : 1) Retrieved whiteboard data, 2) HTTP request
*/
function saveData(boardData, req) {
    var sql = "UPDATE bdata.whiteboard SET boarddata = '" + boardData + "' WHERE wid = '" +
        req.session.boardID + "';";
    // console.log("new data size " + boardData.length);
    // console.log("old data size " + req.session.boardData.length);

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("UPDATING WHITEBOARD")
    })
}

/*
-Description : Retrieve URLs associated with the whiteboard.
-Parameter : 1) HTTP request
-Return : List containing URLs users add to whiteboard.
*/
function retrieveURLS(req) {
    var urlValues = [];
    var sql = "SELECT url, title FROM bdata.boardurl WHERE boardid = '" +
        req.session.boardID + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            urlValues.push({url: result[i].url, title: result[i].title})
        }
    });
    for (var b = 0; b < urlValues.length; b++) {
        console.log(urlValues[b].title + " " + urlValues[b].url)
    }
    return urlValues;
}

/*
-Description : Retrieve video URLs.
-Parameter : 1) HTTP request
-Return : List containing video URLs saved to the whiteboard.
*/
function retrieveVideos(req) {
    var urlValues = [];
    var sql = "SELECT url, title FROM bdata.videos WHERE boardID = '" +
        req.session.boardID + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            urlValues.push({url: result[i].url, title: result[i].title})
        }
    });
    for (var b = 0; b < urlValues.length; b++) {
        console.log(urlValues[b].title + " " + urlValues[b].url)
    }
    return urlValues;
}

/*
-Description : Retrieve chat data associated with the whiteboard.
-Parameter : 1) HTTP request
-Return : List containing chat data.
*/
function retrieveChat(req) {
    var chatValue = [];
    var sql = "SELECT user, message FROM bdata.chat WHERE wid = '" +
        req.session.boardID + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            chatValue.push({user: result[i].user, message: result[i].message})
        }
    });
    return chatValue;
}

/*
-Description : Retrieve notifications for user.
-Parameter : 1) HTTP request
-Return : List containing notifications.
*/
function retrieveNotifications(req) {
    var notif = [];
    var sql = "SELECT notification FROM bdata.notifications WHERE userid = '" +
        req.session.name + "'";

    con.query(sql, function (err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            notif.push(result[i].notification);
        }
    });
    return notif;
}

/*
-Description : Post login data from login page retrieved.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/login', function (req, res) {
    console.log(req.body.username);
    console.log(req.body.password);
    checkLoginDetails(req.body.username, req.body.password, req, res);

    setTimeout(function () {
        res.redirect('/user');
    }, 1000)
});

/*
-Description : Post register data retrieved and added to database.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/register', function (req, res) {
    createData(req.body.sEmail, req.body.sUser, req.body.sPass);
    setTimeout(function () {
        res.redirect('/login')
    }, 500);
});

/*
-Description : Get shows the login page if not logged in otherwise redirect to user page.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.get('/login', function (req, res) {
    request = req;
    console.log("logged in: " + req.session.loggedIn);
    if (req.session.loggedIn) {
        res.redirect('/user');
    } else {
        res.render('login');
    }
});

/*
-Description : Render register page.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.get('/register', function (req, res) {
    if (req.session.loggedIn) {
        res.redirect('/user');
    } else {
        res.render('register');
    }
});

/*
-Description : Render the whiteboard page with all data.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.get('/board', function (req, res) {
    if (req.session.loggedIn) {
        request = req;
        var allFriends = getFriends(req);
        var collabs = getCollaborators(req);
        var URLs = retrieveURLS(req);
        var videos = retrieveVideos(req);
        var oldChat = retrieveChat(req);
        // if (req.session.creator === true) {
        // } else {
        creatorCheck(req);
        // }
        var name = getBoardName(req);

        setTimeout(function () {
            res.render('board', {
                boardID: req.session.boardName,
                friendList: allFriends,
                coll: collabs,
                liveUser: req.session.name,
                boardURLs: URLs,
                boardVideos: videos,
                boardChat: oldChat,
                creator: req.session.creator,
                idboard: req.session.boardID
            });
        }, 3000);

        var dataGained;
        //Socket connection for whiteboard data
        io.on('connection', function (socket) {
            //Old data
            socket.emit('draw', req.session.boardData);
            //Save whiteboard data
            socket.on('draw', function (data) {
                dataGained = data;
            });
            //Cancel saving whiteboard data
            socket.on('disconnect', function () {
                clearInterval(boardsaving);
            })
        });
        //Saving whiteboard data every 30 second.
        var boardsaving = setInterval(function () {
            saveData(dataGained, req);
        }, 30000)
    } else {
        res.redirect('/login');
    }
});

/*
-Description : Render the user page.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.get('/user', function (req, res) {
    if (req.session.loggedIn) {
        var friends = getFriends(req);
        var boardIds = usersBoards(req);
        var share = sharedBoards(req);
        var updates = retrieveNotifications(req);

        setTimeout(function () {
            res.render('user', {
                name: req.session.name,
                boards: boardIds,
                uFriends: friends,
                shared: share,
                notification: updates
            });
        }, 1000);

    } else {
        res.redirect('/login')
    }
});

/*
-Description : Show the shared guest whiteboard page.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.get('/share', function (req, res) {
    if (req.session.guest) {
        var commentsDone = retrieveComments(req);
        setTimeout(function () {
            // console.log("COMMENTS LENGTH " + commentsDone.length)
            res.render('share', {
                boardID: req.session.guestName,
                comments: commentsDone
            });
        }, 500);
        //Socket.io for showing the whiteboard data for guest users.
        io.on('connection', function (socket) {
            console.log("GUEST CONNECTION SET");
            socket.emit('guest', req.session.guestData);

            socket.on('disconnect', function () {
                console.log("Guest disconnected")
            })
        });

    } else {
        //If incorrect URL entered
        res.send("<h1>INPUT SHARED URL</h1>")
    }

});

/*
-Description : Retrieve shared whiteboard data.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.get('/share/:id', function (req, res) {
    req.session.guest = true;
    req.session.guestID = req.params.id;
    // var sql = "SELECT boarddata, title FROM bdata.whiteboard WHERE wid=" +
    //     mysql.escape(req.params.id) + "AND openworld = 1";
    var sql = "SELECT boarddata, title FROM bdata.whiteboard WHERE wid=" +
        mysql.escape(req.params.id);

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        req.session.guestData = result[0].boarddata;
        req.session.guestName = result[0].title;
    });
    setTimeout(function () {
        res.redirect('/share');
    }, 500);
});

/*
-Description : Button respond to redirect to register page.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.get('/signUp', function (req, res) {
    res.redirect('/register');
});

/*
-Description : Button respond to redirect to login page.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.get('/signInButton', function (req, res) {
    res.redirect('/login');
});

/*
-Description : Delete all session data when logout.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.get('/signOut', function (req, res) {
    console.log("LOGGING OUT");
    req.session.loggedIn = false;
    req.session.idHold = 0;
    req.session.name = "";
    req.session.boardID = "";

    res.redirect('/login');
});

/*
-Description : Button press to create a new whiteboard.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.get('/createDraw', function (req, res) {
    createBoard(req);

    setTimeout(function () {
        res.redirect('/board');
    }, 500);
});

/*
-Description : Post button for choosing a whiteboard from user page.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/chooseBoard', function (req, res) {
    console.log(req.body.bID)
    var boardid = req.body.bID;
    retrieveBoard(boardid, req);
    req.session.boardID = boardid;

    setTimeout(function () {
        console.log("BOARD DATA" + req.session.boardData)
        res.redirect('/board');
    }, 1000);
});

/*
-Description : Post button of choosing a shared whiteboard from user page.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/selectBoard', function (req, res) {
    var chosenID = req.body.sID;
    retrieveBoard(chosenID, req);
    req.session.boardID = chosenID;
    setTimeout(function () {
        res.redirect('/board');
    }, 1000)
});

/*
-Description : Post data from searching for friend username in user page.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/searchFriend', function (req, res) {
    console.log(req.body.search);
    var values = searchFriend("%" + req.body.search + "%")
    var boardIds = usersBoards(req);
    var share = sharedBoards(req);
    var updates = retrieveNotifications(req);
    setTimeout(function () {
        res.render('user', {
            name: req.session.name,
            boards: boardIds,
            friendsList: values,
            shared: share,
            notification: updates
        })
    }, 1000);
});

/*
-Description : Add friend of given results of usernames from friend search.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/addFriend', function (req, res) {
    console.log(req.body.friendUser);
    var sql = "INSERT INTO bdata.friends (userid, friend) values ('" +
        req.session.idHold + "'," + mysql.escape(req.body.friendUser) + ")";

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Added friend")
    });

    var sqlTwo = "INSERT INTO bdata.notifications (userid, notification) values" +
        "(" + mysql.escape(req.body.friendUser) + ", '" + req.session.name +
        " added you as friend.')";
    con.query(sqlTwo, function (err, result) {
        if (err) throw err;
        console.log("Notification added")
    });

    res.redirect('/user');
});

/*
-Description : Remove selected friend.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/user', function (req, res) {
    console.log(req.body.friendAll)
    var sql = "DELETE FROM bdata.friends WHERE userid = '" + req.session.idHold +
        "' AND friend = " + mysql.escape(req.body.friendAll);

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Friend removed")
    });

    res.redirect('/user');
});

/*
-Description : Add chosen collaborators to whiteboard.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/board', function (req, res) {
    console.log(req.body.friendChosen + " " + req.body.friendChosen.length)

    var friendAdd = req.body.friendChosen;
    var sql;
    //Retrieved values in characters so first made it into string by combining characters and added to list.
    if (friendAdd[0].length == 1) {
        var charAdd = "";
        for (var k = 0; k < friendAdd.length; k++) {
            charAdd += friendAdd[k];
        }
        friendAdd = [];
        friendAdd.push(charAdd);
    }

    for (var i = 0; i < friendAdd.length; i++) {
        console.log(friendAdd[i])
        sql = "INSERT INTO bdata.boardusers (wid, user, title) values ('" +
            req.session.boardID + "'," + mysql.escape(friendAdd[i]) + ",'" +
            req.session.boardName + "')";
        var sqlTwo = "INSERT INTO bdata.notifications (userid, notification) values" +
            "(" + mysql.escape(friendAdd[i]) + ",'" + req.session.name + " invited you to collaborate on " +
            req.session.boardName + " whiteboard')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Added user ")
        });
        con.query(sqlTwo, function (err, result) {
            if (err) throw err;})
    }

    res.redirect('/board')
});

/*
-Description : Add reminder to database.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/setReminder', function (req, res) {
    addReminder(req.body.remindDate, req.body.remindTime, req.body.remindText, req);
    res.redirect('/board');
});

/*
-Description : Update whiteboard title in database.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/updateTitle', function (req, res) {
    console.log(req.body.boardtitle)
    var sql = "UPDATE bdata.whiteboard SET title = " + mysql.escape(req.body.boardtitle)
        + " WHERE wid = '" + req.session.boardID + "'";

    var sqlTwo = "UPDATE bdata.boardusers SET title = " + mysql.escape(req.body.boardtitle) +
        " WHERE wid = '" + req.session.boardID + "'";
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Updated Title")
        req.session.boardName = req.body.boardtitle
    });
    con.query(sqlTwo, function (err, result) {
        if (err) throw err;
        console.log("Board users title updated")
    });
    res.redirect('/board');
});

/*
-Description : Gets comments from guest whiteboard and added to database.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/sendComment', function (req, res) {
    var sql = "INSERT INTO bdata.comments (wid, name, comment) VALUES ('" +
        req.session.guestID + "'," + mysql.escape(req.body.username) + "," +
        mysql.escape(req.body.comment) + ")";

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Added comment");
    });

    res.redirect('/share');
});
/*
-Description : Logo button click response depending on logged in or not.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/loginlogo', function (req, res) {
    res.redirect('/login')
});
app.post('/userlogo', function (req, res) {
    res.redirect('/user')
});

/*
-Description : Add new URL.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/newURL', function (req, res) {
    var sql = "INSERT INTO bdata.boardurl (url, title, boardid) values (" +
        mysql.escape(req.body.URLink) + "," + mysql.escape(req.body.URLTitle) + ",'" +
        req.session.boardID + "')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("URL added to database")
    });

    setTimeout(function () {
        res.redirect('/board');
    }, 500);
});

/*
-Description : Add video URL.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/newVideo', function (req, res) {
    var sql = "INSERT INTO bdata.videos (url, title, boardID) values (" +
        mysql.escape(req.body.videoLink) + "," + mysql.escape(req.body.videoTitle) + ",'" +
        req.session.boardID + "')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Video added to database")
    });

    setTimeout(function () {
        res.redirect('/board');
    }, 500);
});

/*
-Description : Remove chosen collaborator from the whiteboard.
-Parameter : 1) HTTP request, 2) HTTP response
*/
app.post('/removeCollab', function (req, res) {
    // console.log(req.body.collabs)
    var sql = "DELETE FROM bdata.boardusers WHERE wid = '"+req.session.boardID+
        "' AND user = "+ mysql.escape(req.body.collabs);
    var sqlTwo = "INSERT INTO bdata.notifications (userid, notification) values ("+
        mysql.escape(req.body.collabs) + ",'Removed from "+req.session.boardName + " whiteboard')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Collaborator removed")
    });
    con.query(sqlTwo, function (err, result) {
        if (err) throw err;
    });

    setTimeout(function () {
        res.redirect('/board');
    }, 500);
});