var sqlite3 = require('sqlite3').verbose()
var bodyParser = require('body-parser')
const express = require('express')
const app = express()
app.use(express.static('public'));
app.set('view engine', 'pug')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json())

var db = new sqlite3.Database('twitter.db')

app.get('/', function (req, res, next) {
    const timeline_query = new Promise(function(resolve,reject){
        var query = "\
        SELECT t.account, u.name, t.datetime, t.content\
        FROM tweet t, follow f, user u\
        WHERE t.account = u.account and f.follower_account = 'mob1' and f.followee_account = t.account;\
        ";
        db.all(query, {}, function (err, rows) {
            if (err) {
                reject(err.message);
            }
            else{
                resolve(rows);
            }
        })
    });

    timeline_query.then(function(timeline){
        var count_query = "\
        SELECT count(*) as count\
        FROM tweet t, follow f, user u\
        WHERE t.account = u.account and f.follower_account = 'mob1' and f.followee_account = t.account;\
        ";
        db.get(count_query,{},function(err,row){
            if(err){
                console.log(err.message);
            }
            else{
                res.render('index',{
                    timeline: timeline,
                    count: row['count']
                });
            }
        })
    });
    

});

app.listen(3000, () => console.log('Example app listening on port 3000!'))

