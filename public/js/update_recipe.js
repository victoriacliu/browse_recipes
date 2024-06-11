
// Get the objects we need to modify
let updateRecipeForm = document.getElementById('update-recipe-form-ajax');

// Modify the objects we need
updateRecipeForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRecipeID = document.getElementById("mySelect1");
    let inputRecipeName = document.getElementById("update-recipeName");
    let inputServing = document.getElementById("update-serving");
    let inputCategoryID = document.getElementById("update-categoryID");
    let inputEquipmentID = document.getElementById("update-equipmentID");
    let inputCookTimeID = document.getElementById("update-cookTimeID");
    let inputDietaryRestriction = document.getElementById("update-dietaryRestriction");

    // Get the values from the form fields
    let recipeIDValue = inputRecipeID.value;
    let recipeNameValue = inputRecipeName.value;
    let servingValue = inputServing.value;
    let categoryIDValue = inputCategoryID.value;
    let equipmentIDValue = inputEquipmentID.value;
    let cookTimeIDValue = inputCookTimeID.value;
    let dietaryRestrictionValue = inputDietaryRestriction.value;

    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld


    // Put our data we want to send in a javascript object
    let data = {
        recipeID: recipeIDValue,
        recipeName: recipeNameValue,
        serving: servingValue,
        categoryID: categoryIDValue,
        cookTimeID: cookTimeIDValue,
        dietaryRestriction: dietaryRestrictionValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-recipe-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, recipeIDValue);
            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, recipeID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("recipe-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == recipeID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];
            td.innerHTML = parsedData[0].recipeName;

            td = updateRowIndex.getElementsByTagName("td")[4];
            td.innerHTML = parsedData[0].serving;
            td = updateRowIndex.getElementsByTagName("td")[5];
            td.innerHTML = parsedData[0].categoryID;
            td = updateRowIndex.getElementsByTagName("td")[6];
            td.innerHTML = parsedData[0].equipmentID;
            td = updateRowIndex.getElementsByTagName("td")[7];
            td.innerHTML = parsedData[0].cooktimeID;
            td = updateRowIndex.getElementsByTagName("td")[8];
            td.innerHTML = parsedData[0].dietaryRestriction;

        }
    }
}