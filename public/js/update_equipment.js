
// Get the objects we need to modify
let updateEquipmentForm = document.getElementById('update-equipment-form-ajax');

// Modify the objects we need
updateEquipmentForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEquipmentID = document.getElementById("mySelect");
    let inputEquipmentName = document.getElementById("update-equipmentName");
    let inputSpecialEquipment = document.getElementById("update-specialEquipment");

    // Get the values from the form fields
    let equipmentIDValue = inputEquipmentID.value;
    let equipmentNameValue = inputEquipmentName.value;
    let specialValue = inputSpecialEquipment.value;

    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld


    // Put our data we want to send in a javascript object
    let data = {
        equipmentID: equipmentIDValue,
        equipmentName: equipmentNameValue,
        specialEquipment: specialValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-equipment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, equipmentIDValue);
            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, equipmentID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("equipment-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == equipmentID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];
            td.innerHTML = parsedData[0].equipmentName;

            td = updateRowIndex.getElementsByTagName("td")[4];
            td.innerHTML = parsedData[0].specialEquipment;

        }
    }
}
