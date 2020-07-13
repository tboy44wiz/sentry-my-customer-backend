const userModel = require('../models/user');
const storeAdminModel = require('../models/store_admin');
const storeModel = require('../models/store');
const customerModel = require('../models/customer');

exports.storeAdminDashboard = async (req, res)=>{
    const identifier = req.user.phone_number;
    
    const user = await userModel.findOne({phone_number: identifier});
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
            data: null
        })
    }

    if (user.user_role == "store_admin") {
        const storeAdmin = await storeAdminModel.findOne({identifier});
        const data = {};
        const stores = user.stores;
        const assistants = user.assistants
        data.storeCount = stores.length;
        data.assistantCount = assistants.length;
        data.customerCount = 0;
        data.newCustomers = []
        data.transactions = []
        stores.forEach(store => {
            data.customerCount = data.customerCount + store.customers.length;
            const customers = store.customers;
            let date = new Date();
            const newCustomers = customers.filter(element => {
                return element.createdAt.toDateString() == date.toDateString()
            });
            if (newCustomers.length > 0) {
                newCustomers.forEach(element => data.newCustomers.push({
                    name: element.name, 
                    phone_number: element.phone_number, 
                    email: element.email
                }));
            }
           
            customers.forEach(customer => {
            if (customer.transactions.length != 0) {
                let obj = {};
                obj.storeName = store.store_name;
                obj.customerName = customer.name;
                obj.transactions = customer.transactions;

                data.transactions.push(obj);
            }
            });
        });
        
    }
   
    
    
    stores.forEach((store) => {
        
      });
}


//utility functions