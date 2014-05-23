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
		alert('online');
		var returnSuccess='success';
		var SettingsFileName='camera-2.txt';
		var SettingsDownloadUrl='http://www.tvregionalna24.pl/camera-2.txt';
		var base='http://www.tvregionalna24.pl/';
		var success = function(result) { 
			alert("SUCCESS: \r\n"+result );    
		};
		var error = function(error) { 
			alert("ERROR: \r\n"+error ); 
		};
		FilePlugin.callNativeFunction( success, error,{'result':returnSuccess,'file':SettingsFileName,'downloadurl':SettingsDownloadUrl,'base_path':base} );
		alert('alert after file plugin');
    },
	onLoad: function() {
        
    }
};