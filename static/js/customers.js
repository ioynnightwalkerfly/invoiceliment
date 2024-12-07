// โหลดลูกค้า
async function loadCustomers() {
    const response = await fetch('/api/customers');
    const customers = await response.json();
    const customerList = document.querySelector('#customer-list tbody');
    customerList.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editCustomer(${customer.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${customer.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// เพิ่มลูกค้า
document.getElementById('customer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newCustomer = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
    };
    await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
    });
    loadCustomers();
    document.getElementById('customer-form').reset();
});

// ลบลูกค้า
async function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        await fetch(`/api/customers/${id}`, { method: 'DELETE' });
        loadCustomers();
    }
}

// แก้ไขลูกค้า
async function editCustomer(id) {
    const response = await fetch(`/api/customers/${id}`);
    const customer = await response.json();

    document.getElementById('edit-customer-id').value = customer.id;
    document.getElementById('edit-name').value = customer.name;
    document.getElementById('edit-email').value = customer.email;
    document.getElementById('edit-phone').value = customer.phone;
    document.getElementById('edit-address').value = customer.address;

    const editModal = new bootstrap.Modal(document.getElementById('editCustomerModal'));
    editModal.show();
}

// บันทึกข้อมูลที่แก้ไข
async function saveEditCustomer() {
    const id = document.getElementById('edit-customer-id').value;
    const updatedCustomer = {
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        address: document.getElementById('edit-address').value,
    };
    await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCustomer),
    });
    bootstrap.Modal.getInstance(document.getElementById('editCustomerModal')).hide();
    loadCustomers();
}

// เรียกฟังก์ชันเมื่อหน้าโหลด
document.addEventListener('DOMContentLoaded', loadCustomers);
