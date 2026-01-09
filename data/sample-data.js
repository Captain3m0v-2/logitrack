// data/sample-data.js

// Sample orders data
const orders = [
    { id: "#ORD-7821", customer: "John Smith", date: "2023-10-15", amount: "$245.99", status: "completed" },
    { id: "#ORD-7822", customer: "Emma Johnson", date: "2023-10-14", amount: "$1,245.75", status: "processing" },
    { id: "#ORD-7823", customer: "Michael Brown", date: "2023-10-13", amount: "$89.50", status: "completed" },
    { id: "#ORD-7824", customer: "Sarah Davis", date: "2023-10-12", amount: "$542.30", status: "pending" },
    { id: "#ORD-7825", customer: "Robert Wilson", date: "2023-10-11", amount: "$321.45", status: "completed" },
    { id: "#ORD-7826", customer: "Lisa Anderson", date: "2023-10-10", amount: "$98.20", status: "processing" },
    { id: "#ORD-7827", customer: "James Taylor", date: "2023-10-09", amount: "$1,532.80", status: "completed" },
    { id: "#ORD-7828", customer: "Jennifer Martinez", date: "2023-10-08", amount: "$245.00", status: "pending" }
];

// Chart data
const chartData = {
    monthlyRevenue: [12500, 19000, 15000, 22000, 18000, 25000, 30000, 28000, 32000, 24580, 27000, 31000],
    weeklyRevenue: [5800, 6200, 5400, 7100, 6800, 7500, 8000],
    monthlyLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weeklyLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
    activitySessions: [420, 530, 480, 620, 710, 890, 750],
    activityPageviews: [1200, 1500, 1350, 1800, 2100, 2400, 2000],
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
};

// Stats data for different time periods
const statsData = {
    week: {
        revenue: '$5,240',
        users: '892',
        orders: '78',
        growth: '+5.2%'
    },
    month: {
        revenue: '$24,580',
        users: '1,842',
        orders: '324',
        growth: '+12.5%'
    },
    quarter: {
        revenue: '$68,450',
        users: '4,210',
        orders: '892',
        growth: '+8.7%'
    },
    year: {
        revenue: '$285,600',
        users: '12,845',
        orders: '3,245',
        growth: '+15.3%'
    }
};