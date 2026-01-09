// ===== LOGISTICS DATABASE =====
// LocalStorage-based database for the logistics application

class LogisticsDatabase {
    constructor() {
        this.dbName = 'logitrack_db';
        this.initializeDatabase();
    }

    initializeDatabase() {
        if (!localStorage.getItem(this.dbName)) {
            const initialData = {
                users: [
                    {
                        id: 'USR001',
                        name: 'Admin User',
                        email: 'admin@logitrack.com',
                        password: 'password123',
                        role: 'Admin',
                        status: 'active',
                        approval: 'approved',
                        lastLogin: new Date().toISOString()
                    },
                    {
                        id: 'USR002',
                        name: 'John Manager',
                        email: 'john@logitrack.com',
                        password: 'password123',
                        role: 'Manager',
                        status: 'active',
                        approval: 'approved',
                        lastLogin: new Date(Date.now() - 3600000).toISOString()
                    },
                    {
                        id: 'USR003',
                        name: 'Sarah Driver',
                        email: 'sarah@logitrack.com',
                        password: 'password123',
                        role: 'Driver',
                        status: 'active',
                        approval: 'approved',
                        lastLogin: new Date(Date.now() - 7200000).toISOString()
                    },
                    {
                        id: 'USR004',
                        name: 'Office Employee',
                        email: 'employee@logitrack.com',
                        password: 'password123',
                        role: 'Office Employee',
                        status: 'active',
                        approval: 'approved',
                        lastLogin: new Date().toISOString()
                    }
                ],
                shipments: [
                    {
                        id: 'SHP001',
                        customer: 'ABC Electronics',
                        email: 'contact@abcelectronics.com',
                        origin: 'New York, NY',
                        destination: 'Los Angeles, CA',
                        weight: 150.5,
                        status: 'in-transit',
                        shippedDate: new Date(Date.now() - 86400000).toLocaleDateString(),
                        estimatedDelivery: new Date(Date.now() + 172800000).toLocaleDateString(),
                        description: 'Electronics shipment',
                        driverId: 'DRV001'
                    },
                    {
                        id: 'SHP002',
                        customer: 'Tech Store Inc',
                        email: 'logistics@techstore.com',
                        origin: 'Chicago, IL',
                        destination: 'Houston, TX',
                        weight: 200,
                        status: 'processing',
                        shippedDate: new Date(Date.now() - 172800000).toLocaleDateString(),
                        estimatedDelivery: new Date(Date.now() + 259200000).toLocaleDateString(),
                        description: 'Computer parts',
                        driverId: 'DRV002'
                    },
                    {
                        id: 'SHP003',
                        customer: 'Fashion World',
                        email: 'ship@fashionworld.com',
                        origin: 'Miami, FL',
                        destination: 'Seattle, WA',
                        weight: 75.25,
                        status: 'delivered',
                        shippedDate: new Date(Date.now() - 604800000).toLocaleDateString(),
                        estimatedDelivery: new Date(Date.now() - 259200000).toLocaleDateString(),
                        description: 'Clothing items',
                        driverId: 'DRV003'
                    },
                    {
                        id: 'SHP004',
                        customer: 'Industrial Supplies',
                        email: 'orders@indus.com',
                        origin: 'Dallas, TX',
                        destination: 'Boston, MA',
                        weight: 500,
                        status: 'pending',
                        shippedDate: new Date().toLocaleDateString(),
                        estimatedDelivery: new Date(Date.now() + 432000000).toLocaleDateString(),
                        description: 'Heavy machinery parts',
                        driverId: null
                    }
                ],
                orders: [
                    {
                        id: 'ORD001',
                        customer: 'ABC Electronics',
                        amount: 5500.00,
                        items: '50x Laptops, 30x Monitors',
                        status: 'completed',
                        orderDate: new Date(Date.now() - 604800000).toLocaleDateString()
                    },
                    {
                        id: 'ORD002',
                        customer: 'Tech Store Inc',
                        amount: 3200.50,
                        items: 'Hard drives, SSDs, RAM modules',
                        status: 'completed',
                        orderDate: new Date(Date.now() - 432000000).toLocaleDateString()
                    },
                    {
                        id: 'ORD003',
                        customer: 'Fashion World',
                        amount: 8900.00,
                        items: 'Designer clothing collection',
                        status: 'pending',
                        orderDate: new Date(Date.now() - 86400000).toLocaleDateString()
                    },
                    {
                        id: 'ORD004',
                        customer: 'Global Retail',
                        amount: 12500.00,
                        items: 'Mixed retail products',
                        status: 'processing',
                        orderDate: new Date().toLocaleDateString()
                    }
                ],
                drivers: [
                    {
                        id: 'DRV001',
                        name: 'John Smith',
                        email: 'john.smith@logitrack.com',
                        phone: '555-0101',
                        license: 'DL123456',
                        status: 'active',
                        avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=random'
                    },
                    {
                        id: 'DRV002',
                        name: 'Maria Garcia',
                        email: 'maria.garcia@logitrack.com',
                        phone: '555-0102',
                        license: 'DL234567',
                        status: 'active',
                        avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=random'
                    },
                    {
                        id: 'DRV003',
                        name: 'David Johnson',
                        email: 'david.johnson@logitrack.com',
                        phone: '555-0103',
                        license: 'DL345678',
                        status: 'active',
                        avatar: 'https://ui-avatars.com/api/?name=David+Johnson&background=random'
                    }
                ],
                vehicles: [
                    {
                        id: 'VEH001',
                        licensePlate: 'ABC-1234',
                        type: 'Van',
                        capacity: 1000,
                        driverId: 'DRV001',
                        status: 'active'
                    },
                    {
                        id: 'VEH002',
                        licensePlate: 'XYZ-5678',
                        type: 'Truck',
                        capacity: 5000,
                        driverId: 'DRV002',
                        status: 'active'
                    },
                    {
                        id: 'VEH003',
                        licensePlate: 'DEF-9012',
                        type: 'Truck',
                        capacity: 3000,
                        driverId: 'DRV003',
                        status: 'active'
                    }
                ]
            };
            localStorage.setItem(this.dbName, JSON.stringify(initialData));
        }
    }

