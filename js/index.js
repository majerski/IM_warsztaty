var app = {
    initialize: function() {
        this.bindEvents();
        this.initFastClick();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("offline", this.onOffline, false);
		document.addEventListener("online", this.onOnline, false);
		//document.addEventListener("load", this.onLoad, false);
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
	},
	onOnline: function() {
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
		var checkVersion2 = $.ajax({
			url: "http://arcontact.pl/warsztaty_inter_cars/feed.php",
			type: "GET",
			data: {type:"version"},
			dataType: "json",
			async: false
		});
		checkVersion2.done(function(resp){
			alert(resp);
		});
		
    },
	//onLoad: function() {
    //    
    //}
};