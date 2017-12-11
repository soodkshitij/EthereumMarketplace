var account = web3.eth.accounts[0];

function register(f_name, l_name, em,password ,callback){
	console.log(App.getInstance());
	console.log(web3.eth.accounts[0]);
	console.log(f_name+l_name+em+password);
	App.getInstance().deployed().then(function(instance) {
	      return instance.register(f_name,l_name,em,password,{
	        from:web3.eth.accounts[0],
	        gas: 500000
	      });
	    }).then(function(result) {
	    	console.log("result "+JSON.stringify(result));
	    	return callback(result);
	    }).catch(function(err) {
	      console.error(err);
	    });
}

function setTransactionStatus(t_id, new_status, callback){
	App.getInstance().deployed().then(function(instance) {
		return instance.setTransactionStatus(t_id, new_status,{
			from:web3.eth.accounts[0],
			gas: 500000
		});
	}).then(function(result) {
		console.log(JSON.stringify(result));
		console.log("result "+result);
		return callback(result);
	}).catch(function(err) {
		console.error(err);
	});
}

function refund(t_id,money,callback){
	App.getInstance().deployed().then(function(instance) {
		return instance.refund(t_id,{
			from:web3.eth.accounts[0],
			value:money,
			gas: 500000
		});
	}).then(function(result) {
		console.log(JSON.stringify(result));
		console.log("result "+result);
		return callback(result);
	}).catch(function(err) {
		console.error(err);
	});
}

function getUsersCount(callback){
	App.getInstance().deployed().then(function(instance) {
	      return instance.getUserCount();
	    }).then(function(result) {
	    	console.log("result "+result);
	    	return callback(result);
	    }).catch(function(err) {
	      console.error(err);
	    });
}


function getTotalProductsCount(callback){
	App.getInstance().deployed().then(function(instance) {
	      return instance.getTotalProductCount();
	    }).then(function(result) {
	    	callback(result);
	    }).catch(function(err) {
	      console.error(err);
	    });
}


function getUser(callback){
	App.getInstance().deployed().then(function(instance) {
	      return instance.getUser({from:web3.eth.accounts[0]});
	    }).then(function(result) {
	    	console.log("res"+result[1]);
	    	return callback(result);
	    }).catch(function(err) {
	      console.error(err);
	    });
}

function getUserByAddress(address,callback){
	App.getInstance().deployed().then(function(instance) {
	      return instance.getUserByAddress(address);
	    }).then(function(result) {
	    	console.log("res"+result);
	    	return callback(result);
	    }).catch(function(err) {
	      console.error(err);
	    });
}

function sellProduct(p_name, cat, price, qty, dsc,image_ids,callback){
	console.log(p_name+" "+ cat +" "+ price+" "+ qty+" "+ dsc+" "+image_ids);
	var wei_price = Number(web3.toWei(price,'ether'));
	console.log("wei_price "+wei_price);
	App.getInstance().deployed().then(function(instance) {
	      return instance.sellProduct(p_name, cat, dsc, wei_price, qty, image_ids,{from:web3.eth.accounts[0]});
	    }).then(function(result) {
	    	console.log("res"+result);
	    	return callback(result);
	    }).catch(function(err) {
	      console.error(err);
	    });
}

function getProductIds(offset, limit, callback){
	App.getInstance().deployed().then(function(instance) {
	      return instance.getProductIds(offset, limit);
	    }).then(function(result) {
	    	console.log("res"+result);
	    	return callback(result);
	    }).catch(function(err) {
	      console.error(err);
	    });
}

function getProductIdsForCategory(offset, limit, category,callback){
	console.log("p_"+offset);
	console.log("p_"+limit);
	console.log("p_"+category);
	console.log(typeof offset);
	console.log(typeof limit);
	console.log(typeof category);
	App.getInstance().deployed().then(function(instance) {
	      return instance.getProductIdsForCategory(offset, limit, category);
	    }).then(function(result) {
	    	console.log("res"+result);
	    	return callback(result);
	    }).catch(function(err) {
	      console.error(err);
	    });
}

