$(function() {
	
	$("#signup").on('click', function(){
		console.log("login clicked");
		getUser(function(res){
			console.log("res in login "+res);
			if (res[1]!="0x0000000000000000000000000000000000000000"){
				alert("You are already registered with this account");
				return;
			}
			else{
				console.log("going to sign up");
				
				var f_name = $(".signupform [name='first_name']").val()
				var l_name = $(".signupform [name='last_name']").val()
				var email = $(".signupform [name='email']").val()
				var password = $(".signupform [name='password']").val()
				
				register(f_name,l_name, email,password,function(res){
					console.log("res in signup "+JSON.stringify(res));
					window.location.reload(false);
				});
				
			}
			
			
		});
	});
	
	
	$("#login").on('click', function(){
		getUser(function(res){
			var pass = $("#pass-login").val();
			if (res[1]==web3.eth.accounts[0] && res[5]==pass){
				alert("Welcome! "+res[2]+" "+res[3]);
				window.location.href="/buy";
			}
			else{
				alert("Please signup.You are not registered.")
			}
		});
	});
	
	$("#post-sell-ad").on('click',function(){
		console.log("ad submit");
		var p_name = $("#form_name").val();
		var cat = $( "#cat option:selected" ).val();
		var price = $("#form_price").val();
		var qty = $("#form_quantity").val();
		var dsc = $("#form_message").val();
		var image_ids = $("#uploaded-public-keys").val();
		if (image_ids==""){
			alert("Please post at least one image");
			return false;
		}
		
		
		console.log(p_name+cat+price+qty+dsc);
		sellProduct(p_name, cat, price, qty, dsc,image_ids, function(res){
			console.log("res in evenjts "+res);
			$("#contact-form")[0].reset();
			$("#uploaded-public-keys").val("");
			$.notify("Advert has been successfully to blockchain", {
				offset: 80,
				animate: {
					enter: 'animated bounceIn',
					exit: 'animated bounceOut'
				}
			});
		});
		return false;
	});
	
	$(document).on('click', ".item" , function() {
		console.log("click");
		var p_id = Number($(this).attr('data-pid'));
		getProduct(p_id,function(product){
			var name = product[1];
			var unit_price = product[3];
			var qty = Number(product[4]);
			var dsc = product[5];
			var images = product[6];
			var seller = product[7];
			console.log(seller);
			
			var qty_div = "<span>Quantity</span><select style=\"margin-left:10px;\" class=\"\" id=\"selected_quantity\" name=\"quantity\">";
			
			for (q=1;q<=qty;q++){
				qty_div = qty_div+"<option value=\""+q+"\">"+q+"</option>";
			}
			
			qty_div = qty_div+"</select>"
			
			$(".p_quantity").empty();
			$(".p_quantity").append(qty_div);
			$(".p_t_p").show();
			
			$(".p_name_span").text(name);
			if (seller==web3.eth.accounts[0]){
				$(".seller_name").text("You");
				$(".p_t_p").hide();
			}
			else{
				getUserByAddress(seller,function(user){
					$(".seller_name").text(user[0]+" "+user[1]);
				});
			}
			$(".p_price_span").text("Price Ξ "+Number(web3.fromWei(unit_price,'ether')));
			$(".p_dsc_span").text(dsc);
			$(".buy-product").attr('data-pid',p_id);
			$(".buy-product").attr('data-price',unit_price);
			$(".default-img").attr('src',"http://res.cloudinary.com/dqum1yaun/image/upload/w_400,h_300,c_fit/"+images.split(",")[0]);
			$(".thumb-cont").empty();
			
			var imgs = images.split(",");
			
			for(i=0;i<imgs.length;i++){
				if (imgs[i]==""){
					continue;
				}
				var d = getThumbDiv("http://res.cloudinary.com/dqum1yaun/image/upload/w_50,h_50,c_fit/"+imgs[i],imgs[i])
				$(".thumb-cont").append(d);
			}
			
			
		});
		
		$('#buyModal').modal('show');
		
	});


	$(document).on('click', ".order_c_dsc" , function() {
		var t_id = $(this).attr('data-id');
		//alert("t_id "+t_id);
		getTransaction(t_id,function(transaction){
			var name = transaction[8]+" "+transaction[9];
			var add = transaction[10];
			$("#transactionModal .t_id").text("Transaction ID - # "+t_id);
			$("#transactionModal .f_name").text(name);
			$("#transactionModal .address").text(add);
			$('#transactionModal').modal('show');
		});
	});

	$(document).on('click', ".order-button" , function() {
		console.log("yes clickec");
		var t_id = $(this).attr('data-id');
		var new_status = $(this).attr('data-new-status');
		var money = $(this).attr('data-value');
		var wei_money = Number(web3.toWei(money,'ether'));
		console.log("t_id "+t_id+" new status "+new_status);
		console.log("wei_moey "+wei_money);
		//return;
		setTransactionStatus(t_id, new_status, function(res){
			if (new_status==4){
				console.log("total refund");
				refund(t_id,wei_money,function(refund_res){
					console.log("total refund "+refund_res);
					alert("Data Updated Successfully");
				});
			}
			if (new_status!=4){
				alert("Data Updated Successfully");
			}
		});

	});
	
	$(document).on('mouseover', ".thumb-img" , function() {
		console.log("mousehover");
		var s = $(this).attr('data-id');
		$(".default-img").attr('src',"http://res.cloudinary.com/dqum1yaun/image/upload/w_400,h_300,c_fit/"+s);
	});
	
	$(document).on('click', ".p_t_p" , function() {
		$(".p_dsc_div").hide();
		$(".shipping_div").show();
		$(".buy-product").attr('data-qty',$( "#selected_quantity option:selected" ).val());
		
	});
	
	$(document).on('click', ".buy-product" , function() {
		var p_id = Number($(this).attr('data-pid'));
		var qty = Number($(this).attr('data-qty'));
		var price = Number($(this).attr('data-price'));
		var f_name = $("#form_f_name").val();
		if (!f_name){
			alert("Please enter first name");
			return false;
		}
		var l_name = $("#form_l_name").val();
		if (!l_name){
			alert("Please enter last name");
			return false;
		}
		var st_addr = $("#form_street").val();
		if (!st_addr){
			alert("Please enter street address");
			return false;
		}
		var apt = $("#form_apt").val();
		if (!apt){
			alert("Please enter apartment or house no");
			return false;
		}
		var state = $("#form_state").val();
		if (!state){
			alert("Please enter state");
			return false;
		}
		var pin = $("#form_pin").val();
		if (!pin){
			alert("Please enter postal code");
			return false;
		}
		var country = $("#form_country").val();
		if (!country){
			alert("Please enter your country");
			return false;
		}
		
		var customer_addres = st_addr+" "+apt+" "+state+" "+country+" "+pin;



		buyProduct(p_id,qty,price*qty,f_name,l_name,customer_addres,function(res){
			console.log(res);
			$('#buyModal').modal('hide');
			alert("Thanks!Purchase Done");
		});
	});
	
	$(document).on('click', ".back-buy-product" , function() {
		$(".p_dsc_div").show();
		$(".shipping_div").hide();
		
	});
	
	//back-buy-product
	
	$(".view-more").on('click',function(){
		console.log("ya inside view more click");
		if ($(this).attr('data-cat')==""){
		var max = Number($(this).attr('data-max'));
		var offset = Number($(this).attr('data-offset'));
			if (max <= offset){
				alert("No more product");
			}
		getHtmlOfProducts(offset,10,"");
		$(this).attr('data-offset',offset+10);
			if (max <= offset+10){
				$(this).hide();
			}
		}
		else{
			var max = Number($(this).attr('data-max'));
			var offset = Number($(this).attr('data-offset'));
			var cat = $(this).attr('data-cat');
			if (max <= offset){
				alert("No more product");
			}
			getHtmlOfProducts(offset,10,cat);
			$(this).attr('data-offset',offset+10);
			if (max <= offset+10){
				$(this).hide();
			}
		}
	})
	
	$(".cat-nav-click").on('click',function(){
		console.log("ya inside cat-nav click ");
		var cat = $(this).attr('data-cat');
		console.log(cat);
		getTotalProductCountForCategory(cat,function(c){
			  console.log(c.toNumber());
			  $(".view-more").attr('data-max',c.toNumber());
			  $(".view-more").attr('data-cat',cat);
			  $(".view-more").attr('data-offset',"10");
			  getHtmlOfProducts(0,10,cat);	
			  var max = Number($(".view-more").attr('data-max'));
			  var offset = Number($(".view-more").attr('data-offset'));
			  console.log(max);
			  console.log(offset);
			    if (max <= offset){
			    	console.log("yes max lessa than  offset");
				  $(".view-more").hide();
			    }
		  });
	});

	$(".s-tab").on('click',function(){
		$(".b-tab").removeClass("selected-transaction-tab");
		$(this).addClass("selected-transaction-tab");
		$("#bought-transactions").hide();
		$("#sold-transactions").show();
	});

	$(".b-tab").on('click',function(){
		$(".s-tab").removeClass("selected-transaction-tab");
		$(this).addClass("selected-transaction-tab");
		$("#sold-transactions").hide();
		$("#bought-transactions").show();
	});
	
	
});