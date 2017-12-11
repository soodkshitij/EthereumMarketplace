pragma solidity ^0.4.11;

contract MarketPlace{

  struct User{
      uint balance;
      address user_address;
      uint flag;
      string first_name;
      string last_name;
      string email;
      string password;
  }

  struct Product{
    uint id;
    string name;
    string category;
    string description;
    uint unit_price;
    uint quantity;
    address seller;
    string image_ids;
  }

  struct Transaction{
    uint id;
    uint product_id;
    transaction_status status;
    uint unit_price;
    uint quantity;
    address buyer;
    address seller;
    uint ordered_date;
    string first_name;
    string last_name;
    string delivery_address;
  } 

  enum transaction_status { CREATED, SHIPPED, DELIVERED, REFUND_REQUESTED, CANCELLED }
  enum user_type {BUYER,SELLER}

  uint product_id;
  uint user_count;
  uint transaction_id;

  mapping(address => User) public users;
  mapping(uint => Product) public products;
  mapping(address=>uint[]) public buyerTransactions;
  mapping(address=>uint[]) public sellerTransactions;
  mapping(uint => Transaction) public transactions;

  event sellProductEvent(
      uint indexed _product_id,
      address indexed _seller,
      string _name,
      uint _unit_price,
      uint _quantity
  );

  event TransactionEvent(
      uint indexed _transaction_id,
      address indexed _seller,
      address indexed _buyer,
      uint _product_id,
      string _name,
      uint _unit_price,
      uint _quantity
  );

  //register a user
  function register(string first_name, string last_name, string email,string password) public{

      if(users[msg.sender].flag==1){
        return;
      }

      users[msg.sender] = User(msg.sender.balance,msg.sender,1,first_name,last_name,email,password);
      user_count++;

  }

  //get number of users
  function getUserCount() public constant returns (uint) {
      return user_count;
  }

  //get user details
  function getUser() public constant returns(uint, address,string,string,string,string) {
      return (users[msg.sender].balance, users[msg.sender].user_address, users[msg.sender].first_name, users[msg.sender].last_name, users[msg.sender].email, users[msg.sender].password);
  }

  function getUserByAddress(address requestAddress) public constant returns(string,string,string) {
    return (users[requestAddress].first_name, users[requestAddress].last_name, users[requestAddress].email);  
  }

  //Sell a product
  function sellProduct(string name, string category, string description,uint unit_price,uint quantity,string image_ids) public {
    product_id++;

    products[product_id] = Product(product_id,name,category,description,unit_price,quantity,msg.sender,image_ids);

    sellProductEvent(product_id,msg.sender,name,unit_price,quantity);
  }

  function buyProduct(uint id,uint demanded_quantity,string first_name, string last_name,string delivery_address) payable public{

    require(products[id].quantity >= demanded_quantity);

    require(msg.sender != products[id].seller);

    require(products[id].unit_price * demanded_quantity == msg.value);

    products[id].seller.transfer(msg.value);

    products[id].quantity -= demanded_quantity;

    transaction_id++;

    transactions[transaction_id] = Transaction(transaction_id,id,transaction_status.CREATED,products[id].unit_price,demanded_quantity,msg.sender,products[id].seller,block.timestamp,first_name,last_name,delivery_address);

    buyerTransactions[msg.sender].push(transaction_id);

    sellerTransactions[products[id].seller].push(transaction_id);

    TransactionEvent(transaction_id,products[id].seller,msg.sender,products[id].id,products[id].name,products[id].unit_price,demanded_quantity);

  }


  //get all transaction fields
  function getTransaction(uint id) public constant returns (uint,uint,transaction_status,uint,uint,address,address,uint,string,string,string){

    var t = transactions[id];

    return (t.id,t.product_id,t.status,t.unit_price,t.quantity,t.buyer,t.seller,t.ordered_date,t.first_name,t.last_name,t.delivery_address);

  }

  //get all ids of transactions by user address and type of user
  function getTransactionIds(address addr, user_type which) public constant returns(uint[]){

    var p = buyerTransactions[addr];

    if (which == user_type.SELLER){
      p = sellerTransactions[addr];
    }

    uint[] memory ids = new uint[](p.length);

    for(uint i=0;i<p.length;i++){
        ids[i]=p[i];
    }

    return (ids);

  }

  function getAllProductIds() public constant returns (uint[]){

    // we check whether there is at least one article
    if(product_id == 0) {
      return new uint[](0);
    }

    // prepare intermediary array
    uint[] memory productIds = new uint[](product_id);

    uint numberOfProductsForSale = 0;
    // iterate over products
    for (uint i = 0; i <= product_id; i++) {
      // keep only the ID of products not sold yet
      if (products[i].quantity != 0) {
        productIds[numberOfProductsForSale] = products[i].id;
        numberOfProductsForSale++;
      }
    }

    return productIds;
  }

  function getProductIds(uint offset,uint limit) public constant returns (uint[]){

    // we check whether there is at least one article
    if(product_id == 0) {
      return new uint[](0);
    }

    // prepare intermediary array
    uint[] memory productIds = new uint[](limit);

    uint numberOfProductsForSale = 0;

    // iterate over products
    for (uint i = offset; numberOfProductsForSale < limit; i++) {
      if(i > product_id)
        break;
      // keep only the ID of products not sold yet
      if (products[i].quantity != 0) {
        productIds[numberOfProductsForSale] = products[i].id;
        numberOfProductsForSale++;
      }
    }
    return productIds;
  }

  function getTotalProductCount() public constant returns (uint){
    	return product_id;
  }

  function getProduct(uint p_id) public constant returns (uint, string, string, uint, uint, string, string, address){
       var p = products[p_id];
       return (p.id, p.name, p.category, p.unit_price, p.quantity, p.description, p.image_ids, p.seller);
  }

  function getProductIdsForCategory(uint offset,uint limit,string category) public constant returns (uint[]){

    if(product_id == 0)
      return new uint[](0);

    uint numberOfProductsForSale = 0;
    uint[] memory productIds = new uint[](limit);

    // iterate over products
    for (uint i = offset; i <= product_id; i++) {

      // keep only the ID of products not sold yet
      if (products[i].quantity == 0) {
        continue;
      }

      bool eq = true;

      if(keccak256(products[i].category) != keccak256(category))
        eq=false;

      // keep only the ID of products not sold yet
      if (products[i].quantity != 0 && eq) {
        productIds[numberOfProductsForSale] = products[i].id;
        numberOfProductsForSale++;
      }
    }

    return productIds;
  }

  function getTotalProductCountForCategory(string category) public constant returns (uint){

      if(product_id == 0)
        return 0;

      uint numberOfProductsForSale = 0;

      // iterate over products
      for (uint i = 1; i <= product_id; i++) {
      // keep only the ID of products not sold yet
        if (products[i].quantity == 0) {
          continue;
        }
        bytes storage a = bytes(products[i].category);
        bytes memory b = bytes(category);
		    if (a.length != b.length)
          continue;
		      // @todo unroll this loop
        bool eq = true;

    		/*for (uint z = 0; z < a.length; z++){
          if (a[z] != b[z]){
            eq=false;
    				break;
          }
        }*/

        if(keccak256(products[i].category) != keccak256(category))
          eq=false;

        if (products[i].quantity != 0 && eq)
          numberOfProductsForSale++;

      }

      return numberOfProductsForSale;
    }

    function refund(uint id) payable public{

      transactions[id].status = transaction_status.CANCELLED;
      transactions[id].buyer.transfer(msg.value);
      products[transactions[id].product_id].quantity += transactions[id].quantity;
    }

    function setTransactionStatus(uint id, transaction_status status) public returns (bool){
      if(transactions[id].id == 0)
        return false;
      if(transactions[id].status == transaction_status.CREATED && status == transaction_status.CANCELLED){
        transactions[id].status = status;
        return true;
      }
      else if(transactions[id].status == transaction_status.DELIVERED && msg.sender == transactions[id].buyer && status == transaction_status.REFUND_REQUESTED)
      {
        transactions[id].status = status;
        return true;
      }
      else if(transactions[id].status == transaction_status.REFUND_REQUESTED && msg.sender == transactions[id].seller && status == transaction_status.CANCELLED ){
        transactions[id].status = status;
        return true;
      }
      else if(transactions[id].status == transaction_status.CREATED && msg.sender == transactions[id].seller && status == transaction_status.SHIPPED ){
        transactions[id].status = status;
        return true;
      }
      else if(transactions[id].status == transaction_status.SHIPPED && msg.sender == transactions[id].seller && status == transaction_status.DELIVERED ){
        transactions[id].status = status;
        return true;
      }
      else
        return false;
    }


}
