import express from "express"
import exphbs from 'express-handlebars'
import bodyParser from "body-parser";
import settingsBill from "./settings-bill.js";
const app = express();

let settingsBillInstance = settingsBill();

const hbs = exphbs.create({
    layoutsDir: path.join('/views/layouts/'),
    defaultLayout: 'main',

});
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

//route 
app.get('/', (req, res) => {
    // console.log(settingsBillInstance.getSettings());
    res.render("index", {
        totals: settingsBillInstance.totals(),
        warningLevel: settingsBillInstance.hasReachedWarningLevel(),
        criticalLevel: settingsBillInstance.hasReachedCriticalLevel(),
        getSettings: settingsBillInstance.getSettings()

    })

});

app.post("/settings", (req, res) => {
    settingsBillInstance.setSettings(req.body)
    settingsBillInstance.getSettings()
    res.redirect("/")

    // res.render('index', {
    //     getSettings: settingsBillInstance.getSettings()
    // })
});

app.post("/action", (req, res) => {
    //capture the call types to add
    // console.log(req.body.actionType);
    settingsBillInstance.recordAction(req.body.actionType)
    res.redirect("/")

});

app.get("/actions", (req, res) => {
    res.render("actions", {
        actions: settingsBillInstance.actions()
    });
});

app.get("/actions/:actionType", (req, res) => {
    const actionType = req.params.actionType;
    res.render("actions", {
        actions: settingsBillInstance.actionsFor(actionType)
    });
});

// app.get({

// })

const PORT = process.env.PORT || 3007;

app.listen(PORT, function () {
    console.log("app started", PORT);
});

