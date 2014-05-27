var app = {
    initialize: function() {
        this.bindEvents();
        this.initFastClick();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    initFastClick: function() {
        window.addEventListener('load', function() {
            FastClick.attach(document.body);
        },false);
    },
    onDeviceReady: function() {
		document.addEventListener("load", this.onLoad, false);
		//document.addEventListener("offline", this.onOffline, false);
		//document.addEventListener("online", this.onOnline, false);
		this.checkConnection();
    },
	onLoad: function() {
        alert("onLoad");
    },
	checkConnection: function() {
		var networkState = navigator.connection.type;

		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';

		alert('Connection type: ' + states[networkState]);
	}/*,
	onOffline: function() {
		//window.plugins.toast.showShortCenter('Brak połączenia z internetem.',function(a){},function(b){});
	},
	onOnline: function() {
		//var RSS = $.ajax({
		//	url: "http://www.q-service.com.pl/rss/",
		//	type: "GET",
		//	dataType: "json",
		//	async: false
		//});
		//RSS.done(function(response){
		//	alert(response);
		//});
    }*/
};