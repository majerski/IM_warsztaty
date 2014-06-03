var warsztaty = [];
var feedFromServer = false;
var feedFromLocal = true;
var warsztaty_loaded = false;
var fi_path = 'installed.dat';

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
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
			fs.root.getFile(fi_path, {create: false}, function(fe){}, function(ee){
				//wstaw ikone
				if(typeof window.plugins != 'undefined' && typeof window.plugins.Shortcut != 'undefined'){
					window.plugins.Shortcut.CreateShortcut("Inter Cars", function(a){
						window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
							fs.root.getFile(fi_path, {create: true, exclusive: false}, function(fe){
								fe.createWriter(function(fw){
									fw.write(new Date().getTime());
								}, failFS);
							}, failFS);
						}, failFS);
					}, function(b){
					});
				}
			});
		}, failFS); 
		function failFS(){
			// fail FS
		}
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
    }
};