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
		window.plugins.toast.showLongBottom('Brak połączenia z internetem.',function(a){},function(b){});
		// dodać ikonę o braku internetu + odśwież
	},
	onOnline: function() {
        // google map + RSS
		var FPreturnSuccess='FPsuccess';
		var FPSettingsFileName='camera-2.txt';
		var FPSettingsDownloadUrl='http://www.tvregionalna24.pl/camera-2.txt';
		var FPbase='http://www.tvregionalna24.pl/';
		var FPsuccess = function(result) { 
			alert("SUCCESS: \r\n"+result );    
		};
		var FPerror = function(error) { 
			alert("ERROR: \r\n"+error ); 
		};
		FilePlugin.callNativeFunction(FPsuccess,FPerror,{'result':FPreturnSuccess,'file':FPSettingsFileName,'downloadurl':FPSettingsDownloadUrl,'base_path':FPbase}); 
    },
	onLoad: function() {
        
    }
};