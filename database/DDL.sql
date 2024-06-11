/*
Victoria C. Liu & Zoha Z. Akbarzadeh
Team 122
Project: Recipe Database
*/

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;
DROP TABLE IF EXISTS Categories; 
DROP TABLE IF EXISTS CookTimes;
DROP TABLE IF EXISTS Equipment;
DROP TABLE IF EXISTS Ingredients;
DROP TABLE IF EXISTS Recipes;
DROP TABLE IF EXISTS RecipeIngredients;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE Categories (
	categoryID INT(11) NOT NULL AUTO_INCREMENT, 
    category VARCHAR(30) NOT NULL,
    PRIMARY KEY (categoryID)
);

CREATE TABLE CookTimes (
	cookTimeID INT(11) NOT NULL AUTO_INCREMENT, 
    time int(11) NOT NULL,
    PRIMARY KEY (cookTimeID)
);

CREATE TABLE Equipment (
	equipmentID INT(11) NOT NULL AUTO_INCREMENT, 
    equipmentName VARCHAR(30) NOT NULL,
    specialEquipment BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (equipmentID)
);

CREATE TABLE Ingredients (
	ingredientID INT(11) NOT NULL AUTO_INCREMENT, 
    ingredientName VARCHAR(30) NOT NULL,
    type VARCHAR(20) NOT NULL, 
    PRIMARY KEY (ingredientID)
);

/*main table, added cascades*/
CREATE TABLE Recipes (
	recipeID INT(11) NOT NULL AUTO_INCREMENT, 
    recipeName VARCHAR(50) NOT NULL,
    serving VARCHAR(50),
    categoryID INT(11), 
    equipmentID INT(11),
    cookTimeID INT(11),
    dietaryRestriction VARCHAR(20),
    PRIMARY KEY(recipeID),
    FOREIGN KEY(categoryID) REFERENCES Categories(categoryID)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    FOREIGN KEY(equipmentID) REFERENCES Equipment(equipmentID)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    FOREIGN KEY(cookTimeID) REFERENCES CookTimes(cookTimeID)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

/*intersection table between Recipes and Ingredients*/
CREATE TABLE RecipeIngredients (
	recipeIngredientID INT(11) NOT NULL AUTO_INCREMENT, 
    recipeID INT(11) NOT NULL,
    ingredientID INT(11) NOT NULL, 
    amount VARCHAR(50),
    PRIMARY KEY (recipeIngredientID),
	FOREIGN KEY(recipeID) REFERENCES Recipes(recipeID) 
    ON DELETE CASCADE,
	FOREIGN KEY(ingredientID) REFERENCES Ingredients(ingredientID)
    ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 0;
INSERT INTO Ingredients (ingredientName, type)
VALUES 
	('Heavy Cream', 'dairy'),
    ('Vanilla', 'Spices'),
    ('Cane sugar', 'sweetner'),
    ('Milk', 'Dairy'),
    ('All-purpose flour', 'baking');

INSERT INTO Categories (category)
VALUES 
	('Dessert'), ('Breakfast'), ('Dinner'), ('Lunch'), ('snack');
    
INSERT INTO CookTimes (time)
VALUES 
	(120), (20), (30), (60), (90);

INSERT INTO Equipment (equipmentName, specialEquipment)
VALUES
	('Ice cream maker', True), ('Stove', FALSE), ('Oven', FALSE);
    
INSERT INTO Recipes (recipeName, serving, categoryID, cookTimeID, equipmentID, dietaryRestriction) 
VALUES 
	('Ice Cream', '1 quart', 1, 1, 1, 'lactose'),
    ('Pancakes', '8', 2, 2, 2, 'gluten'), 
    ('Mac and cheese', '2 bowls', 3, 2, 2, NULL);

INSERT INTO RecipeIngredients (RecipeID, ingredientID, amount) 
VALUES 
	(1,1, '1.5 cups'),
    (1,2, '2 tsp'),
    (1,3, "2/3 cups"), 
    (2, 1, "1 and 1/4 cups"),
    (2,4, "1 and 1/2 cups");
    

SET FOREIGN_KEY_CHECKS = 0;
COMMIT;