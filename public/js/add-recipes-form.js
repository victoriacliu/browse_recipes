// Get the objects we need to modify
let addrecipeForm = document.getElementById('add-recipe-form");

// Modify the objects we need
addrecipeForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputrecipeName = document.getElementById("input-recipeName");
    let inputServings = document.getElementById("input-serving");
    let inputCategory = document.getElementById("input-category");
    let inputEquipment = document.getElementById("input-equipment");
    let inputCookTime = document.getElementById("input-cookTime");
    let inputDietary = document.getElementById("input-dietary");

    // Get the values from the form fields
    let recipeNamevalue = inputrecipeName.value;
    let servingValue = inputServings.value;
    let categoryValue = inputCategory.value;
    let equipmentValue = inputEquipment.value;
    let cookTimeValue = inputCookTime.value;
    let dietaryValue = inputDietary.value;

    // Put our data we want to send in a javascript object
    let data = {
        recipeName: recipeNameValue,
        serving: servingValue,
        category: categoryValue,
        equipment: equipmentValue,
        cookTime: cookTimeValue,
        dietary: dietaryValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addrecipe", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputrecipeName.value = '';
            inputServings.value = '';
            inputCategory.value = '';
            inputEquipment.value = '';
            inputCookTime.value = '';
            inputDietary.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

        // Get a reference to the current table on the page and clear it out.
        let currentTable = document.getElementById("recipe-table");

        // Get the location where we should insert the new row (end of table)
        let newRowIndex = currentTable.rows.length;

        // Get a reference to the new row from the database query (last object)
        let parsedData = JSON.parse(data);
        let newRow = parsedData[parsedData.length - 1]

        // Create a row and 4 cells
        let row = document.createElement("TR");
        let idCell = document.createElement("TD");
        let recipeNameCell = document.createElement("TD");
        let servingCell = document.createElement("TD");
        let categoryCell = document.createElement("TD");
        let equipmentCell = document.createElement("TD");
        let cookTimeCell = document.createElement("TD");
        let dietaryCell = document.createElement("TD");


        // Fill the cells with correct data
        idCell.innerText = newRow.id;
        recipeNameCell.innerText = newRow.recipeName;
        servingCell.innerText = newRow.serving;
        categoryCell.innerText = newRow.category;
        equipmentCell.innerText = newRow.equipment;
        cookTimeCell.innerText = newRow.cookTime;
        dietaryCell.innerText = newRow.dietary;

        // Add the cells to the row 
        row.appendChild(idCell);
        row.appendChild(recipeNameCell);
        row.appendChild(servingCell);
        row.appendChild(categoryCell);
        row.appendChild(equipmentCell);
        row.appendChild(cookTimeCell);
        row.appendChild(dietaryCell);

        // Add the row to the table
        currentTable.appendChild(row);
};