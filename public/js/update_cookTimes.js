
// Get the objects we need to modify
let updateCookTimesForm = document.getElementById('update-cookTimes-form-ajax');

// Modify the objects we need
updateEquipmentForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCookTimeID = document.getElementById("mySelect");
    let inputTime = document.getElementById("update-time");

    // Get the values from the form fields
    let cookTimeIDValue = inputCookTimeID.value;
    let timeValue = inputTime.value;

    // Put our data we want to send in a javascript object
    let data = {
        cookTimeID: cookTimeIDValue,
        time: timeValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-cookTimes-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, cookTimeIDValue);
            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, cookTimeID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("cookTimes-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == cookTimeID) {

            // Get the location of the row where we found the matching cooktime ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of time value
            let td = updateRowIndex.getElementsByTagName("td")[3];
            td.innerHTML = parsedData[0].time;
        }
    }
}
