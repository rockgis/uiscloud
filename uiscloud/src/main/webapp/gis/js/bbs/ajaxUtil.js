function AjaxManager(){};
AjaxManager.prototype.className = "$AM";
AjaxManager.prototype.setClassName = function(name){this.className = name;};
AjaxManager.prototype.ax = new Array();
AjaxManager.prototype.status = new Array();
AjaxManager.prototype.loaded = new Array();
AjaxManager.prototype.isIE = true;
AjaxManager.prototype.func = new Array();
AjaxManager.prototype.getXmlHttpRequest = function() {
	var xmlhttp = null;
	// IE
	if (window.ActiveXObject) {
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		// code for IE6, IE5
		} catch(e) {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	// Mozilla/Safari
	else if (XMLHttpRequest) {
		//xmlhttp = new xmlhttprequest();
		xmlhttp = new XMLHttpRequest();
		this.isIE = false;
	}
	return xmlhttp;
};
AjaxManager.prototype.setAX = function() {
	//this.ax[this.ax.length] = this.getXmlHttpRequest();
	this.ax[0] = this.getXmlHttpRequest();
};
AjaxManager.prototype.getAX = function() {
	try {
		/*
		for(var i =0; i < this.loaded.length; i++ ){
			if(loaded[i] == true ){
				return i; 
			}
		}
		if(this.ax.length == 0) {
			this.setAX();
		}
		*/
		this.setAX();
		return 0;
	} catch (e) {return null;}
};

AjaxManager.prototype.getText = function(index) {
	try {
		if( this.ax[index] == undefined || this.ax[index] == null) {
			return null;
		}
		this.loaded[index] = true;
		return this.ax[index].responseText;
	} catch (e) {
		return null;
	}
};
AjaxManager.prototype.getXml = function(index) {
	try {
		index = parseInt(index);
		if( this.ax[index] == undefined || this.ax[index] == null) {
			return null;
		}
		this.loaded[index] = true;
		return this.ax[index].responseXML;
	} catch (e) {
		return null;
	}
};
AjaxManager.prototype.loadFunction = function(index, type) {
	try {
		if(!this.axChecker(index)) {
			
			setTimeout(this.className + ".loadFunction("+index+",'"+type+"')", 100);

		} else {
			if( type == "TEXT") {
				setTimeout(this.func[index] + "(\"" + encodeURI( this.getText(index) ) + "\")" , 1);
			} else {
				setTimeout(this.func[index] + "(\"" +index +"\")" , 1);
			}
		}
	} catch(e) {
		alert('error in [loadFunction]\n' + e.message);
	}
};
/**
 * It works to get text from the server using AJAX
 * 
 * @param url
 * @param param
 * @param func
 * @param type
 * @return
 */
AjaxManager.prototype.fireText = function(url, param, func, type) {
	var index = this.sendAX(url, param, type);
	//alert(index);
	if( func != null && func != undefined ) {
		this.func[index] = func;
		this.loadFunction(index, "TEXT");
		//this.setFunction();
	}
	return index;
};

/**
 * It works to get XML from the server using AJAX
 */
AjaxManager.prototype.fireXml = function(url, param, func, type) {
	var index = this.sendAX(url, param, type);
	if(index == -1) {
		return -1;
	}
	if( func != null && func != undefined ) {
		this.func[index] = func;
		this.loadFunction(index, "XML");
		//this.setFunction();
	}
	return index;
};

AjaxManager.prototype.sendAX = function(url, param, type){
	var index = this.getAX();
	this.status[index] = false;
	this.loaded[index] = false;
	try	{
		if(type == null || type == undefined) {
			this.ax[index].open("GET", url+"?"+param, true);
			this.ax[index].setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
			if(this.isIE) {
				this.ax[index].send();
			} else {
				this.ax[index].send(null);
			}
			
		} else if (type == "GET") {
			this.ax[index].open("GET", url+"?"+param, true);
			this.ax[index].setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
			if(this.isIE) {
				this.ax[index].send();
			} else {
				this.ax[index].send(null);
			}
		} else if (type == "POST") {
			// open method = (method, url, async)
			this.ax[index].open("POST", url, true);
			this.ax[index].setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
			this.ax[index].send(param);
		}
		
		return index;
	}catch (e){
		alert("error in [sendax"+index+"]\n" + e.message);
		
		return -1;
	}
};

AjaxManager.prototype.axChecker = function(index){
	// object.readyState (0=uninitializaed, 1= connection established, 2= request received,
	// 					  3= processing, 5= finished and response is ready)
	// object.state (200= OK, 404: Page not found)
	// Referred - http://code.google.com/edu/ajax/tutorials/ajax-tutorial.html
	if (this.ax[index].readyState == 4 && this.ax[index].status == 200 && this.status[index] == false) {
		this.status[index] = true;
		return true;
	} else {
		return false;
	}
};

// Build Params by ID
AjaxManager.prototype.buildParams = function(id) {
	var parent = document.getElementById(id);
	return this.buildParamNodes(parent);
};

//Build Params by NodeName
AjaxManager.prototype.buildParamNodes = function(parent) {
	var length = parent.children.length;
	var child = null;
	var params = "";
	for( var i =0; i < length; i++) {
		child = parent.children[i];
		if( child != undefined) {
			if( child.tagName == "INPUT" || child.tagName == "TEXTAREA" || child.tagName == "SELECT") {
				if( child.value != "") {
					params = params + "&" + child.name + "=" + encodeURI(child.value);
				}
				
			} else {
				params += this.buildParamNodes(child); 
			}
		}
	}
	return params;
};

var $AM = new AjaxManager();