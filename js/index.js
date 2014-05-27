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
		document.addEventListener("offline", this.onOffline, false);
		document.addEventListener("online", this.onOnline, false);
    },
	onLoad: function() {
        
    },
	onOffline: function() {
		window.plugins.toast.showShortCenter('Brak połączenia z internetem.',function(a){},function(b){});
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
    }
};