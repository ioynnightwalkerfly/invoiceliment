// ฟังก์ชันโหลดข้อมูลใบเสนอราคาและอัปเดตหน้าแดชบอร์ด
async function loadDashboard() {
    try {
        const response = await fetch('/api/quotations');
        if (!response.ok) throw new Error('Failed to load quotations');
        const data = await response.json();

        // อัปเดตสถิติ
        const totalQuotations = data.length;
        const completedQuotations = data.filter(q => q.status === 'completed').length;
        const totalRevenue = data
            .filter(q => q.status === 'completed')
            .reduce((sum, q) => sum + q.total_amount, 0);

        document.getElementById('total-quotations').textContent = totalQuotations;
        document.getElementById('completed-quotations').textContent = completedQuotations;
        document.getElementById('total-revenue').textContent = totalRevenue.toFixed(2);

        // อัปเดตตารางใบเสนอราคา
        const tableBody = document.getElementById('quotation-history');
        tableBody.innerHTML = data.map(q => `
            <tr>
                <td>${q.customer_name}</td>
                <td>${q.total_products}</td>
                <td>฿${q.total_amount.toFixed(2)}</td>
                <td>${new Date(q.date_created).toLocaleDateString()}</td>
                <td>${q.status}</td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="updateQuotationStatus(${q.id}, 'completed')" ${q.status === 'completed' ? 'disabled' : ''}>Complete</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteQuotation(${q.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading dashboard:', error);
        alert('Failed to load dashboard data. Please try again later.');
    }
}

// ฟังก์ชันอัปเดตสถานะใบเสนอราคา
async function updateQuotationStatus(id, status) {
    if (!confirm('Are you sure you want to update the status of this quotation?')) return;

    try {
        const response = await fetch(`/api/quotations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update quotation status');
        loadDashboard(); // โหลดข้อมูลใหม่หลังอัปเดต
    } catch (error) {
        console.error('Error updating quotation status:', error);
        alert('Failed to update quotation status. Please try again.');
    }
}

// ฟังก์ชันลบใบเสนอราคา
async function deleteQuotation(id) {
    if (!confirm('Are you sure you want to delete this quotation? This action cannot be undone.')) return;

    try {
        const response = await fetch(`/api/quotations/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete quotation');
        alert('Quotation deleted successfully.');
        loadDashboard(); // โหลดข้อมูลใหม่หลังลบ
    } catch (error) {
        console.error('Error deleting quotation:', error);
        alert('Failed to delete quotation. Please try again.');
    }
}

// เรียกใช้ฟังก์ชันเมื่อหน้าโหลดเสร็จ
document.addEventListener('DOMContentLoaded', loadDashboard);
