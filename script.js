let medicines = JSON.parse(localStorage.getItem("medicines")) || [];

// Save to local storage
function saveData() {
    localStorage.setItem("medicines", JSON.stringify(medicines));
}

// Add medicine
function addMedicine() {
    let name = document.getElementById("name").value;
    let time = document.getElementById("time").value;
    let dose = document.getElementById("dose").value;

    if (!name || !time || !dose) {
        alert("Please fill all fields");
        return;
    }

    medicines.push({
        name,
        time,
        dose,
        taken: false
    });

    saveData();
    displayMedicines();

    document.getElementById("name").value = "";
    document.getElementById("time").value = "";
    document.getElementById("dose").value = "";
}

// Display medicines
function displayMedicines() {
    let list = document.getElementById("list");
    list.innerHTML = "";

    if (medicines.length === 0) {
        list.innerHTML = "<p style='text-align:center;'>No medicines added yet</p>";
        return;
    }

    medicines.forEach((med, index) => {
        let li = document.createElement("li");

        li.innerHTML = `
            <span style="color:${med.taken ? 'lightgreen' : 'white'}">
                ${med.name} (${med.dose}) - ${med.time}
            </span>
            <div>
                <button onclick="markTaken(${index})">✔</button>
                <button onclick="deleteMed(${index})">❌</button>
            </div>
        `;

        list.appendChild(li);
    });
}

// Delete medicine
function deleteMed(index) {
    medicines.splice(index, 1);
    saveData();
    displayMedicines();
}

// Mark as taken
function markTaken(index) {
    medicines[index].taken = true;
    saveData();
    displayMedicines();
}

// Reminder checker
function checkReminder() {
    let now = new Date();
    let currentTime = now.toTimeString().slice(0, 5);

    medicines.forEach(med => {
        if (med.time === currentTime && !med.taken) {

            // Browser notification
            if (Notification.permission === "granted") {
                new Notification(`💊 Take ${med.name} (${med.dose})`);
            } else {
                Notification.requestPermission();
            }

            // Sound
            let audio = new Audio("alarm.mp3");
            audio.play();
        }
    });
}

// Check every minute
setInterval(checkReminder, 60000);

// Load data
displayMedicines();