function getTotalProductCountForCategory(category,callback){
	App.getInstance().deployed().then(function(instance) {
	      return instance.getTotalProductCountForCategory(category);
	    }).then(function(result) {
	    	callback(result);
	    }).catch(function(err) {
	      console.error(err);
	    });
}


function getAllProductIds(callback){
	App.getInstance().deployed().then(function(instance) {
	      return instance.getAllProductIds();
	    }).then(function(result) {
	    	console.log("res"+result);
	    	return callback(result);
	    }).catch(function(err) {
	      console.error(err);
	    });
}

function getProduct(p_id, callback){
	App.getInstance().deployed().then(function(instance) {
	      return instance.getProduct(p_id);
	    }).then(function(result) {
	    	return callback(result);
	    }).catch(function(err) {
	      console.error(err);
	    });
}


function getTemplate(image, dsc, name, price, p_id){
	return "<div data-pid=\""+p_id+"\" class=\"item  col-xs-4 col-lg-4\"><div class=\"thumbnail\"><img style=\"height:100%;width:100%;\" object-fit: contain class=\"group list-group-image\" src=\""+image+"\" alt=\"\" /><div class=\"caption\"><h4 class=\"group inner list-group-item-heading\">"+name+"</h4><div class=\"row\"><div class=\"col-xs-12\"><p class=\"lead\">Price Ξ "+price+"</p></div></div></div></div></div>"
}


function getHtmlOfProducts(offset, limit, category){
	
	console.log("calling solidity fxn with offset "+offset+" and limit "+limit+" for category "+category);
	if (offset == 0){
		$("#products_div").empty();
	}
	if (category==""){
	getProductIds(offset, limit, function(p_ids){
		var html = "";
		console.log("p_ids "+p_ids);
		for (i=0;i<p_ids.length;i++){
			console.log(p_ids[i].toNumber());
			if (p_ids[i].toNumber()==0){
				continue;
			}
			getProduct(p_ids[i].toNumber(),function(product){
				console.log("product "+product[1]);
				console.log("cat "+product[2]);
				var image = "http://res.cloudinary.com/dqum1yaun/image/upload/"+product[6].split(",")[0];
				var dsc = product[5];
				var name = product[1];
				var price = product[3];
				var ether_price = Number(web3.fromWei(price.toNumber(),'ether'))
				console.log(price.toNumber());
				console.log(ether_price);
				console.log("qty "+product[4]);
				var p_id = product[0];
				var t= getTemplate(image, dsc, name, ether_price, p_id);
				$("#products_div").append(t);
			});
			
		}
	});
	}
	else{
		getProductIdsForCategory(offset, limit,category, function(p_ids){
			var html = "";
			console.log("p_ids "+p_ids);
			for (i=0;i<p_ids.length;i++){
				console.log(p_ids[i].toNumber());
				if (p_ids[i].toNumber()==0){
					continue;
				}
				getProduct(p_ids[i].toNumber(),function(product){
					console.log("cat "+product[2]);
					var image = "http://res.cloudinary.com/dqum1yaun/image/upload/"+product[6].split(",")[0];
					var dsc = product[5];
					var name = product[1];
					var price = product[3];
					var ether_price = Number(web3.fromWei(price.toNumber(),'ether'))
					var p_id = product[0];
					var t= getTemplate(image, dsc, name, ether_price, p_id);
					$("#products_div").append(t);
				});
				
			}
		});
	}
}

function buyProduct(p_id, qty,price,f_name,l_name,street_address,callback){
	App.getInstance().deployed().then(function(instance) {
	      return instance.buyProduct(p_id,qty,f_name,l_name,street_address,{
	        from:web3.eth.accounts[0],
	        gas: 500000,
	        value:price,
	      });
	    }).then(function(result) {
	    	console.log("result "+result);
	    	return callback(result);
	    }).catch(function(err) {
	      console.error(err);
	    });
}

