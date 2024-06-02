/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

PORT = 3191;

// Database
var db = require('./database/db-connector');

// Handlebars
var exphbs = require('express-handlebars');
const { query } = require('express');
app.engine('.hbs', exphbs.engine({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');

/*
    ROUTES
*/
app.get('/', function (req, res) {
    let query1 = "SELECT * FROM Equipment;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('index', { data: rows });
    })
});

app.get('/categories', function (req, res) {
    let query1 = "SELECT * FROM Categories;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('categories', { data: rows });
    });
});

app.get('/ingredients', function (req, res) {
    let query1 = "SELECT * FROM Ingredients;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('ingredients', { data: rows });
    });
});

app.post('/add-equipment-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let specialEquipment = parseInt(data['input-specialEquipment']);
    if (isNaN(specialEquipment)) {
        specialEquipment = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Equipment (equipmentName,specialEquipment) VALUES ('${data['input-equipmentName']}', '${data['input-specialEquipment']}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else {
            res.redirect('/');
        }
    })
})


app.post('/add-ingredient-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let specialEquipment = parseInt(data['input-ingredientType']);
    if (isNaN(specialEquipment)) {
        specialEquipment = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Ingredients (ingredientName, type) VALUES ('${data['input-ingredientName']}', '${data['input-ingredientType']}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else {
            res.redirect('/ingredients');
        }
    })
})


app.post('/add-category-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query2 = `INSERT INTO Categories (category) VALUES ('${data['input-category']}')`;
    db.pool.query(query2, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else {
            res.redirect('/categories');
        }
    })
})



app.delete('/delete-equipment-ajax/', function (req, res, next) {
    let data = req.body;
    let equipmentID = parseInt(data.equipmentID);
    let deleteEquipment = `DELETE FROM Equipment WHERE equipmentID = ?`;


    // Run the 1st query
    db.pool.query(deleteEquipment, [equipmentID], function (error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(deleteEquipment, [equipmentID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);

                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.delete('/delete-category-ajax/', function (req, res, next) {
    let data = req.body;
    let categoryID = parseInt(data.categoryID);
    let deleteCategory = `DELETE FROM Categories WHERE categoryID = ?`;


    // Run the 1st query
    db.pool.query(deleteCategory, [categoryID], function (error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(deleteCategory, [categoryID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);

                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});


app.delete('/delete-ingredient-ajax/', function (req, res, next) {
    let data = req.body;
    let ingredientID = parseInt(data.ingredientID);
    let deleteIngredient = `DELETE FROM Ingredients WHERE ingredientID = ?`;


    // Run the 1st query
    db.pool.query(deleteIngredient, [ingredientID], function (error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(deleteIngredient, [ingredientID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);

                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});


app.put('/put-equipment-ajax', function (req, res, next) {
    let data = req.body;

    let queryUpdateWorld = `UPDATE Equipment SET equipmentName = '${data.equipmentName}', specialEquipment = '${data.specialEquipment}' WHERE Equipment.equipmentID = '${data.equipmentID}'`;
    let selectEquipment = `SELECT * FROM Equipment WHERE equipmentID = '${data.equipmentID}'`;

    // Run the 1st query
    db.pool.query(queryUpdateWorld, function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectEquipment, function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});
/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});