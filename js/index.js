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
		window.plugins.toast.showShortCenter('Brak połączenia z internetem.',function(a){},function(b){});
		var warsztaty = [
			{"nazwa":"nazwa1","adres":"adres1","tel":"tel1","lat":54.156524,"lng":19.410400},
			{"nazwa":"nazwa2","adres":"adres2","tel":"tel2","lat":54.153710,"lng":19.389114},
			{"nazwa":"nazwa3","adres":"adres3","tel":"tel3","lat":54.139231,"lng":19.441986},
		];
	},
	onOnline: function() {
		var request = $.ajax({
			url: "http://www.tvregionalna24.pl/warsztaty.php",
			type: "GET",
			dataType: "json"
		});
		request.done(function(response){
			alert(response);
		});
    },
	onLoad: function() {
        
    }
};