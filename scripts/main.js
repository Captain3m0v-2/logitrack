// ===== LOGITRACK DASHBOARD MAIN SCRIPT =====

let currentUser = null;
let charts = {};

// ===== AUTHENTICATION =====
function switchToSignup() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('signupPage').style.display = 'flex';
}

function switchToLogin() {
    document.getElementById('signupPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = db.getUserByEmail(email);
    if (user && user.password === password) {
        currentUser = user;
        user.lastLogin = new Date().toISOString();
        db.saveDatabase(db.getDatabase());
        
        showDashboard();
        showNotification('Login successful!');
    } else {
        showNotification('Invalid email or password', 'error');
    }
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;

    if (db.getUserByEmail(email)) {
        showNotification('Email already registered', 'error');
        return;
    }

    const newUser = {
        name,
        email,
        password,
        role,
        status: 'active'
    };

    db.addUser(newUser);
    currentUser = newUser;
    showDashboard();
    showNotification('Account created successfully!');
});

function logout() {
    currentUser = null;
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('dashboardPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
    showNotification('Logged out successfully!');
}

function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('signupPage').style.display = 'none';
    document.getElementById('dashboardPage').style.display = 'grid';
    
    document.getElementById('currentUserName').textContent = currentUser.name;
    
    setupNavigation();
    setupRoleBasedAccess();
    loadDashboard();
}

// ===== ROLE-BASED ACCESS CONTROL =====
function setupRoleBasedAccess() {
    const role = currentUser.role;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const page = link.dataset.page;
        
        // Show/hide based on role
        if (role === 'Admin') {
            link.style.display = 'flex'; // Admin sees everything
        } else if (role === 'Office Employee') {
            // Office Employee can see: dashboard, orders, shipments, analytics
            if (['dashboard', 'orders', 'shipments', 'analytics'].includes(page)) {
                link.style.display = 'flex';
            } else {
                link.style.display = 'none';
            }
        } else if (role === 'Manager') {
            // Manager can see: dashboard, orders, shipments, drivers, vehicles, analytics
            if (['dashboard', 'orders', 'shipments', 'drivers', 'vehicles', 'analytics'].includes(page)) {
                link.style.display = 'flex';
            } else {
                link.style.display = 'none';
            }
        } else if (role === 'Driver') {
            // Driver can see: dashboard, shipments only
            if (['dashboard', 'shipments'].includes(page)) {
                link.style.display = 'flex';
            } else {
                link.style.display = 'none';
            }
        }
    });

    // Add role badge to header
    const header = document.querySelector('.sidebar-header');
    if (header) {
        let roleBadge = header.querySelector('.role-badge');
        if (!roleBadge) {
            roleBadge = document.createElement('div');
            roleBadge.className = 'role-badge';
            roleBadge.style.cssText = 'font-size: 0.75rem; background: #7209b7; color: white; padding: 4px 8px; border-radius: 4px; margin-top: 8px; text-align: center;';
            header.appendChild(roleBadge);
        }
        roleBadge.textContent = role;
    }
}

// ===== NAVIGATION =====
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            switchPage(page);
        });
    });
}

function switchPage(pageName) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(pageName + 'Section');
    if (section) {
        section.classList.add('active');
    }

    // Set active nav link
    const navLink = document.querySelector(`[data-page="${pageName}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }

    // Initialize page
    switch(pageName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'shipments':
            loadShipments();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'drivers':
            loadDrivers();
            break;
        case 'vehicles':
            loadVehicles();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'users':
            loadUsers();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// ===== DASHBOARD PAGE =====
function loadDashboard() {
    const stats = db.getStatistics();
    
    document.getElementById('kpiShipments').textContent = stats.activeShipments;
    document.getElementById('kpiPendingOrders').textContent = stats.pendingOrders;
    document.getElementById('kpiRevenue').textContent = '$' + stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 });
    
    const deliveredPercent = stats.totalShipments > 0 ? Math.round((stats.deliveredShipments / stats.totalShipments) * 100) : 0;
    document.getElementById('kpiDelivery').textContent = deliveredPercent + '%';

    loadRecentShipments();
    initializeDashboardCharts();
}

function loadRecentShipments() {
    const shipments = db.getShipments().slice(-5).reverse();
    const tbody = document.getElementById('recentShipmentsTable');
    tbody.innerHTML = '';

    shipments.forEach(shipment => {
        const driver = db.getDrivers().find(d => d.id === shipment.driverId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${shipment.id}</strong></td>
            <td>${shipment.origin}</td>
            <td>${shipment.destination}</td>
            <td><span class="status-badge status-${shipment.status}">${shipment.status.replace('-', ' ').toUpperCase()}</span></td>
            <td>${driver ? driver.name : 'Unassigned'}</td>
            <td>${shipment.estimatedDelivery}</td>
            <td><button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.85rem;" onclick="viewShipment('${shipment.id}')"><i class="fas fa-eye"></i></button></td>
        `;
        tbody.appendChild(row);
    });
}

