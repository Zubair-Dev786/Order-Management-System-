const modal = document.getElementById("modal");
const form = document.getElementById("orderForm");

let pendingCount = document.getElementById("pendingCount");
let receicedCount = document.getElementById("receicedCount");

let pendingAmount = document.getElementById("pendingAmount");
let receicedAmount = document.getElementById("receicedAmount");

const customerName = document.getElementById("customerName");
const service = document.getElementById("service");
const quantity = document.getElementById("quantity");
const price = document.getElementById("price");
const advanceInput = document.getElementById("advanceInput");

const pendingTable = document.getElementById("pendingTable");
let receivedTable = document.getElementById("receivedTable");


// =========================
// ORDERS ARRAY
// =========================

// LocalStorage se data load hoga
let pendingOrders = JSON.parse(localStorage.getItem("pendingOrders")) || [];
let receivedOrders = JSON.parse(localStorage.getItem("receivedOrders")) || [];


// =========================
// GLOBALS
// =========================

let totalReceived = 0;
let totalPending = 0;

let editIndex = null;


// =========================
// LOCAL STORAGE
// =========================

const saveOrders = () => {
    localStorage.setItem("pendingOrders", JSON.stringify(pendingOrders));
    localStorage.setItem("receivedOrders", JSON.stringify(receivedOrders));
};


// =========================
// OPEN / CLOSE MODAL
// =========================

function openModal() {
    modal.classList.add("active");
}

function closeModal() {
    modal.classList.remove("active");
}

modal.addEventListener("click", function (e) {
    if (e.target === modal) {
        closeModal();
    }
});


// =========================
// FORM SUBMIT
// =========================

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = customerName.value.trim();
    const selectedService = service.value;
    const qty = Number(quantity.value);
    const itemPrice = Number(price.value);
    const advance = Number(advanceInput.value);


    // VALIDATION

    if (name === "" || name.length < 3) {
        alert("Customer name must contain at least 3 letters.");
        customerName.focus();
        return;
    }

    if (selectedService === "") {
        alert("Please select a service.");
        service.focus();
        return;
    }

    if (quantity.value === "" || qty <= 0) {
        alert("Quantity must be greater than 0.");
        quantity.focus();
        return;
    }

    if (price.value === "" || itemPrice < 0) {
        alert("Price cannot be negative.");
        price.focus();
        return;
    }

    if (advanceInput.value === "" || advance < 0) {
        alert("Advance payment cannot be negative.");
        advanceInput.focus();
        return;
    }


    const total = itemPrice * qty;
    const pending = total - advance;


    if (advance > total) {
        alert("Advance cannot be greater than total amount.");
        advanceInput.focus();
        return;
    }


    const order = {
        name: name,
        service: selectedService,
        quantity: qty,
        price: itemPrice,
        advance: advance,
        total: total,
        pending: pending
    };



    if (editIndex === null) {
        pendingOrders.push(order);
    } else {
        pendingOrders[editIndex] = order;
        editIndex = null;
    }


    saveOrders();

    updateTotalsAndRender();

    form.reset();
    closeModal();
});


// =========================
// CENTRAL UPDATE FUNCTION
// =========================

const updateTotalsAndRender = () => {

    totalPending = 0;
    totalReceived = 0;



    for (let item of pendingOrders) {
        totalPending += item.pending;
        totalReceived += item.advance;
    }



    for (let item of receivedOrders) {
        totalReceived += item.total;
    }


    renderPendingOrders();
    renderReceivedOrders();
};


// =========================
// RENDER PENDING ORDERS
// =========================

const renderPendingOrders = () => {

    pendingTable.innerHTML = "";

    for (let i = 0; i < pendingOrders.length; i++) {

        let item = pendingOrders[i];

        pendingTable.innerHTML += `

            <td>${i + 1}</td>
            <td>${item.name}</td>
            <td>${item.service}</td>
            <td>${item.quantity}</td>
            <td>Rs. ${item.total}</td>
            <td>Rs. ${item.advance}</td>
            <td>Rs. ${item.pending}</td>

            <td class="action-buttons">
                <button class="edit-btn" onclick="editItem(${i})">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteItem(${i})">
                    Delete
                </button>

                <button class="received-btn" onclick="receiveItem(${i})">
                    Received
                </button>
            </td> `;
    }


    pendingCount.textContent = pendingOrders.length;
    pendingAmount.textContent = `Rs.${totalPending} `;
};


// =========================
// DELETE PENDING ORDER
// =========================

const deleteItem = (index) => {

    pendingOrders.splice(index, 1);

    saveOrders();

    updateTotalsAndRender();
};


// =========================
// EDIT ORDER
// =========================

const editItem = (index) => {

    editIndex = index;

    const item = pendingOrders[index];

    customerName.value = item.name;
    service.value = item.service;
    quantity.value = item.quantity;
    price.value = item.price;
    advanceInput.value = item.advance;

    openModal();
};


// =========================
// RENDER RECEIVED ORDERS
// =========================

const renderReceivedOrders = () => {

    receivedTable.innerHTML = "";

    for (let i = 0; i < receivedOrders.length; i++) {

        const item = receivedOrders[i];

        receivedTable.innerHTML += `

        <td>${i + 1}</td>
            <td>${item.name}</td>
            <td>${item.service}</td>
            <td>${item.quantity}</td>
            <td>Rs. ${item.total}</td>
            <td>Rs. ${item.total}</td>

            <td>
                <button
                    class="delete-btn-2"
                    onclick="deleteReceivedItem(${i})">
                    Delete
                </button>
            </td> `;
    }


    receicedCount.textContent = receivedOrders.length;
    receicedAmount.textContent = `Rs.${totalReceived} `;
};


// =========================
// DELETE RECEIVED ORDER
// =========================

const deleteReceivedItem = (index) => {

    receivedOrders.splice(index, 1);

    saveOrders();

    updateTotalsAndRender();
};


// =========================
// RECEIVE ITEM
// =========================

const receiveItem = (index) => {

    const item = pendingOrders[index];

    item.advance = item.total;
    item.pending = 0;


    receivedOrders.push(item);

    pendingOrders.splice(index, 1);


    // LocalStorage update
    saveOrders();

    updateTotalsAndRender();
};


updateTotalsAndRender();
