/**
 * 
 */

function login(){
		//$.ajax({url:"http://kannann1-edge-server.mybluemix.net/authenticate/"+$("#username").val()+"/"+$("#password").val(), 
	$.ajax({url:"http://bankauthenticationservice.mybluemix.net/authenticate/"+$("#username").val()+"/"+$("#password").val(),
				headers:{"X-IBM-Client-ID": "4b67589f-047d-4b56-84ac-d0d27fa66b52", "x-ibm-client-secret": "a59g2f9m--7ef8"}, 		
				type: "GET",
				success: function(data){
			if(data){
					alert("Welcome" + data.username);					
				//window.location.href = "http://eportal-service.mybluemix.net/home.html";
					window.location.href = "https://bankfrontendservice.mybluemix.net/details.html";
				}				
		}		
	});
}

function subscribe(){
	
	console.log("subscribe");//http://kannann1-edge-server.mybluemix.net/info
	
	$.ajax(
			{url:"http://kannann1-edge-server.mybluemix.net/subscribe",
		        type: "POST",
		        data: JSON.stringify({
		        	"product": $('#id4 :selected').text(),
		        	"msisdn":"96656789321",
		        	"price":$("#fee").val()
		        }),
		        headers : {
		        	'Content-Type': 'application/json; charset=utf-8',
		        	"X-IBM-Client-ID": "4b67589f-047d-4b56-84ac-d0d27fa66b52",
		        	"x-ibm-client-secret": "a59g2f9m--7ef8"
		        },
				//headers:{"X-IBM-Client-ID": "4b67589f-047d-4b56-84ac-d0d27fa66b52", "x-ibm-client-secret": "a59g2f9m--7ef8"}, 		
		
		success: function(data){
		alert("Subscribed");
		window.location.href = "http://eportal-service.mybluemix.net/home.html";
	}
	
});

}