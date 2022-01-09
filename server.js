var express = require("express")
var hbs = require('express-handlebars');
var app = express()
var path = require("path")

const PORT = process.env.PORT || 3000;

let isLoged = false;

let users = [{
  id: 1,
  login: "admin",
  pass: "admin",
  age: 20,
  student: "checked",
  gender: "male"
}, {
  id: 2,
  login: "aa",
  pass: "aa",
  age: 10,
  student: "",
  gender: "female"
}, ]

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
  defaultLayout: 'main.hbs',
  helpers: {
    createSelect: function(n) {
      let input = "";
      for (let i = 1; i <= n; i++)
        input += "<option value=" + i + ">" + i + "</option>"
      return input;
    },
    checkGender: function(gender) {
      if (gender == "male")
        return true;
      if (gender == "female")
        return false
    },
    radioStudent: function(student){
      if(student == "checked")
        return true
      else
        return false
    },
  }
}));


app.set('view engine', 'hbs');

app.use(express.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.render("mainPage.hbs");
});

app.get("/register", function(req, res) {
  res.render("register.hbs");
});

app.post("/register", function(req, res) {
  console.log(req.body.select)
  if (req.body.login.trim() == "" || req.body.pass.trim() == "")
    return res.send("Wprowadz dane")
  if (req.body.gender != "male" && req.body.gender != "female")
    return res.send("wybierz plec")
  let obj = {
    id: users.length + 1,
    login: req.body.login,
    pass: req.body.pass,
    age: req.body.select,
    student: req.body.student,
    gender: req.body.gender
  }
  users.push(obj);
  console.log(users);
  res.send(req.body.login + " udało ci sie założyć konto");
});

app.get("/login", function(req, res) {
  res.render("login.hbs");
});

app.get("/admin", function(req, res) {
  if (isLoged)
    res.render("admin.hbs", {
      layout: 'admin-layout.hbs'
    });
  else
    res.render("adminDisable.hbs")
});

app.post("/admin", function(req, res) {
  users.forEach((item, i) => {
    if (req.body.login == item["login"] && req.body.pass == item["pass"])
      isLoged = true;
  });
  res.redirect("/admin");
});

app.get("/logout", function(req, res) {
  isLoged = false;
  res.redirect("/");
});

app.get("/sort", function(req, res) {
  if (!isLoged)
    return res.render("adminDisable.hbs")
  res.render("sort.hbs", {
    users,
    layout: "subpages.hbs"
  })
});

app.post("/sort", function(req, res) {
  if (!isLoged)
    return res.render("adminDisable.hbs")
  if (req.body.sort == "asc")
    users.sort((x, y) => {
      return x.age - y.age;
    });
  if (req.body.sort == "desc")
    users.sort((x, y) => {
      return y.age - x.age;
    });
  res.render("sort.hbs", {
    users,
    layout: "subpages.hbs"
  })
});


app.get("/gender", function(req, res) {
  if (!isLoged)
    return res.render("adminDisable.hbs")
  res.render("gender.hbs", {
    users,
    layout: "subpages.hbs"
  })
});

app.get("/show", function(req, res) {
  if (!isLoged)
    return res.render("adminDisable.hbs")
    users.sort((x, y) => {
      return x.id - y.id;
    });
  res.render("show.hbs", {
    users,
    layout: "subpages.hbs"
  })
});

app.use(express.static('static'))

app.listen(PORT, function() {
  console.log("start serwera na porcie " + PORT)
})
