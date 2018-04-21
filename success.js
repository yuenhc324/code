var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/";


(function() {
  var fs, http, qs, server, url;

  http = require('http');

  url = require('url');

  qs = require('querystring');

  fs = require('fs');

  server = http.createServer(function(req, res) {
    var action, form, formData, msg, publicPath, urlData, stringMsg;
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
        return req.on('data', function(data) {
          formData += data;
          
          console.log("form data="+ formData);
          return req.on('end', function() {
            var user;
            user = qs.parse(formData);
            user.id = "123456";
            msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						console.log("mess="+msg);
            console.log("mess="+formData);
           // res.writeHead(200, {
            //  "Content-Type": "application/json",
             // "Content-Length": msg.length
            //});
						MongoClient.connect(dbUrl, function(err, db) {
  					if (err) throw err;
  					var dbo = db.db("mydb");
  					var myobj = stringMsg;
  					dbo.collection("customers").insertOne(myobj, function(err, res) {
    				if (err) throw err;
    				console.log("1 document inserted");
    				db.close();
  					});
					});
						
            return res.end("good");
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
            user.id = "123456";
            msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						console.log("mess="+msg);
            console.log("mess="+formData);
           // res.writeHead(200, {
            //  "Content-Type": "application/json",
             // "Content-Length": msg.length
            //});
						MongoClient.connect(dbUrl, function(err, db) {
  					if (err) throw err;
  					var dbo = db.db("mydb");
  					var myobj = stringMsg;
  					
						//dbo.collection("customers").insertOne(myobj, function(err, res) {
    				//if (err) throw err;
    				//console.log("1 document inserted");
    				//db.close();
  					//});
						
							
							//dbo.collection("customers").find({}).toArray(function(err, result) {
   // if (err) throw err;
    //console.log(result);
    //db.close();
  //});
							
							
			//				var myquery = { Name: 'apple' };
		//					dbo.collection("customers").deleteOne(myquery, function(err, obj) {
    //if (err) throw err;
    //console.log("1 document deleted");
    //db.close();
  //});
							
							
							// count=dbo.collection("customers").find({"Name" : "ALEX"}).count();
							//console.log("total count="+dbo.collection("customers").find({"Name" : "ALEX"}).count());
							
							dbo.collection("customers").count({"Name" : "ALEX"}, function (error, count) {
  						console.log(error, count);
							
								finalcount=count;
							});
							
							
							
							dbo.collection("customers").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
	});
							
			//				dbo.collection("customers").find({"Name": "ALEX"}).toArray(function(err, result) {
    //if (err) throw err;
    //console.log(result);
    //db.close();
	//}); 
							
								console.log("final count="+finalcount);
						
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
    } else if( action==="/newpage"){
       res.writeHead(200, {
        "Content-Type": "text/html"
      });
      return res.end("<h1>�w����{Node.js�泾���O2</h1><p><a href=\"/Signup\">���U</a></p>");
    }
    
    else {
      
      console.log("callhtml");
		sendFileContent(res, "calldatabase.html", "text/html");

     
      //res.writeHead(200, {
      //  "Content-Type": "text/html"
     // });
      //return res.end("<h1>�w����{Node.js�泾���O</h1><p><a href=\"/Signup\">���U</a></p>");
    }
  });

  server.listen(8080);

  console.log("Server is running�Atime is" + new Date());

  
  
  
  
  
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


