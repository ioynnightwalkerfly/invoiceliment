// ฟังก์ชันโหลดสินค้า
async function loadProducts() {
    const response = await fetch('/api/products');
    const products = await response.json();
    const productList = document.querySelector('#product-list tbody');
    productList.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.unit}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// ฟังก์ชันเพิ่มสินค้า
document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newProduct = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        unit: document.getElementById('unit').value,
    };
    await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
    });
    loadProducts();
    document.getElementById('product-form').reset();
});

// ฟังก์ชันลบสินค้า
async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        loadProducts();
    }
}

// ฟังก์ชันแก้ไขสินค้า
async function editProduct(id) {
    const response = await fetch(`/api/products/${id}`);
    const product = await response.json();

    document.getElementById('edit-product-id').value = product.id;
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-description').value = product.description;
    document.getElementById('edit-price').value = product.price;
    document.getElementById('edit-unit').value = product.unit;

    const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editModal.show();
}

// ฟังก์ชันบันทึกข้อมูลสินค้า
async function saveEditProduct() {
    const id = document.getElementById('edit-product-id').value;
    const updatedProduct = {
        name: document.getElementById('edit-name').value,
        description: document.getElementById('edit-description').value,
        price: parseFloat(document.getElementById('edit-price').value),
        unit: document.getElementById('edit-unit').value,
    };
    await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
    });
    bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
    loadProducts();
}

// เรียกฟังก์ชันเมื่อหน้าโหลด
document.addEventListener('DOMContentLoaded', loadProducts);
