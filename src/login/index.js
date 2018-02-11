"use strict";

var url  = "http://localhost:3000/"
var auth = ""

function body_onload() {
	new Vue({
		 el: "#encryptedApp",
		 data: {
		 	 showLogin: 			false,
			 userid:    			"",
			 password:  			"",
			 
			 signUpId:  			"",
			 signUpPassword:        "",
			 signUpConfirmPassword: "",
			 firstName: 			"",
			 lastName:  			"",
			 accessKey:       		"",

			 //nameErr:   		    '',			 
 		 },
/*
 		 computed: {
 		 	displayErrors: function() {
 		 		this.nameErr =  (this.signUpId == "") ? "*Required" : "";
 		 		return this.nameErr;
 		 	}
 		 },

*/		 methods: {
			btnSignIn_click: function () {
				var credentials        = new Object();
    			credentials.email      = this.userid;
    			credentials.password   = this.password;

    			var self = this;
			    fetch(url + "/login", {
			        method: "POST",
			        headers: {
			            'content-type': 'application/json'
			        },
			        body: JSON.stringify(credentials)
			    }).then(function(res) {
			            if (res.ok) {
			                res.json().then(function(data) {
			                	//auth = data.authtoken;
			                	//localStorage.setItem("authToken", data.authtoken);
			                	window.location.href = "../main/main.html"
			                });
			            }
			            else {
			                res.json().then(function(data) {
			                    alert(data.message);
			                });
			            }
			        }).catch(function(err) {
			            alert(err.message);
			    }); 
		 	},

		 	btnSignUp_click: function () {
		 		this.showLogin = true;
				//window.location.href = "../main/main.html" 
		 	},

		 	btnSubmit_click: function () {
		 		this.showLogin  = false;

		 		if (this.firstName == "" || this.lastName == "" || this.signUpId == "" || this.signUpPassword == "" || this.signUpConfirmPassword == "" || this.accessKey.length != 6) return;
		 		if (this.signUpPassword != this.signUpConfirmPassword) return;

		 		var credentials        = new Object();
		 		credentials.firstname  = this.firstName;
		 		credentials.lastName   = this.lastName;
    			credentials.email      = this.signUpId;
    			credentials.password   = this.signUpPassword;
    			credentials.accesskey  = this.accessKey;

    			var self = this;
			    fetch(url + "/createaccount", {
			        method: "POST",
			        headers: {
			            'content-type': 'application/json'
			        },
			        body: JSON.stringify(credentials)
			    }).then(function(res) {
			            if (res.ok) {
			                res.json().then(function(data) {
			                	// auth = data.authtoken;
			                	//localStorage.setItem("authToken", data.authtoken);
			                	self.showLogin = false;
			                });
			            }
			            else {
			                res.json().then(function(data) {
			                    alert(data.message);
			                });
			            }
			        }).catch(function(err) {
			            alert(err.message);
			    }); 
		 	}
		},
	});
}