function initializeDashboardCharts() {
    const shipments = db.getShipments();
    const orders = db.getOrders();

    // Shipments Status Chart
    const statusData = {
        pending: shipments.filter(s => s.status === 'pending').length,
        processing: shipments.filter(s => s.status === 'processing').length,
        'in-transit': shipments.filter(s => s.status === 'in-transit').length,
        delivered: shipments.filter(s => s.status === 'delivered').length,
        cancelled: shipments.filter(s => s.status === 'cancelled').length
    };

    const shipmentCtx = document.getElementById('shipmentsChart')?.getContext('2d');
    if (shipmentCtx) {
        if (charts.shipments) charts.shipments.destroy();
        charts.shipments = new Chart(shipmentCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusData).map(k => k.replace('-', ' ').toUpperCase()),
                datasets: [{
                    data: Object.values(statusData),
                    backgroundColor: [
                        'rgba(247, 37, 133, 0.8)',
                        'rgba(248, 150, 30, 0.8)',
                        'rgba(67, 97, 238, 0.8)',
                        'rgba(76, 201, 240, 0.8)',
                        'rgba(108, 117, 125, 0.8)'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Revenue Trend Chart
    const last6Months = [];
    const last6MonthsData = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        last6Months.push(date.toLocaleDateString('en-US', { month: 'short' }));
        const monthOrders = orders.filter(o => {
            const orderDate = new Date(o.orderDate);
            return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
        });
        last6MonthsData.push(monthOrders.reduce((sum, o) => sum + o.amount, 0));
    }

    const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
    if (revenueCtx) {
        if (charts.revenue) charts.revenue.destroy();
        charts.revenue = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: last6Months,
                datasets: [{
                    label: 'Revenue',
                    data: last6MonthsData,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#4361ee'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

// ===== SHIPMENTS PAGE =====
// ===== SHIPMENTS PAGE =====
let shipmentFilterStatus = 'all'; // Track current filter

function loadShipments() {
    const shipments = db.getShipments();
    const tbody = document.getElementById('shipmentsTable');
    tbody.innerHTML = '';

    // Filter shipments based on selected status
    let filteredShipments = shipments;
    if (shipmentFilterStatus !== 'all') {
        filteredShipments = shipments.filter(shipment => shipment.status === shipmentFilterStatus);
    }

    if (filteredShipments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">No shipments found</td></tr>';
        return;
    }

    filteredShipments.forEach(shipment => {
        const driver = db.getDrivers().find(d => d.id === shipment.driverId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${shipment.id}</strong></td>
            <td>${shipment.customer}</td>
            <td>${shipment.origin}</td>
            <td>${shipment.destination}</td>
            <td>${shipment.weight}</td>
            <td><span class="status-badge status-${shipment.status}">${shipment.status.replace('-', ' ').toUpperCase()}</span></td>
            <td>${shipment.shippedDate}</td>
            <td>${shipment.estimatedDelivery}</td>
            <td>
                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.85rem;" onclick="viewShipment('${shipment.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85rem;" onclick="deleteShipmentRecord('${shipment.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterShipmentsByStatus(status) {
    shipmentFilterStatus = status;
    loadShipments();
}

function openShipmentModal() {
    document.getElementById('shipmentModal').classList.add('active');
}

function deleteShipmentRecord(id) {
    if (confirm('Are you sure you want to delete this shipment?')) {
        db.deleteShipment(id);
        loadShipments();
        showNotification('Shipment deleted successfully!');
    }
}

document.getElementById('shipmentForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const shipment = {
        customer: document.getElementById('shipmentCustomer').value,
        email: document.getElementById('shipmentEmail').value,
        origin: document.getElementById('shipmentOrigin').value,
        destination: document.getElementById('shipmentDestination').value,
        weight: parseFloat(document.getElementById('shipmentWeight').value),
        estimatedDelivery: document.getElementById('shipmentDelivery').value,
        description: document.getElementById('shipmentDescription').value,
        status: 'pending',
        shippedDate: new Date().toLocaleDateString(),
        driverId: null
    };
    
    db.addShipment(shipment);
    closeModal('shipmentModal');
    loadShipments();
    showNotification('Shipment created successfully!');
    e.target.reset();
});

// ===== ORDERS PAGE =====
let orderFilterStatus = 'all'; // Track current filter

function loadOrders() {
    const orders = db.getOrders();
    const tbody = document.getElementById('ordersTable');
    tbody.innerHTML = '';

    // Filter orders based on selected status
    let filteredOrders = orders;
    if (orderFilterStatus !== 'all') {
        filteredOrders = orders.filter(order => order.status === orderFilterStatus);
    }

    if (filteredOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No orders found</td></tr>';
        return;
    }

    filteredOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>$${order.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            <td>${order.items}</td>
            <td><span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span></td>
            <td>${order.orderDate}</td>
            <td>
                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.85rem;" onclick="deleteOrderRecord('${order.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterOrders(status) {
    orderFilterStatus = status;
    loadOrders();
}

function openOrderModal() {
    document.getElementById('orderModal').classList.add('active');
}

function deleteOrderRecord(id) {
    if (confirm('Are you sure you want to delete this order?')) {
        db.deleteOrder(id);
        loadOrders();
        showNotification('Order deleted successfully!');
    }
}

document.getElementById('orderForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const order = {
        customer: document.getElementById('orderCustomer').value,
        amount: parseFloat(document.getElementById('orderAmount').value),
        items: document.getElementById('orderItems').value,
        status: 'pending',
        orderDate: new Date().toLocaleDateString()
    };
    
    db.addOrder(order);
    closeModal('orderModal');
    loadOrders();
    showNotification('Order created successfully!');
    e.target.reset();
});

// ===== DRIVERS PAGE =====
function loadDrivers() {
    const drivers = db.getDrivers();
    const grid = document.getElementById('driversGrid');
    grid.innerHTML = '';

    drivers.forEach(driver => {
        const card = document.createElement('div');
        card.className = 'driver-card';
        card.innerHTML = `
            <img src="${driver.avatar}" alt="${driver.name}" class="driver-avatar">
            <h3 class="driver-name">${driver.name}</h3>
            <p class="driver-role">${driver.email}</p>
            <p class="driver-info"><i class="fas fa-phone"></i> ${driver.phone}</p>
            <p class="driver-info"><i class="fas fa-id-card"></i> ${driver.license}</p>
            <span class="driver-status ${driver.status}">${driver.status.toUpperCase()}</span>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button class="btn btn-primary" style="flex: 1; padding: 8px;" onclick="editDriver('${driver.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-secondary" style="flex: 1; padding: 8px;" onclick="deleteDriver('${driver.id}')"><i class="fas fa-trash"></i></button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openDriverModal() {
    document.getElementById('driverModal').classList.add('active');
}

function deleteDriver(id) {
    if (confirm('Are you sure you want to delete this driver?')) {
        db.deleteDriver(id);
        loadDrivers();
        showNotification('Driver deleted successfully!');
    }
}

function editDriver(id) {
    showNotification('Edit driver feature coming soon!');
}

document.getElementById('driverForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const driver = {
        name: document.getElementById('driverName').value,
        email: document.getElementById('driverEmail').value,
        phone: document.getElementById('driverPhone').value,
        license: document.getElementById('driverLicense').value,
        status: document.getElementById('driverStatus').value.toLowerCase()
    };
    
    db.addDriver(driver);
    closeModal('driverModal');
    loadDrivers();
    showNotification('Driver added successfully!');
    e.target.reset();
});

// ===== VEHICLES PAGE =====
function loadVehicles() {
    const vehicles = db.getVehicles();
    const drivers = db.getDrivers();
    const tbody = document.getElementById('vehiclesTable');
    tbody.innerHTML = '';

    vehicles.forEach(vehicle => {
        const driver = drivers.find(d => d.id === vehicle.driverId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${vehicle.id}</strong></td>
            <td>${vehicle.licensePlate}</td>
            <td>${vehicle.type}</td>
            <td>${vehicle.capacity}</td>
            <td>${driver ? driver.name : 'Unassigned'}</td>
            <td><span class="status-badge status-${vehicle.status}">${vehicle.status.toUpperCase()}</span></td>
            <td>
                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.85rem;" onclick="deleteVehicle('${vehicle.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openVehicleModal() {
    const driverSelect = document.getElementById('vehicleDriver');
    driverSelect.innerHTML = '';
    db.getDrivers().forEach(driver => {
        const option = document.createElement('option');
        option.value = driver.id;
        option.textContent = driver.name;
        driverSelect.appendChild(option);
    });
    document.getElementById('vehicleModal').classList.add('active');
}

function deleteVehicle(id) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        db.deleteVehicle(id);
        loadVehicles();
        showNotification('Vehicle deleted successfully!');
    }
}

document.getElementById('vehicleForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const vehicle = {
        licensePlate: document.getElementById('vehicleLicense').value,
        type: document.getElementById('vehicleType').value,
        capacity: parseInt(document.getElementById('vehicleCapacity').value),
        driverId: document.getElementById('vehicleDriver').value,
        status: 'active'
    };
    
    db.addVehicle(vehicle);
    closeModal('vehicleModal');
    loadVehicles();
    showNotification('Vehicle added successfully!');
    e.target.reset();
});

// ===== ANALYTICS PAGE =====
function loadAnalytics() {
    const shipments = db.getShipments();
    const orders = db.getOrders();
    const drivers = db.getDrivers();

    // Region Chart
    const regions = {};
    shipments.forEach(s => {
        const region = s.destination.split(',')[1]?.trim() || 'Other';
        regions[region] = (regions[region] || 0) + 1;
    });

    const regionCtx = document.getElementById('regionChart')?.getContext('2d');
    if (regionCtx) {
        if (charts.region) charts.region.destroy();
        charts.region = new Chart(regionCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(regions),
                datasets: [{
                    label: 'Shipments',
                    data: Object.values(regions),
                    backgroundColor: 'rgba(67, 97, 238, 0.7)',
                    borderColor: '#4361ee',
                    borderWidth: 1
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }

    // Utilization Chart
    const vehicleData = db.getVehicles().map(v => Math.random() * 100);
    const utilizationCtx = document.getElementById('utilizationChart')?.getContext('2d');
    if (utilizationCtx) {
        if (charts.utilization) charts.utilization.destroy();
        charts.utilization = new Chart(utilizationCtx, {
            type: 'radar',
            data: {
                labels: db.getVehicles().map(v => v.licensePlate),
                datasets: [{
                    label: 'Utilization %',
                    data: vehicleData,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.2)'
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }

    // Performance Chart
    const monthlyRevenue = [];
    const monthlyDeliveries = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthOrders = orders.filter(o => {
            const oDate = new Date(o.orderDate);
            return oDate.getMonth() === date.getMonth() && oDate.getFullYear() === date.getFullYear();
        });
        monthlyRevenue.push(monthOrders.reduce((sum, o) => sum + o.amount, 0));
        const monthShipments = shipments.filter(s => {
            const sDate = new Date(s.shippedDate);
            return sDate.getMonth() === date.getMonth() && sDate.getFullYear() === date.getFullYear();
        });
        monthlyDeliveries.push(monthShipments.length);
    }

    const performanceCtx = document.getElementById('performanceChart')?.getContext('2d');
    if (performanceCtx) {
        if (charts.performance) charts.performance.destroy();
        charts.performance = new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['5mo', '4mo', '3mo', '2mo', '1mo', 'Current'],
                datasets: [
                    {
                        label: 'Revenue ($)',
                        data: monthlyRevenue,
                        borderColor: '#4361ee',
                        yAxisID: 'y'
                    },
                    {
                        label: 'Shipments',
                        data: monthlyDeliveries,
                        borderColor: '#f72585',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        type: 'linear',
                        position: 'left'
                    },
                    y1: {
                        type: 'linear',
                        position: 'right'
                    }
                }
            }
        });
    }
}

// ===== USERS PAGE =====
function loadUsers() {
    const users = db.getUsers();
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="status-badge status-${user.status}">${user.status.toUpperCase()}</span></td>
            <td>${new Date(user.lastLogin).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85rem;" onclick="deleteUserRecord('${user.email}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openUserModal() {
    document.getElementById('userModal').classList.add('active');
}

function deleteUserRecord(email) {
    if (confirm('Are you sure you want to delete this user?')) {
        const db_data = db.getDatabase();
        db_data.users = db_data.users.filter(u => u.email !== email);
        db.saveDatabase(db_data);
        loadUsers();
        showNotification('User deleted successfully!');
    }
}

document.getElementById('userForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        password: 'temporary123',
        status: 'active'
    };
    
    db.addUser(user);
    closeModal('userModal');
    loadUsers();
    showNotification('User added successfully!');
    e.target.reset();
});

// ===== SETTINGS PAGE =====
function loadSettings() {
    const companyForm = document.getElementById('companyForm');
    if (companyForm) {
        companyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Settings saved successfully!');
        });
    }
}

// ===== MODALS =====
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function viewShipment(id) {
    const shipment = db.getShipments().find(s => s.id === id);
    alert(`Shipment ${id}\n\nCustomer: ${shipment.customer}\nOrigin: ${shipment.origin}\nDestination: ${shipment.destination}\nStatus: ${shipment.status}`);
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4757' : '#4361ee'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});
