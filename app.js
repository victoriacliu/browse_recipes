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

app.get('/cookTimes', function (req, res) {
    let query1 = "SELECT * FROM CookTimes;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('cookTimes', { data: rows });
    });
});

app.get('/recipes', function (req, res) {
    let query1 = "SELECT * FROM Recipes;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('recipes', { data: rows });
    });
});

app.post('/add-recipe-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let category = parseInt(data['input-category']);
    if (isNaN(category)) {
        category = 'NULL'
    }
    let equip = parseInt(data['input-equipment']);
    if (isNaN(equip)) {
        equip = 'NULL'
    }
    let serving = parseInt(data['input-serving']);
    if (isNaN(serving)) {
        serving = 'NULL'
    }
    let cookTimeID = parseInt(data['input-cookTimeID']);
    if (isNaN(cookTimeID)) {
        cookTimeID = 'NULL'
    }
    let dietary = parseInt(data['input-dietary']);
    if (isNaN(dietary)) {
        dietary = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Recipes (recipeName,serving, categoryID, equipmentID, cookTimeID, dietaryRestriction) 
        VALUES ('${data['input-recipeName']}', '${data['input-serving']}', '${data['input-category']}', '${data['input-equipment']}', '${data['input-cookTimeID']}', '${data['input-dietary']}')`;
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
    let type = parseInt(data['input-ingredientType']);
    if (isNaN(type)) {
        type = 'NULL'
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

app.post('/add-cookTimes-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // NO NULL values
    // Create the query and run it on the database
    query1 = `INSERT INTO CookTimes (time) VALUES ('${data['input-time']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/cooktimes');
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

app.delete('/delete-cookTimes-ajax/', function (req, res, next) {
    let data = req.body;
    let cookTimeID = parseInt(data.cookTimeID);
    let deleteCookTime = `DELETE FROM CookTimes WHERE cookTimeID = ?`;


    // Run the 1st query
    db.pool.query(deleteCookTime, [cookTimeID], function (error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(deleteCookTime, [cookTimeID], function (error, rows, fields) {

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

app.delete('/delete-recipes-ajax/', function (req, res, next) {
    let data = req.body;
    let recipeID = parseInt(data.recipeID);
    let deleteRecipe = `DELETE FROM Recipes WHERE recipeID = ?`;


    // Run the 1st query
    db.pool.query(deleteRecipes, [recipeID], function (error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(deleteRecipes, [recipeID], function (error, rows, fields) {

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


app.put('/put-cookTimes-ajax', function (req, res, next) {
    let data = req.body;

    let queryUpdateTime = `UPDATE CookTimes SET time = '${data.time}'`;
    let selectCookTime = `SELECT * FROM CookTimes WHERE cookTimeID = '${data.cookTimeID}'`;

    // Run the 1st query
    db.pool.query(queryUpdateTime, function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectCookTime, function (error, rows, fields) {

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


app.put('/put-recipe-ajax', function (req, res, next) {
    let data = req.body;

    let queryUpdateWorld = `UPDATE Recipes SET recipeName = '${data.recipeName}', serving = '${data.serving}', categoryID = '${data.categoryID}', equipmentID = '${data.equipmentID}', cookTimeID = '${data.cookTimeID}', dietaryRestriction = '${data.dietaryRestriction}', WHERE Recipes.recipeID = '${data.recipeID}'`;
    let selectEquipment = `SELECT * FROM Recipes WHERE recipeID = '${data.recipeID}'`;

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