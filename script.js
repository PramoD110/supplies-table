let chemicals = [
    { id: 1, name: "Ammonium Persulfate", vendor: "LG Chem", density: 3525.92, viscosity: 60.63, packaging: "Bag", packSize: 100, unit: "kg", quantity: 6495.18 },
    { id: 2, name: "Caustic Potash", vendor: "Formosa", density: 3172.15, viscosity: 48.22, packaging: "Bag", packSize: 100, unit: "kg", quantity: 8751.9 },
];

let selectedRow = null;
let selectedRowIndex = null; 

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('chemicalsData')) {
        chemicals = JSON.parse(localStorage.getItem('chemicalsData'));
    }
    loadTable();
});

function loadTable() {
    const tbody = document.querySelector("#chemical-table tbody");
    tbody.innerHTML = "";

    chemicals.forEach((chemical, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${chemical.id}</td>
            <td data-field="name">${chemical.name}</td>
            <td data-field="vendor">${chemical.vendor}</td>
            <td data-field="density">${chemical.density}</td>
            <td data-field="viscosity">${chemical.viscosity}</td>
            <td data-field="packaging">${chemical.packaging}</td>
            <td data-field="packSize">${chemical.packSize}</td>
            <td data-field="unit">${chemical.unit}</td>
            <td data-field="quantity">${chemical.quantity}</td>
        `;
        row.addEventListener("click", () => selectRow(row, index));

        row.querySelectorAll("td").forEach(cell => {
            if (cell.dataset.field) {
                cell.addEventListener("click", (event) => makeCellEditable(event, index));
            }
        });

        tbody.appendChild(row);
    });

    if (selectedRowIndex !== null) {
        const rows = tbody.getElementsByTagName("tr");
        rows[selectedRowIndex].classList.add("selected");
        selectedRow = rows[selectedRowIndex];
    }
}

function selectRow(row, index) {
    if (selectedRow) {
        selectedRow.classList.remove("selected");
    }
    selectedRow = row;
    selectedRowIndex = index;
    row.classList.add("selected");
}

function makeCellEditable(event, index) {
    const cell = event.target;
    const originalValue = cell.innerText;
    const field = cell.dataset.field;

    const input = document.createElement("input");
    input.type = "text";
    input.value = originalValue;
    input.style.width = "100%";

    cell.innerHTML = "";
    cell.appendChild(input);
    input.focus();

    input.addEventListener("blur", () => saveCellEdit(input, cell, index, field));
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            saveCellEdit(input, cell, index, field);
        }
    });
}

function saveCellEdit(input, cell, index, field) {
    const newValue = input.value;
    chemicals[index][field] = newValue;  
    cell.innerHTML = newValue;  
}

document.getElementById("add-row").addEventListener("click", () => {
    const newRow = { id: chemicals.length + 1, name: "New Chemical", vendor: "New Vendor", density: 0, viscosity: 0, packaging: "Bag", packSize: 0, unit: "kg", quantity: 0 };
    chemicals.push(newRow);
    loadTable();
});

document.getElementById("move-up").addEventListener("click", () => {
    if (selectedRowIndex > 0) {
        [chemicals[selectedRowIndex], chemicals[selectedRowIndex - 1]] = [chemicals[selectedRowIndex - 1], chemicals[selectedRowIndex]];
        selectedRowIndex--; 
        loadTable();
    }
});

document.getElementById("move-down").addEventListener("click", () => {
    if (selectedRowIndex < chemicals.length - 1) {
        [chemicals[selectedRowIndex], chemicals[selectedRowIndex + 1]] = [chemicals[selectedRowIndex + 1], chemicals[selectedRowIndex]];
        selectedRowIndex++;  
        loadTable();
    }
});

document.getElementById("delete-row").addEventListener("click", () => {
    if (selectedRowIndex !== null) {
        chemicals.splice(selectedRowIndex, 1);
        selectedRow = null;
        selectedRowIndex = null;
        loadTable();
    }
});

function sortTable(n) {
    let table = document.getElementById("chemical-table");
    let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

document.getElementById("save-data").addEventListener("click", () => {
    localStorage.setItem('chemicalsData', JSON.stringify(chemicals));
    alert('Data saved successfully!');
});

document.getElementById("refresh-data").addEventListener("click", () => {
    if (localStorage.getItem('chemicalsData')) {
        chemicals = JSON.parse(localStorage.getItem('chemicalsData'));
        loadTable();
    } else {
        alert('No saved data found.');
    }
});
