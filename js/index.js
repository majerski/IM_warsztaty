var app = {
    initialize: function() {
        this.bindEvents();
        this.initFastClick();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("offline", this.onOffline, false);
		document.addEventListener("online", this.onOnline, false);
		document.addEventListener("load", this.onLoad, false);
    },
    initFastClick: function() {
        window.addEventListener('load', function() {
            FastClick.attach(document.body);
        },false);
    },
    onDeviceReady: function() {
		
    },
	onOffline: function() {
		//window.plugins.toast.show('Brak połączenia z internetem.','short','center');
		//toast.show('Brak połączenia z internetem.','short','center');
	},
	onOnline: function() {
		window.plugins.toast.show('Hello there!', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})
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
    },
	onLoad: function() {
        
    }
};