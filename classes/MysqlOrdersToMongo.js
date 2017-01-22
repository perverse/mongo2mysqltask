"use strict"

/** Class used to handle order migration from mysql tables to mongo collection **/
class MysqlOrdersToMongo {
    /**
     * Create a MysqlOrderToMongo object
     * @param {object} opts - Options for the object include "mysql" - a mysql connection object and "mongo" - a mongodb connection object
     */
    constructor(opts) {
        // attach our dbs
        this.mysql = opts.mysql;
        this.mongo = opts.mongo;
        this.targetCollection = opts['MONGO_DB_COLLECTION'] || 'orders';
    }

    /**
     * Get all customers with an order from mysql database
     * @return {Promise} A promise that resolves with the customers resultset
     */
    getCustomersWithOrder() {
        return this.mysql.query("SELECT c.id, c.email, c.name FROM customers c WHERE c.id IN (SELECT DISTINCT o.customerId FROM orders o)").then(results => results[0]);
    }

    /**
     * Get all orders in the database
     * @return {Promise} A promise that resolves with the orders resultset
     */
    getOrders() {
        return this.mysql.query("SELECT id, created, customerId FROM orders").then(results => results[0]);
    }

    /**
     * Get products associated with a specific order from the mysql database
     * @return {Promise} A promise that resolves with the products resultset
     */
    getOrderProducts(orderId) {
        // im doing a seperate lookup for "amount" here anyway, so instead of caching all products and doing in-memory lookup, we'll just grab as part of this query
        return this.mysql.query("SELECT p.name, p.cost, op.amount FROM orders_products op LEFT JOIN products p ON p.id = op.productId WHERE op.orderId = " + orderId).then(results => results[0]);
    }

    /**
     * Find customer by id within cached resultset
     * @return {object|null} Customer object if customer is found, null if not
     */
    insertOrdersIntoMongo(orders) {
        return this.mongo.collection(this.targetCollection).insertMany(orders).then((res) => {
            this.mongo.close();
            return res.result;
        });
    }

    /**
     * Find customer by id within cached resultset
     * @return {object|null} Customer object if customer is found, null if not
     */
    seekCustomerById(customerId, customers) {
        return customers[customers.findIndex(customer => customer.id == customerId)] || null;
    }

    /**
     * Migrate mysql records to mongodb collection
     * @return {Promise} Promise resolves if migration process is successful, is rejected along the way if there is an error in the process.
     */
    migrate() {
        let customers;
        let _self = this;

        return this.getCustomersWithOrder().then((results) => {
            // cache customers for later - no need to keep looking them up
            customers = results;

            // get orders
            return _self.getOrders();
        }).map((order) => { // iterate over orders
            // get customer for each order
            let customer = _self.seekCustomerById(order.customerId, customers);

            order.customer = JSON.parse(JSON.stringify(customer)); // cheap and dirty object clone so we can remove id
            delete order.customer.id;
            delete order.customerId;

            // add products to order and return fully formatted order. we could do this as a promise.all if we had more to lookup than just products
            // but it would be overkill here.
            return _self.getOrderProducts(order.id).then((products) => {
                order.products = products;
                delete order.id;

                return order;
            });
        }).then((orders) => {
            // got our formatted orders, time to bulk insert to mongo.
            return _self.insertOrdersIntoMongo(orders);
        });
    }
}

module.exports = MysqlOrdersToMongo;