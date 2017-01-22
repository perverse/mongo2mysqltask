# Node.js Mysql2Mongo Migration Example

This is a simple nodejs app to meet the business requirements of a coding task.

The task is as follows:

>Create a NodeJS application that reads in the provided data from a MySQL database and feeds it through to MongoDB in a more appropriate MongoDB JSON document format.
>The MySQL database to use is attached with the following tables:
>· customers – customer records to store the people creating orders.
>· products – contains purchasable products.
>· orders – contains orders with a reference to the customer making the order.
>· orders_products – a table that joins orders with products.
>
>Some sample data to work with is already included in the database.
>The MongoDB database should have one new collection called “orders” with documents that look like:
>{
>    _id: ObjectId(...),
>    created: Date(...),
>    customer: {
>        name: "John Smith",
>        email: "john.smith@nowhere.com"
>    },
>    products: [
>        { name: "Hat", cost: 100, amount: 1 },
>        { name: "Shoe", cost: 600, amount: 3 },
>    ]
>}
>Additional:
>· The project should be supplied as a Git repository with a properly configured .gitignore to avoid moving around dependencies.
>· A clear README that describes initial setup and usage of the application should be included.
>· Use of ES6 syntax and constructs is favorable (assume the application will run in a Node >6.x environment).
>· Any remarks about the approach you’ve used and why will be valuable