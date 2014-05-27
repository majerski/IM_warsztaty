var app = {
    initialize: function() {
        this.bindEvents();
        this.initFastClick();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("load", this.onLoad, false);
    },
    initFastClick: function() {
        window.addEventListener('load', function() {
            FastClick.attach(document.body);
        },false);
    },
    onDeviceReady: function() {
		app.receivedEvent('deviceready');
		document.addEventListener("offline", this.onOffline, false);
		document.addEventListener("online", this.onOnline, false);
		if((navigator.network.connection.type).toUpperCase() != "NONE" && (navigator.network.connection.type).toUpperCase() != "UNKNOWN") {
			this.onOnline();
		}
    },
	onLoad: function() {
        alert("onLoad");
    },
	onOffline: function() {
		alert("onOffline");
		//window.plugins.toast.showShortCenter('Brak połączenia z internetem.',function(a){},function(b){});
	},
	onOnline: function() {
		alert("onOnline");
		/*
		var RSS = $.ajax({
			url: "http://www.q-service.com.pl/rss/",
			type: "GET",
			dataType: "json",
			async: false
		});
		RSS.done(function(response){
			alert(response);
		});
		*/
    }
};