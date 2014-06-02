var warsztaty = [];
var app = {
    initialize: function() {
        this.bindEvents();
        this.initFastClick();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("load", this.onLoad, false);
		document.addEventListener("offline", this.onOffline, false);
		document.addEventListener("online", this.onOnline, false);
    },
    initFastClick: function() {
        window.addEventListener('load', function() {
            FastClick.attach(document.body);
        },false);
    },
    onDeviceReady: function() {
		
    },
	onLoad: function() {
		
    },
	onOffline: function() {
		window.plugins.toast.showLongCenter('Brak połączenia z internetem.',function(a){},function(b){});
		$.getScript("js/warsztaty_var.js", function(){
			if(supports_html5_storage()) {
				localStorage["warsztaty"] = JSON.stringify(warsztaty);
			}
		});
	},
	onOnline: function() {
		window.plugins.toast.showShortBottom('Nawiązano połączenie z internetem.',function(a){},function(b){});
    }
};