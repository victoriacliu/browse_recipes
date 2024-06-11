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


app.get('/recipeingredients', (req, res) => {
    let query1 = "SELECT * FROM RecipeIngredients;"
    let query2 = "SELECT * FROM Recipes;"
    let query3 = "SELECT * FROM Ingredients;"


    db.pool.query(query1, function (error, rows, fields) {
        let recipeingredients = rows;

        db.pool.query(query2, function (error, rows, fields) {
            let recipes = rows;

            db.pool.query(query3, function (error, rows, fields) {
                let ingredients = rows;

                res.render('recipeingredients', { data: recipeingredients, recipes: recipes, ingredients: ingredients });
            })
        })
    })
});

app.get('/recipes', (req, res) => {
    let query1 = "SELECT * FROM Recipes;"
    let query2 = "SELECT * FROM Categories;"
    let query3 = "SELECT * FROM Equipment;"
    let query4 = "SELECT * FROM CookTimes;"

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        let recipes = rows;

        db.pool.query(query2, function (error, rows, fields) {
            let categories = rows;

            db.pool.query(query3, function (error, rows, fields) {
                let equipment = rows;

                db.pool.query(query4, function (error, rows, fields) {
                    let cookTime = rows;

                    res.render('recipes', { data: recipes, categories: categories, equipment: equipment, cookTime: cookTime });
                })
            })
        })
    })
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

app.post('/add-recipe-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let serving = parseInt(data['input-serving']);
    if (isNaN(serving)) {
        serving = 'NULL'
    }

    let dietaryRestriction = parseInt(data['input-dietary']);
    if (isNaN(dietaryRestriction)) {
        dietaryRestriction = 'NULL'
    }


    // Create the query and run it on the database
    query1 = `INSERT INTO Recipes (recipeName, serving, categoryID, equipmentID, cookTimeID, dietaryRestriction) VALUES ('${data['input-recipeName']}', '${data['input-serving']}', '${data['input-category']}', '${data['input-equipment']}', '${data['input-cookTimeID']}', '${data['input-dietary']}')`;
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
            res.redirect('/recipes');
        }
    })
})

app.post('/add-recipeingredient-form', function (req, res) {

    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO RecipeIngredients (recipeID, ingredientID, amount) VALUES ('${data['input-recipeID']}', '${data['input-ingredientID']}', '${data['input-amount']}')`;
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
            res.redirect('/recipeingredients');
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
    let deleteRecipe = `DELETE FROM Recipes WHERE equipmentID = ?`;


    // Run the 1st query
    db.pool.query(deleteRecipe, [equipmentID], function (error, rows, fields) {

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

app.delete('/delete-recipeingredient-ajax/', function (req, res, next) {
    let data = req.body;
    let recipeIngredientID = parseInt(data.recipeIngredientID);
    let deleteRecipeIngredient = `DELETE FROM RecipeIngredients WHERE recipeIngredientID = ?`;


    // Run the 1st query
    db.pool.query(deleteRecipeIngredient, [recipeIngredientID], function (error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(deleteRecipeIngredient, [recipeIngredientID], function (error, rows, fields) {

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
    let deleteRecipe = `DELETE FROM Recipes WHERE categoryID = ?`;


    // Run the 1st query
    db.pool.query(deleteRecipe, [categoryID], function (error, rows, fields) {

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

// Reminder to add another query for intersection table
app.delete('/delete-ingredient-ajax/', function (req, res, next) {
    let data = req.body;
    let ingredientID = parseInt(data.ingredientID);
    let deleteIngredient = `DELETE FROM Ingredients WHERE ingredientID = ?`;
    let deleteRecipeIngredient = `DELETE FROM RecipeIngredients WHERE ingredientID = ?`;


    // Run the 1st query
    db.pool.query(deleteRecipeIngredient, [ingredientID], function (error, rows, fields) {

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
    let deleteRecipe = `DELETE FROM Recipes WHERE cookTimeID = ?`;


    // Run the 1st query
    db.pool.query(deleteRecipe, [cookTimeID], function (error, rows, fields) {

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

app.delete('/delete-recipe-ajax/', function (req, res, next) {
    let data = req.body;
    let recipeID = parseInt(data.recipeID);
    let deleteRecipe = `DELETE FROM Recipes WHERE recipeID = ?`;
    let deleterecipeIngredient = `DELETE FROM RecipeIngredients WHERE recipeID = ?`;


    // Run the 1st query
    db.pool.query(deleteRecipe, [recipeID], function (error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(deleterecipeIngredient, [recipeID], function (error, rows, fields) {

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


app.put('/put-recipe-ajax', function (req, res, next) {
    let data = req.body;



    let queryUpdateRecipe = `UPDATE Recipes SET recipeName = '${data.recipeName}' , serving = '${data.serving}', categoryID = '${data.categoryID}', recipeID = '${data.recipeID}', cookTimeID = '${data.cookTimeID}', dietaryRestriction = '${data.dietaryRestriction}' WHERE recipeID = '${data.recipeID}'`;

    let selectRecipe = `SELECT * FROM Recipes WHERE recipeID = '${data.recipeID}'`;

    // Run the 1st query
    db.pool.query(queryUpdateRecipe, function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectRecipe, function (error, rows, fields) {

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