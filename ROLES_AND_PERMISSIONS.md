# 👥 Role-Based Access Control

## Admin - Full Control
**Login:** admin@logitrack.com / password123

**Can Access:**
- ✅ Dashboard (full analytics)
- ✅ Shipments (create, view, filter, delete)
- ✅ Orders (create, view, filter, delete)
- ✅ Drivers (manage)
- ✅ Vehicles (manage)
- ✅ Analytics (view reports & charts)
- ✅ Users (manage all users, approve new accounts)
- ✅ Settings (company configuration)

**Special Abilities:**
- Approve/reject new account requests
- Assign roles to new employees
- View all analytics and reports
- Manage all users in the system

---

## Manager - Operations Control
**Login:** john@logitrack.com / password123

**Can Access:**
- ✅ Dashboard (overview)
- ✅ Shipments (create, view, filter)
- ✅ Orders (manage)
- ✅ Drivers (manage)
- ✅ Vehicles (manage)
- ✅ Analytics (view reports)
- ❌ Users (cannot manage)
- ❌ Settings (cannot change)

**Typical Duties:**
- Manage shipments and track deliveries
- Oversee drivers and vehicles
- Handle customer orders
- View operational analytics

---

## Office Employee - Limited Access (NEW!)
**Login:** employee@logitrack.com / password123

**Can Access:**
- ✅ Dashboard (simplified view - no charts)
- ✅ Orders (create new, view, filter by status)
- ✅ Shipments (view status, filter)
- ❌ Drivers (cannot access)
- ❌ Vehicles (cannot access)
- ❌ Analytics (cannot access)
- ❌ Users (cannot access)
- ❌ Settings (cannot access)

**Typical Duties:**
- Create customer orders
- Track order status
- View shipment progress
- Handle customer inquiries

**Dashboard Shows:**
- Pending Orders count
- In-Transit Shipments count
- Total Revenue
- Recent shipments table
- **NO charts/analytics**

---

## Driver - Delivery Focus
**Login:** sarah@logitrack.com / password123

**Can Access:**
- ✅ Dashboard (view assigned deliveries)
- ✅ Shipments (view their deliveries)
- ❌ Orders (cannot access)
- ❌ Drivers (cannot access)
- ❌ Vehicles (cannot access)
- ❌ Analytics (cannot access)
- ❌ Users (cannot access)
- ❌ Settings (cannot access)

**Typical Duties:**
- View assigned shipments
- Check delivery routes
- Update delivery status

---

## 🔄 Office Employee Workflow Example

**Scenario:** Customer places order

1. **Employee Login** → Sees simplified dashboard
2. **Click Orders** → Creates new order
   - Customer name
   - Order amount
   - Items
   - Status: Auto-set to "pending"
3. **Order appears in table** → Can filter (Pending, Processing, Completed)
4. **Click Shipments** → Tracks if order becomes shipment
   - Views status (Pending, Processing, In-Transit, Delivered)
   - Filters by status
   - Cannot assign drivers or modify vehicle details
5. **Updates go to management** → Manager assigns drivers/vehicles

---

## Access Comparison Table

| Feature | Admin | Manager | Employee | Driver |
|---------|-------|---------|----------|--------|
| Dashboard | ✅ Full | ✅ Full | ✅ Simple | ✅ Limited |
| Orders | ✅ CRUD | ✅ CRUD | ✅ Create/View | ❌ |
| Shipments | ✅ CRUD | ✅ CRUD | ✅ View/Filter | ✅ View |
| Drivers | ✅ CRUD | ✅ CRUD | ❌ | ❌ |
| Vehicles | ✅ CRUD | ✅ CRUD | ❌ | ❌ |
| Analytics | ✅ Full | ✅ View | ❌ | ❌ |
| Users | ✅ Approve | ❌ | ❌ | ❌ |
| Settings | ✅ Manage | ❌ | ❌ | ❌ |

---

## 📝 Data Input by Office Employee

Office employees can **create/input**:

### Orders
- Customer name
- Email address  
- Order amount
- Items description
- Status automatically set to "pending"

### Shipments (if allowed)
- Customer name
- Email
- Origin city
- Destination city
- Weight (kg)
- Description
- Estimated delivery date
- Status starts as "pending"

They **cannot**:
- Assign drivers
- Assign vehicles
- Change payment info
- Modify company settings
- Access user management

---

## 🔐 Security Features

✅ **Role-Based Navigation** - Menu items hidden based on role
✅ **Function Protection** - Can't access restricted pages even via URL
✅ **Approval System** - New accounts must be approved by Admin
✅ **Clear Role Badges** - Users see their role in sidebar
✅ **Simplified Dashboards** - Different views per role

---

## 📱 Try It Now

Visit: **https://captain3m0v-2.github.io/logitrack/**

**Test different roles:**
1. Login as Admin → See everything
2. Logout, login as Employee → See only Orders, Shipments, Dashboard
3. Notice: No Analytics, Users, Drivers, Vehicles tabs!

---

**Perfect for logistics companies!** Each role has exactly what they need. 🚚