    getDatabase() {
        const data = localStorage.getItem(this.dbName);
        return data ? JSON.parse(data) : null;
    }

    saveDatabase(data) {
        localStorage.setItem(this.dbName, JSON.stringify(data));
    }

    // ===== USER OPERATIONS =====
    getUsers() {
        const db = this.getDatabase();
        return db ? db.users : [];
    }

    addUser(user) {
        const db = this.getDatabase();
        user.id = 'USR' + String(db.users.length + 1).padStart(3, '0');
        db.users.push(user);
        this.saveDatabase(db);
        return user;
    }

    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email);
    }

    // ===== SHIPMENT OPERATIONS =====
    getShipments() {
        const db = this.getDatabase();
        return db ? db.shipments : [];
    }

    addShipment(shipment) {
        const db = this.getDatabase();
        shipment.id = 'SHP' + String(db.shipments.length + 1).padStart(3, '0');
        db.shipments.push(shipment);
        this.saveDatabase(db);
        return shipment;
    }

    updateShipment(id, updates) {
        const db = this.getDatabase();
        const shipment = db.shipments.find(s => s.id === id);
        if (shipment) {
            Object.assign(shipment, updates);
            this.saveDatabase(db);
        }
        return shipment;
    }

    deleteShipment(id) {
        const db = this.getDatabase();
        db.shipments = db.shipments.filter(s => s.id !== id);
        this.saveDatabase(db);
    }

    // ===== ORDER OPERATIONS =====
    getOrders() {
        const db = this.getDatabase();
        return db ? db.orders : [];
    }

    addOrder(order) {
        const db = this.getDatabase();
        order.id = 'ORD' + String(db.orders.length + 1).padStart(3, '0');
        db.orders.push(order);
        this.saveDatabase(db);
        return order;
    }

    updateOrder(id, updates) {
        const db = this.getDatabase();
        const order = db.orders.find(o => o.id === id);
        if (order) {
            Object.assign(order, updates);
            this.saveDatabase(db);
        }
        return order;
    }

    deleteOrder(id) {
        const db = this.getDatabase();
        db.orders = db.orders.filter(o => o.id !== id);
        this.saveDatabase(db);
    }

    // ===== DRIVER OPERATIONS =====
    getDrivers() {
        const db = this.getDatabase();
        return db ? db.drivers : [];
    }

    addDriver(driver) {
        const db = this.getDatabase();
        driver.id = 'DRV' + String(db.drivers.length + 1).padStart(3, '0');
        driver.avatar = `https://ui-avatars.com/api/?name=${driver.name.replace(' ', '+')}&background=random`;
        db.drivers.push(driver);
        this.saveDatabase(db);
        return driver;
    }

    updateDriver(id, updates) {
        const db = this.getDatabase();
        const driver = db.drivers.find(d => d.id === id);
        if (driver) {
            Object.assign(driver, updates);
            this.saveDatabase(db);
        }
        return driver;
    }

    deleteDriver(id) {
        const db = this.getDatabase();
        db.drivers = db.drivers.filter(d => d.id !== id);
        this.saveDatabase(db);
    }

    // ===== VEHICLE OPERATIONS =====
    getVehicles() {
        const db = this.getDatabase();
        return db ? db.vehicles : [];
    }

    addVehicle(vehicle) {
        const db = this.getDatabase();
        vehicle.id = 'VEH' + String(db.vehicles.length + 1).padStart(3, '0');
        db.vehicles.push(vehicle);
        this.saveDatabase(db);
        return vehicle;
    }

    updateVehicle(id, updates) {
        const db = this.getDatabase();
        const vehicle = db.vehicles.find(v => v.id === id);
        if (vehicle) {
            Object.assign(vehicle, updates);
            this.saveDatabase(db);
        }
        return vehicle;
    }

    deleteVehicle(id) {
        const db = this.getDatabase();
        db.vehicles = db.vehicles.filter(v => v.id !== id);
        this.saveDatabase(db);
    }

    // ===== ANALYTICS =====
    getStatistics() {
        const shipments = this.getShipments();
        const orders = this.getOrders();
        const drivers = this.getDrivers();
        const vehicles = this.getVehicles();

        return {
            totalShipments: shipments.length,
            activeShipments: shipments.filter(s => s.status === 'in-transit').length,
            pendingShipments: shipments.filter(s => s.status === 'pending').length,
            deliveredShipments: shipments.filter(s => s.status === 'delivered').length,
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            totalRevenue: orders.reduce((sum, o) => sum + o.amount, 0),
            totalDrivers: drivers.length,
            activeDrivers: drivers.filter(d => d.status === 'active').length,
            totalVehicles: vehicles.length,
            activeVehicles: vehicles.filter(v => v.status === 'active').length
        };
    }
}

// Initialize the database globally
const db = new LogisticsDatabase();
