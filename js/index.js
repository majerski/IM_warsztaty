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
		if(typeof window.plugin.email != 'undefined' && typeof window.plugin.email != null){
			//alert('got window.plugin.email');
			window.plugin.email.isServiceAvailable(
				function(isAvailable){
					//alert(isAvailable);
					window.plugin.email.open({
						to:['tomasz@arcontact.pl'],
						subject:'1',
						body:'aa',
						isHtml:true
					});
				}
			);
			
			window.plugin.email.open({
				to:['tomasz@arcontact.pl'],
				subject:'2',
				body:'bb',
				isHtml:true
			});
		}
    },
	onLoad: function() {
		
    },
	onOffline: function() {
		window.plugins.toast.showLongCenter('Brak połączenia z internetem.',function(a){},function(b){});
	},
	onOnline: function() {
		window.plugins.toast.showShortBottom('Nawiązano połączenie z internetem.',function(a){},function(b){});
    }
};