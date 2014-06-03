var warsztaty = [];
var feedFromServer = false;
var feedFromLocal = true;
var warsztaty_loaded = false;
var exitCount = 0;

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
		document.addEventListener("backbutton", this.onBackKeyDown, false);
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
		if(!warsztaty_loaded) {
			feedFromServer = false;
			feedFromLocal = true;
		}
	},
	onOnline: function() {
		window.plugins.toast.showShortBottom('Nawiązano połączenie z internetem.',function(a){},function(b){});
		if(!warsztaty_loaded) {
			feedFromServer = true;
			feedFromLocal = false;
		}
    },
	onBackKeyDown: function() {
		exitCount++;
		if(exitCount > 1){
			if(navigator.app){
				navigator.app.exitApp();
			}else if(navigator.device){
				navigator.device.exitApp();
			}
		}
		return false;
	}
};