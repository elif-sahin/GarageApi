var express = require('express');
var app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var mongoose = require("mongoose");
var mongoDB = "mongodb+srv://admin:admin@cluster0-jotpt.gcp.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(mongoDB, { useNewUrlParser: true });
// Get the default connection
var db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("we're connected!")
});

//Define a schema
var Schema = mongoose.Schema;

var SaleSchema = new Schema({
    latitude: Number,
    longitude: Number,
    description: String,
    title: { type: String, maxlength: 150 },
    photoURL: String,
},
    {
        versionKey: false
    });

// Compile model from schema
var Sale = mongoose.model('Sale', SaleSchema);

app.get('/api/v1/listSales', function (req, res) {
    Sale.find({}, function (err, data) {
        if (err) return handleError(err)
        res.send(data)
    })
})

app.post('/api/v1/addSale', function (req, res) {
    const sale1 = new Sale(req.body);
    sale1.save(function (err, data) {
        if (err) return console.error(err);
        console.log("Sale added!");
        res.send(data);
    });
})

app.get('/api/v1/details/:id', function (req, res) {
    Sale.findById(req.params.id, function (err, data) {
        if (err) {
            console.log(err);
            return err;
        }
        res.send(data)
    })
})


app.delete('/api/v1/:id', function (req, res) {
    Sale.findByIdAndRemove(req.params.id, function (err, data) {
        if (err) {
            console.log(err);
            return err;
        }
        res.send(data);
    });
})

app.put('/api/v1/', function (req, res) {
    Sale.findByIdAndUpdate(req.body._id, req.body, function (err, data) {

        if (err) {
            console.log(err);
            return err;
        }
        res.send(data);
    });
})

app.get('/api/v1/seach/:title', function (req, res) {
    Sale.find({ title: req.params.title }, function (err, data) {
        if (err) {
            console.log(err);
            return err;
        }
        res.send(data)
    })
})

var server = app.listen(3000, function () {
    var host = "localhost"
    var port = server.address().port
    console.log(`Example app listening at http://${host}:${port}`)
})