function getThumbDiv(img_src,img_id){
	return "<div data-id=\""+img_id+"\" class=\"col-md-3 thumb-img\"> <img  src=\""+img_src+"\"> </div>"
}



function getBoughtTransactions(callback){
	App.getInstance().deployed().then(function(instance) {
		return instance.getTransactionIds(web3.eth.accounts[0],0);
	}).then(function(result) {
		console.log("result "+result);
		return callback(result);
	}).catch(function(err) {
		console.error(err);
	});
}

function getSoldTransactions(callback){
	App.getInstance().deployed().then(function(instance) {
		return instance.getTransactionIds(web3.eth.accounts[0],1);
	}).then(function(result) {
		console.log("result "+result);
		return callback(result);
	}).catch(function(err) {
		console.error(err);
	});
}

function getTransaction(transaction_id,callback){
	App.getInstance().deployed().then(function(instance) {
		return instance.getTransaction(transaction_id);
	}).then(function(result) {
		console.log("result "+result);
		return callback(result);
	}).catch(function(err) {
		console.error(err);
	});
}


function updateInterface(){
	console.log("acc changed");
	//alert("acc is "+account);
	//if (account!=undefined){
	//	alert("Account changed in metamask.Redirecting to login page");
	//window.location.href="/login";
	//}
}

var accountInterval = setInterval(function() {
	//alert("current acc "+web3.eth.accounts[0]+" mem acc "+account);
  if (web3.eth.accounts[0] != account) {
    account = web3.eth.accounts[0];
    updateInterface();
  }
}, 2000);


function getTransactionRowHtml(image, seller_name, price, qty, total, button_to_show, button_text,status_desc,t_id,button_status){
	return "<div class=\"row transaction-row\"> <div class=\"col-md-4\"> <img class=\"default-img\" style=\"height:150px;width:150px;\" src=\"http://res.cloudinary.com/dqum1yaun/image/upload/"+image+"\"> </div> <div class=\"col-md-3 seller-info\"> <span>Seller "+seller_name+"</span><br><span>"+status_desc+"</span><br><span data-id=\""+t_id+"\" class=\"order_c_dsc\">Customer Description</span> </div> <div class=\"col-md-2 seller-info\"> <div class=\"dummy-row\">Price =  Ξ "+price+"</div> <div class=\"dummy-row\">Quantity = " +qty+"</div> <div class=\"dummy-row total-row\">Total =  Ξ "+total+"</div> </div><div class=\"col-md-3\">"+getButtonsfortrow(button_to_show,button_text,t_id,button_status,qty,price)+"  </div>  </div>"
}

function getButtonsfortrow(button_to_show, button_text,t_id,button_status,qty,price){
	var ret = "";
	for (i=0;i<button_to_show.length;i++){
		console.log(button_to_show[i]);
		console.log(button_text[i]);
		console.log(button_status[i]);
		ret += "<button data-value=\""+price*qty+"\" data-new-status=\""+button_status[i]+"\" data-id=\""+t_id+"\" class=\""+button_to_show[i]+" button-primary order-button\" type=\"button\">"+button_text[i]+"</button>"
	}
	console.log("returning button");
	return ret;
}

function getBalance (address,callback) {
  return web3.eth.getBalance(address, function (error, result) {
    if (!error) {
			console.log(result.toNumber());
			return callback(web3.fromWei(result.toNumber(),'ether'));
    } else {
			console.error(error);
			return callback(0);
    }
  })
}

