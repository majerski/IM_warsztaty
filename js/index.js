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
		window.plugins.toast.showLongBottom('Brak połączenia z internetem.');
	},
	onOnline: function() {
        // google map
    },
	onLoad: function() {
        
    }
};