$.mobile.defaultPageTransition = 'none';

$(window).load(function(){
	$(".main-loader").hide();
	$("#app").show();
});

var warsztaty = [];
var _warsztaty = []; // po szukaniu
var use_warsztaty = [];
var feedFromServer = false;

function openDeviceBrowser(url){
	window.open(encodeURI(url),'_system','location=no');
}
function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
function pageInit(){
    var new_content = $('#warsztaty_lista_hidden div.warsztat:eq(0)').clone();
    $('#warsztaty_lista').empty();
	$('#warsztaty_lista').append(new_content);
	$('#page2').page();
	$('#warsztaty_lista ul').listview();
    return false;
}
function pageClick(page_index, jq){
    var new_content = $('#warsztaty_lista_hidden div.warsztat:eq('+(page_index-1)+')').clone();
    $('#warsztaty_lista').empty().append(new_content);
	$('#warsztaty_lista ul').listview();
    return false;
}
function warsztaty_filter(value){
	_warsztaty = filterValuePart(warsztaty,value);
	warsztatyLista(true);
}
function filterValuePart(arr,part) {
	var emptyArr = new Array();
	$.each(arr,function(i,item){
		if( (String(item.konto).toLowerCase().indexOf(part) > -1) || (String(item.miasto).toLowerCase().indexOf(part) > -1) || (String(item.ulica).toLowerCase().indexOf(part) > -1) ) {
			emptyArr.push(item);
		}
	});
	return emptyArr;
};
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
};
function renderWarsztat(id){
	var len = Object.keys(use_warsztaty).length;
	$.each(use_warsztaty,function(i,item){
		if(i==id){
			$("#warsztaty_content").empty();
			$("#warsztaty_content").append('<h2>'+item.konto+'</h2>');
			$("#warsztaty_content").append('<p>'+item.ulica+'<br />'+item.kod.substr(0,2)+'-'+item.kod.substr(2)+' '+item.miasto+'</p>');
			$("#warsztaty_content").append('<p>otwarte '+item.open+'<br />w soboty '+item.opensob+'</p>');
			if(item.mechanika==1 || item.przeglad==1 || item.wulkanizacja==1 || item.klimatyzacja==1 || item.geometria==1 || item.diagnostyka==1 || item.elektryka==1 || item.spaliny==1 || item.blacharstwo==1 || item.lakiernictwo==1 || item.szyby==1) {
				var list = document.createElement('ul');
				list.style.marginTop = "0px";
				$("#warsztaty_content").append('<p style="margin-bottom:0px">Specjalizacje:</p>');
				if(item.mechanika==1){
					var li=document.createElement('li');li.innerHTML='mechanika';list.appendChild(li);
				}
				if(item.blacharstwo==1){
					var li=document.createElement('li');li.innerHTML='blacharstwo';list.appendChild(li);
				}
				if(item.lakiernictwo==1){
					var li=document.createElement('li');li.innerHTML='lakiernictwo';list.appendChild(li);
				}
				
				if(item.przeglad==1){
					var li=document.createElement('li');li.innerHTML='przeglądy';list.appendChild(li);
				}
				if(item.diagnostyka==1){
					var li=document.createElement('li');li.innerHTML='diagnostyka';list.appendChild(li);
				}
				if(item.wulkanizacja==1){
					var li=document.createElement('li');li.innerHTML='wulkanizacja';list.appendChild(li);
				}
				if(item.geometria==1){
					var li=document.createElement('li');li.innerHTML='geometria kół';list.appendChild(li);
				}
				if(item.spaliny==1){
					var li=document.createElement('li');li.innerHTML='układy wydechowe';list.appendChild(li);
				}
				if(item.elektryka==1){
					var li=document.createElement('li');li.innerHTML='elektryka';list.appendChild(li);
				}
				if(item.klimatyzacja==1){
					var li=document.createElement('li');li.innerHTML='klimatyzacje';list.appendChild(li);
				}
				if(item.szyby==1){
					var li=document.createElement('li');li.innerHTML='szyby';list.appendChild(li);
				}
				$("#warsztaty_content").append(list);
			}
			$("#warsztaty_content").append('<a class="warsztat-btn bell" onclick="dial(\''+item.kom+'\')">zadzwoń <small>(+48 '+item.kom.substr(0,3)+' '+item.kom.substr(3,3)+' '+item.kom.substr(6,3)+')</small></a>');
			$("#warsztaty_content").append('<a class="warsztat-btn paper_plane" href="geo:0,0?q='+encodeURI(item.miasto+', '+item.ulica)+'">nawiguj</a>');
			$("#warsztaty_content").append('<a class="warsztat-btn map" href="#page3" onclick="showPoint('+item.lat+','+item.lng+')">pokaż na mapie</a>');
			$('#warsztat').page();
		}
	});
}
function dial(number){
	window.location.href = 'tel:+48'+number;
}
function checkVersion(){
	var checkVersion = $.ajax({
		url: "http://arcontact.pl/warsztaty_inter_cars/feed.php",
		type: "GET",
		data: {type:"version"},
		dataType: "json",
		async: false
	});
	checkVersion.done(function(response){
		if(typeof response != 'undefined') {
			if( supports_html5_storage() ) {
				if( typeof localStorage["version"] != 'undefined' ) {
					var _local_version = JSON.parse(localStorage["version"]);
					if( parseInt(_local_version.version) != parseInt(response.version) ) {
						localStorage["version"] = JSON.stringify(response);
						feedFromServer = true;
					} else {
						warsztaty = JSON.parse(localStorage["warsztaty"]);
					}
				} else {
					localStorage["version"] = JSON.stringify(response);
					feedFromServer = true;
				}
			} else {
				feedFromServer = true;
			}
		}
	});
}
function warsztatyLista(search){
	if(search) {
		feedFromServer = false;
		use_warsztaty = _warsztaty;
	}
	if(feedFromServer) {
		var ajaxFeed = $.ajax({
			url: "http://arcontact.pl/warsztaty_inter_cars/feed.php",
			type: "GET",
			data: {type:"list"},
			dataType: "json",
			async: false
		});
		ajaxFeed.done(function(response){
			if(typeof response != 'undefined') {
				warsztaty = response;
				if( supports_html5_storage() ) {
					localStorage["warsztaty"] = JSON.stringify(warsztaty);
				}
			}
		});
	}
	if(!search) {
		use_warsztaty = warsztaty;
	}
	use_warsztaty = filterValuePart(use_warsztaty,'');
	var len = Object.keys(use_warsztaty).length;
	if( len > 0 ) {
		$('#warsztaty_lista').empty();
		var out = '<div class="warsztat"><ul data-ajax="false" data-inset="true">';
		var per_page = 30;
		// wstawić pierwszy najbliższy warsztat - jest miejsce akurat dla jednego
		use_warsztaty = sortByKey(use_warsztaty, 'miasto');
		$.each(use_warsztaty,function(i,item){
			if(i%per_page==0 && i!=0){
				out = out + '</ul></div><div class="warsztat"><ul data-ajax="false" data-inset="true">';
			}
			out = out + '<li><a href="#warsztat" data-ajax="false" onclick="renderWarsztat('+i+')" data-transition="pop"><h6>' + item.konto + '</h6><span>' + item.miasto.toLowerCase() + ', ' + item.ulica.toLowerCase() + '</span></a></li>';
		});
		out = out + '</div>';
		
		$("#warsztaty_lista_hidden").html(out);
		$('.warsztaty_paginacja').pagination('destroy').pagination({
			items: len,
			itemsOnPage: per_page,
			cssStyle: 'light-theme',
			prevText: '<',
			nextText: '>',
			edges: 1,
			displayedPages: 3,
			onPageClick: pageClick,
			onInit: pageInit
		});
	} else {
		if(search) {
			$('#warsztaty_lista').empty().html('<p>Brak warsztatów.</p>');
			$('.warsztaty_paginacja').pagination('destroy');
		} else {
			window.plugins.toast.showLongCenter('Nie udało się wgrać listy warsztatów. Włącz internet aby pobrać najnowszą listę.',function(a){},function(b){});
		}
	}
}