function populateTransactions(){
	getBoughtTransactions(function(b_transactions){
		for (i=0;i<b_transactions.length;i++){
			var t_id = b_transactions[i];
			getTransaction(t_id,function(transaction){
				var p_id = transaction[1];
				var status = transaction[2];
				var price = transaction[3];
				var qty = transaction[4];
				var seller = transaction[6];
				var order_data = transaction[7];
				getUserByAddress(seller,function(user){
					var seller_name = user[0]+" "+user[1];
					getProduct(p_id,function(product){
						var image = product[6].split(",")[0];
						console.log("transaction_id "+transaction[0]);
						console.log("product_id "+p_id);
						console.log("status "+status);
						console.log("price "+price);
						console.log("qty "+qty);
						console.log("seller_name "+seller_name);
						console.log("image "+image);
						var buttons_to_show = [];
						var button_text = [];
						var button_status = [];

						var status_desc = ""
						if (transaction[2]==0){
							status_desc = "Order Created";
						}

						if (transaction[2]==1){
							status_desc = "Order Shipped";
						}

						if (transaction[2]==2){
							status_desc = "Order Delivered";
						}

						if (transaction[2]==3){
							status_desc = "Refund Requested";
						}

						if (transaction[2]==4){
							status_desc = "Cancelled";
						}

						


						if (transaction[2] == 0){
							buttons_to_show.push("cancel_order");
							button_text.push("Cancel Order");
							button_status.push(4);
						}
						if (transaction[2] == 2){
							buttons_to_show.push("request_refund");
							button_text.push("Request Refund");
							button_status.push(3);
						}
						console.log("reached");
						var t = getTransactionRowHtml(image, seller_name,Number(web3.fromWei(price.toNumber(),'ether')),qty,qty*Number(web3.fromWei(price.toNumber(),'ether')),buttons_to_show,button_text,status_desc,transaction[0],button_status);
						$("#bought-transactions").append(t);
					});
				});
			});

		}
	});

	getSoldTransactions(function(b_transactions){
		for (i=0;i<b_transactions.length;i++){
			console.log("iter "+i);
			console.log("t_id "+b_transactions[i]);
			var t_id = b_transactions[i];
			getTransaction(t_id,function(transaction){
				var p_id = transaction[1];
				var status = transaction[2];
				var price = transaction[3];
				var qty = transaction[4];
				var seller = transaction[6];
				var order_data = transaction[7];
				getUserByAddress(seller,function(user){
					var seller_name = user[0]+" "+user[1];
					getProduct(p_id,function(product){
						var image = product[6].split(",")[0];
						console.log("transaction_id "+transaction[0]);
						console.log("product_id "+p_id);
						console.log("status "+status);
						console.log("price "+price);
						console.log("qty "+qty);
						console.log("seller_name "+seller_name);
						console.log("image "+image);

						var status_desc = ""
						if (transaction[2]==0){
							status_desc = "Order Created";
						}

						if (transaction[2]==1){
							status_desc = "Order Shipped";
						}

						if (transaction[2]==2){
							status_desc = "Order Delivered";
						}

						if (transaction[2]==3){
							status_desc = "Refund Requested";
						}

						if (transaction[2]==4){
							status_desc = "Cancelled";
						}



						var buttons_to_show = [];
						var button_text = [];
						var button_status = [];

						if (transaction[2] == 0){
							buttons_to_show.push("cancel_order");
							button_text.push("Cancel Order");
							button_status.push(4);
							buttons_to_show.push("mark_ship");
							button_text.push("Mark Shipped");
							button_status.push(1);
						}
						if (transaction[2] == 1){
							buttons_to_show.push("mark_delivered");
							button_text.push("Mark Delivered");
							button_status.push(2);
						}

						if (transaction[2] == 3){
							buttons_to_show.push("cancel_order");
							button_text.push("Cancel Order");	
							button_status.push(4);
						}


						var t = getTransactionRowHtml(image, seller_name,Number(web3.fromWei(price.toNumber(),'ether')),qty,qty*Number(web3.fromWei(price.toNumber(),'ether')),buttons_to_show,button_text,status_desc,transaction[0],button_status);
						$("#sold-transactions").append(t);
					});
				});
			});

		}
	});
	
}

