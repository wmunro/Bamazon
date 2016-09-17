var prompt = require('prompt');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Pepsi01',
  database : 'bamazon'
});

connection.connect(function(err)
{
	if (err)
	{
		console.log(err);
	}
	console.log("Welcome to Bamazon!");
});

connection.query('SELECT * FROM products', function(err, rows){
	if (err)
	{
    return callback(err);
  }
  console.log("Item ID\tItem Name\t\tPrice");
  for(var i = 0; i < rows.length; i++)
  {
  	console.log(rows[i].itemID + '\t' + rows[i].productname + '\t\t$' + rows[i].price + '\t');
  }
  console.log("\nWhat would you like to order?\nEnter the item ID number and a quantity.");
	prompt.start();
	prompt.get(['itemID', 'quantity'], function(err, order){
		ID = order.itemID;
		quantity = order.quantity;
		prompt.stop();
		connection.query('SELECT * FROM products WHERE itemID = "' + ID + '"', function(err, product){
  		if(product[0].stockquantity >= quantity)
  		{
  			var newQuant = product[0].stockquantity - quantity;
  			connection.query('UPDATE products SET stockquantity = "' + newQuant + '" WHERE itemID = "' + ID + '"', function(err, result){
  				if(err)
  				{
  					throw err;
  				}
  			});
  			console.log("You ordered " + quantity + " of this item: " + product[0].productname);
				console.log("Your total is: $" + product[0].price * quantity);
			}
			else
			{
				console.log("Insufficient Quantity.  Transaction could not be completed.");
			}
		});
	});
});