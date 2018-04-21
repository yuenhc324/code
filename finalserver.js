var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/";


(function() {
  var fs, http, qs, server, url, idnum;

  http = require('http');

  url = require('url');

  qs = require('querystring');

  fs = require('fs');
	
	finalcount = 0;
	
	idnum = 0;
	
	var userStatus, userLoginName;

  server = http.createServer(function(req, res) {
    var action, form, formData, msg, publicPath, urlData, stringMsg, psw;
    urlData = url.parse(req.url, true);
    action = urlData.pathname;
    publicPath = __dirname + "\\public\\";
   console.log(req.url);
    if (action === "/Signup") {
       console.log("signup");
			console.log(req.method);
      if (req.method === "POST") {
        console.log("action = post");
        formData = '';
        msg = '';
				psw = '';
        return req.on('data', function(data) {
          formData += data;
          
          console.log("form data=  " + formData);
          return req.on('end', function() {
            var user;
						idnum = idnum+1;
            user = qs.parse(formData);
            user.id = idnum;
            msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						console.log("mess="+msg);
            console.log("mess="+formData);

						/*res.writeHead(200, {
              "Content-Type": "application/json",
              "Content-Length": msg.length
            });*/
            
					MongoClient.connect(dbUrl, function(err, db) {
  					if (err) throw err;
  					var dbo = db.db("mydb");
  					var myobj = stringMsg;
	          var vailableSignUp = 0;
						
							console.log("1vail num : " + vailableSignUp);
						dbo.collection("customers").find({"Username" : myobj.Username}).count(function (error, count){
							if(err)throw err;		
							console.log("username : " + count);
							if (count >= 1){
							  console.log("Existed username : " + myobj.Username);
								db.close();
								return res.end("Existed username!");
							}else{vailableSignUp++;
									 console.log("1va : " + vailableSignUp);
									 }
						});
						
							//console.log("2vail num : " + vailableSignUp);
						dbo.collection("customers").find({"EmailorPhone" :myobj.EmailorPhone}).count(function (error, count){
							if(err)throw err;
							console.log("From user : " + myobj.EmailorPhone);
							console.log("email or phone : " + count);
							if (count >= 1){
							  console.log("Existed Email or Phone : " + myobj.EmailorPhone);
								db.close();
								return res.end("Existed Email OR Phone number!");
							}else{
								vailableSignUp++;
								//console.log("2va : " + vailableSignUp);
								/******/
								dbo.collection("customers").insertOne(myobj, function(err, res) {
    				     if (err) throw err;
    			       	console.log("1 document inserted to customers");
					      	vailableSignUp = 0;
    				      db.close();
  				      	});
								  return res.end("Sign up successfully!");
								/******/
							  }
							db.close();
						});
					
					});
						return res.end;
          });
        });
      } else {
        
				sendFileContent(res, "calldatabase.html", "text/html");
      }
    }else if (action === "/Search") {
       console.log("search");
      if (req.method === "POST") {
        console.log("action = post");
        formData = '';
        msg = '';
        return req.on('data', function(data) {
          formData += data;
          
          console.log("form data="+ formData);
          return req.on('end', function() {
            var user;
            user = qs.parse(formData);
            //user.id = "123456";
            msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						console.log("mess="+msg);
            console.log("mess="+formData);
            res.writeHead(200, {
              "Content-Type": "application/json",
              "Content-Length": msg.length
            });
						MongoClient.connect(dbUrl, function(err, db) {
  					if (err) throw err;
  					var dbo = db.db("mydb");
  					var myobj = stringMsg;
  					

							dbo.collection("customers").find({"Username" : ""}).count(function (error, count) {
  						console.log(error, count);
								db.close();
							});
							
								console.log(count);
						
					});
						
            return res.end("1");
          });
        });
				
      } else {
        //form = publicPath + "ajaxSignupForm.html";
        form = "searchdb.html";
        return fs.readFile(form, function(err, contents) {
          if (err !== true) {
            res.writeHead(200, {
              "Content-Type": "text/html"
            });
            return res.end(contents);
          } else {
            res.writeHead(500);
            return res.end;
          }
        });
      }
    } else if( action=="/newpage"){
       res.writeHead(200, {
        "Content-Type": "text/html"
      });
      return res.end("<h1>歡迎光臨Node.js菜鳥筆記2</h1><p><a href=\"/Signup\">註冊</a></p>");
    } else if (action == "/Clear"){
			console.log("[Customers] Clear all data");
			
			MongoClient.connect(dbUrl, function(err,db){
				if (err) throw err;
				var dbo = db.db("mydb");
				dbo.collection("customers").drop(function(err, delOk){
					if (delOk) console.log("Collection deleted");
					db.close();
				});
				return res.end;
			});
			
		} else if( action =="/SearchAll"){
			console.log("Search all");
			
			MongoClient.connect(dbUrl, function(err,db){
				if (err) throw err;
				var dbo = db.db("mydb");
				 dbo.collection("customers").find().toArray(function(err, result) {
								if (err) throw err;
             console.log(result);
				  db.close();	 
		    });
				db.close();
				return res.end;
			});
		} else if( action == "/Login"){
			console.log("Login");
			if (req.method == "POST"){
			console.log("POST");
				formData = '';
        msg = '';
				psw = '';
				
				return req.on('data', function(data){
					formData += data;
				  console.log("form data=  " + formData);
					console.log(req.url);
					return req.on('end', function(){
						var user;
						user = qs.parse(formData);
            msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						console.log("Login msg = " + msg);
						console.log("Login username = " + stringMsg.Username);
						console.log("Login password = " + stringMsg.Password);
						
						
						
						MongoClient.connect(dbUrl, function(err,db){
							if (err) throw err;
				      var dbo = db.db("mydb");
							var countUser;
							var resMsg, _stringObj, res_msg;
							
							dbo.collection("customers").find({"Username" :stringMsg.Username }).count (function (error, count) {
  						if (err) throw err;
							//console.log(count);
								
							if (count === 0){
								//username is not exist	
								 resMsg = { "Msg": "Username is not exist!"};
								 _stringObj = JSON.stringify(resMsg);		
									db.close();
								return res.end(_stringObj);		
							}else{
								dbo.collection("customers").findOne({"Username" :stringMsg.Username },function (error, result){
								if (err) throw err;
							  console.log("[Login]  User password : " + result.Password);
							  if(stringMsg.Password != result.Password){
									resMsg = { "Msg": "Incorrect password!"};
								 _stringObj = JSON.stringify(resMsg);
								db.close();
								return res.end(_stringObj);
								}else{
									resMsg = { "Msg": "Success Login!", "LoginName": result.Username};
								  _stringObj = JSON.stringify(resMsg);
									userLoginName = result.Username;
									userStatus = "logined";
									console.log("[Login]  User: " + result.Username + " Login!");
									console.log("[Login]  Loginstatus: " + userStatus);
									console.log("[Login]  UserLoginNamw: " + userLoginName);
									db.close();
									return res.end(_stringObj);
								}
							  });

							}
							});	
							return res.end;
						});
						
					});
				});
			}else{
          sendFileContent(res, "login.html", "text/html");
			}	
			console.log("Not POST");
		}else if(action =="/checkLoginStatus"){
			         console.log("From checkLoginStatus : " + userStatus);
			         if(userStatus ==="logined"){
								 
								 console.log("User has been logined : " + userLoginName);
								 return res.end(userLoginName);
							 }
							 return res.end();
					 }
			      else if( action == "/Logout"){
				       userLoginName = "";
				       userStatus = "";
							 console.log("Logout successfully!");
				       console.log("Loginstatus: " + userStatus + " UserLoginNamw: " + userLoginName);
				       return res.end("Logout successfully!")
							
		       	}else if(action == "/FavourList"){
							console.log("[FavourList] " + userStatus + " " + userLoginName);
							if (userStatus === undefined){
								console.log("[FavourList] Logouting!");
							 	var resMsg, _stringObj;
								resMsg = { "Msg": "Please login!"};
								_stringObj = JSON.stringify(resMsg);
								return res.end( "Please login!");
							}else{
								console.log("----This is favour list method----");
								
								if (req.method === "POST") {
              		 	console.log("[FavourList] action = post");
       						 	formData = '';
       						 	msg = '';
										psw = '';
									 
        						return req.on('data', function(data) {
          					formData += data;
          					console.log("[FavourList] form data =  " + formData);
											
          			    return req.on('end', function() {
											console.log("[FavourList] Logined username : " + userLoginName);
											var favourlist = "";
											favourlist = qs.parse(formData);
											favourlist.Username = userLoginName;
											
            					msg = JSON.stringify(favourlist);
											stringMsg = JSON.parse(msg);
											console.log("[FavourList] mess="+msg);
           	 					console.log("[FavourList] mess="+formData);
								/****/
								
								MongoClient.connect(dbUrl, function(err, db) {
  				     	if (err) throw err;

  					    var dbo = db.db("mydb");	
  					    var myobj = stringMsg;
									
								 dbo.collection("favourlist").insertOne(myobj, function(err, res) {
    				     if (err) throw err;
    			       	console.log("[FavourList] 1 document inserted to favourlist");
									console.log("----End of the favour list method----");
    				      db.close();
  				      	});
									return res.end("This article is added!");
								 });	 	
								});
							});
						 }
					  }
	   
	}else if( action == "/ClearFavour"){
					console.log("----This is favour list method----");			
			    MongoClient.connect(dbUrl, function(err,db){
				  if (err) throw err;
				  var dbo = db.db("mydb");
				  dbo.collection("favourlist").drop(function(err, delOk){
					if (delOk) console.log("[FavourList] Collection deleted");
					console.log("----End of the favour list method----");
					 db.close();
				});
				return res.end;
			});					 
  }else if( action == "/SearchFavour"){
		    console.log("----This is favour list method----");
				console.log("[FavourList] Search all data");
		    MongoClient.connect(dbUrl, function(err,db){
				if (err) throw err;
				var dbo = db.db("mydb");
				 dbo.collection("favourlist").find().toArray(function(err, result) {
								if (err) throw err;
             console.log(result);
				  db.close();	 
		    });
					console.log("----End of the favour list method----");
				db.close();
				return res.end;
			});
	}else if( action == "/checkFavourList"){
		console.log("----This is favour list method----");
		console.log("[FavourList] Resfresh the list");
     MongoClient.connect(dbUrl, function(err,db){
							if (err) throw err;
				      var dbo = db.db("mydb");
							var countUser;
							var resMsg, _stringObj, res_msg;
							
							dbo.collection("favourlist").find({"Username" :userLoginName }).count (function (error, count) {
  						if (err) throw err;		
							if (count === 0){
								//username is not exist	
								 resMsg = {"Msg": "Favour List is empty!"};
								 _stringObj = JSON.stringify(resMsg);		
								console.log("[FavourList] List is empty!");
									db.close();
								return res.end(_stringObj);		
							}else{
								dbo.collection("favourlist").findOne({"Username" :userLoginName },function (error, result){
								if (err) throw err;
								console.log("[FavourList] Result : " + result);
							  resMsg = result;
								_stringObj = JSON.stringify(resMsg);		
								db.close();
								return res.end(_stringObj);
								});
								}
							});
			    return res.end;
							});	
							

	}else{
      
	//http.createServer(function(req, res) {
    //console.log("callhtml");
		//sendFileContent(res, "calldatabase.html", "text/html"); 
	if(req.url === "/index"){
		//sendFileContent(response, "callajax.html", "text/html");
		//alert("index");
		sendFileContent(res, "index.html", "text/html");
	}
	else if(req.url === "/"){
		console.log("Requested URL is url" +req.url);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + req.url);
	}
	else if(/^\/[a-zA-Z0-9\/]*.html$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "text/html");
	}
	else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9\/]*.css$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "text/css");
	}
	else if(/^\/[a-zA-Z0-9\/]*.jpg$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "image/jpg");
	}
	else if(/^\/[a-zA-Z0-9\/]*.txt$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "text/txt");
	}
	else if(/^\/[a-zA-Z0-9\/]*.png$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "image/png");	
	}
	else if(/^\/[a-zA-Z0-9\/]*.png$/.test(req.url.toString())){
	  sendFileContent(res, req.url.toString().substring(1), "image/svg");
  }
	else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "text/js");
	}
	else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "text/svg");
	}else{
		console.log("Requested URL is: " + req.url);
		res.end();
	}
//		});
		}
		
  });

  server.listen(9001);

  console.log("Server is running，time is" + new Date());


  
  
function sendFileContent(response, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}
}).call(this);





