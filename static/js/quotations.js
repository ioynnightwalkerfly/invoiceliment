let selectedProducts = [];

// ฟังก์ชันโหลดลูกค้า
async function loadCustomers() {
    try {
        const response = await fetch('/api/customers');
        const customers = await response.json();
        const customerSelect = document.getElementById('customer');
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = `${customer.name} (${customer.email})`;
            customerSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

// ฟังก์ชันโหลดสินค้า
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        const productSelect = document.getElementById('product');
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = JSON.stringify(product);
            option.textContent = `${product.name} - ${product.price} per ${product.unit}`;
            productSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// ฟังก์ชันเพิ่มสินค้าในใบเสนอราคา
function addProductToQuotation() {
    const productData = document.getElementById('product').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);

    if (!productData || quantity < 1) {
        alert('Please select a product and enter a valid quantity.');
        return;
    }

    const product = JSON.parse(productData);
    const total = product.price * quantity;

    selectedProducts.push({ ...product, quantity, total });

    updateQuotationTable();
    calculateTotalAmount();
}

// ฟังก์ชันอัปเดตตารางสินค้า
function updateQuotationTable() {
    const tableBody = document.querySelector('#quotation-products tbody');
    tableBody.innerHTML = selectedProducts.map((product, index) => `
        <tr>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.price}</td>
            <td>${product.total.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeProduct(${index})">Remove</button>
            </td>
        </tr>
    `).join('');
}

// ฟังก์ชันคำนวณยอดรวม
function calculateTotalAmount() {
    const totalAmount = selectedProducts.reduce((sum, product) => sum + product.total, 0);
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
}

// ฟังก์ชันลบสินค้าออกจากใบเสนอราคา
function removeProduct(index) {
    selectedProducts.splice(index, 1);
    updateQuotationTable();
    calculateTotalAmount();
}

// ฟังก์ชันพิมพ์ใบเสนอราคา
function printQuotation() {
    const customerSelect = document.getElementById('customer');
    const selectedCustomer = customerSelect.options[customerSelect.selectedIndex].text;

    // เก็บข้อมูลลูกค้าและสินค้าใน sessionStorage
    sessionStorage.setItem('customerName', selectedCustomer);
    sessionStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));

    // เปลี่ยนหน้าไปยัง print_view.html
    window.location.href = '/print-view';
}

// โหลดข้อมูลเมื่อหน้าโหลด
document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
    loadProducts();
});



async function saveQuotation() {
    const customerSelect = document.getElementById('customer');
    const customerId = customerSelect.value;
    const selectedCustomer = customerSelect.options[customerSelect.selectedIndex].text;

    if (!customerId) {
        alert('Please select a customer');
        return;
    }

    if (selectedProducts.length === 0) {
        alert('Please add at least one product');
        return;
    }

    const data = {
        customer_id: customerId,
        customer_name: selectedCustomer,
        products: selectedProducts,
        total_products: selectedProducts.length,
        total_amount: selectedProducts.reduce((sum, product) => sum + product.total, 0),
        date_created: new Date().toISOString(),
        status: 'pending'
    };

    try {
        const response = await fetch('/api/quotations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Quotation saved successfully');
            // คุณสามารถเพิ่มการรีเซ็ตฟอร์มได้ที่นี่
        } else {
            alert('Error saving quotation');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred');
    }
}