var map;
var startingLatitude = 52.069347;
var startingLongitude = 19.480204;
function GoogleMap(){
	this.initialize = function(){
		var h = $(window).height() - 188;
		$("#map_canvas").css({"height":h+"px"});
		/*
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(displayPosition,geolocationError);
		} else {
			geolocationError();
		}
		*/
	}
}
/*
function displayPosition(pos){
	var mylat = pos.coords.latitude;
	var mylong = pos.coords.longitude;
	var latlng = new google.maps.LatLng(mylat,mylong);
	var myOptions = {
		zoom: 12,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false,
		panControl: false,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.TOP_RIGHT
		},
		scaleControl: true,
		streetViewControl: false
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	var l = Object.keys(use_warsztaty).length;
	for(var i=0; i<l; i++){
		createMarker(use_warsztaty[i]);
	}
	function createMarker(location) {
		var latlng = new google.maps.LatLng(parseFloat(location.lat), parseFloat(location.lng));
		var marker = new google.maps.Marker({
			map: map,
			position: latlng,
			icon: "data:image/png;base64,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"
		});
		var infowindow = new google.maps.InfoWindow({
			content: '<div class="noscrollbar">' + location.konto + '<br /><br /><a href="geo:0,0?q='+encodeURI(location.miasto+', '+location.ulica)+'" class="ui-btn ui-mini ui-icon-location ui-btn-icon-left ui-corner-all">pokaż w nawigacji</a></div>'
		});
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map, this);
		});
	}
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		title: 'Twoja lokalizacja'
	});
	function closestMarker(position,use_warsztaty){
		var closestMarker = -1;
		var closestDistance = Number.MAX_VALUE;
		var len1 = Object.keys(use_warsztaty).length;
		for(var i=0; i<len1; i++){
			var locationLatLng = new google.maps.LatLng(parseFloat(use_warsztaty[i].lat), parseFloat(use_warsztaty[i].lng));
			var dist = google.maps.geometry.spherical.computeDistanceBetween(position, locationLatLng);
			if(dist < closestDistance){
				closestMarker = i;
				closestDistance = dist;
			}
		}
		return closestMarker;
	}
	var closestMarker = closestMarker(latlng, use_warsztaty);
	var path = new google.maps.MVCArray();
	var service = new google.maps.DirectionsService();
	var poly = new google.maps.Polyline({ map: map, strokeColor: '#FF8200' });
	var src = latlng;
	
	var des = new google.maps.LatLng(use_warsztaty[closestMarker].lat,use_warsztaty[closestMarker].lng);
	path.push(src);
	poly.setPath(path);
	service.route({
		origin: src,
		destination: des,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	}, function (result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
				path.push(result.routes[0].overview_path[i]);
			}
		}
	});
	var LatLngList = new Array(src,des);
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
		bounds.extend(LatLngList[i]);
	}
	//$(".ui-page-active .right-sidebar .sidebar-arrow p").html("Najbliżej: "+use_warsztaty[closestMarker].address);
	$("#map_canvas").addClass("loaded");
	map.fitBounds(bounds);
}
function geolocationError() {
	//$(".ui-page-active .right-sidebar .sidebar-arrow p").html('Nie można ustalić pozycji - <a onclick="showGeolocationForm();">ustal ręcznie</a>');
	var mylat = startingLatitude;
	var mylong = startingLongitude;
	var latlng = new google.maps.LatLng(mylat, mylong);
	var myOptions = {
		zoom: 7,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false,
		panControl: false,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.TOP_RIGHT
		},
		scaleControl: true,
		streetViewControl: false
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	var l = Object.keys(use_warsztaty).length;
	for(var i=0; i<l; i++){
		createMarker(use_warsztaty[i]);
	}
	function createMarker(location) {
		var latlng = new google.maps.LatLng(parseFloat(location.lat), parseFloat(location.lng));
		var marker = new google.maps.Marker({
			map: map,
			position: latlng,
			icon: "data:image/png;base64,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"
		});
		var infowindow = new google.maps.InfoWindow({
			content: '<div class="noscrollbar">' + location.konto + '</div>'
		});
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map, this);
		});
	}
}
function showGeolocationForm(){
	$(".ui-page-active .right-sidebar .sidebar-arrow p").html('<div class="input-outer"><form id="geolocation-form" onsubmit="return false;"><input type="text" id="address" placeholder="Wprowadź adres (autouzupełnianie)" /></form></div>');
	var input = $(".ui-page-active #address").get(0);
	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);
	var marker = new google.maps.Marker({
		map: map
	});
	var pos = {
		coords: {
			latitude: startingLatitude,
			longitude: startingLongitude,
		}
	};
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		marker.setVisible(false);
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			return;
		}
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
		}
		marker.setPosition(place.geometry.location);
		marker.setVisible(true);
		pos.coords.latitude = place.geometry.location.lat();
		pos.coords.longitude = place.geometry.location.lng();
		displayPosition(pos);
	});
}
*/
function showPoint(lat,lng){
	
}
$(document).on('pageshow pagechange',function(){
	$(".ui-page-active [data-role=header]").fixedtoolbar({updatePagePadding:true});
});
$(document).on('pageshow','#page3',function(){
	if(typeof GoogleMap != 'undefined'){
		var gmap = new GoogleMap();
		gmap.initialize();
	}
});
$(document).ready(function(){
	checkVersion();
	warsztatyLista(false);
	$(".refresh_connection").bind("click",function(){
		if(navigator.onLine) {
			checkVersion();
			warsztatyLista(false);
		} else {
			window.plugins.toast.showShortCenter('Brak połączenia z internetem.',function(a){},function(b){});
		}
	});
});