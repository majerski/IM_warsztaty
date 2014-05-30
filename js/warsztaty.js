$.mobile.defaultPageTransition = 'none';

$(window).load(function(){
	$(".main-loader").hide();
	$("#app").show();
});

var newsUrl = 'http://www.q-service.com.pl/rss/';
var warsztaty = [];
var _warsztaty = []; // po szukaniu
var use_warsztaty = [];
var feedFromServer = false;
var map;
var startingLatitude = 52.069347;
var startingLongitude = 19.480204;
var currentPosition = false;
var icons = {
	qservicepremium:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAlCAYAAAAjt+tHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA95JREFUeNq0V0toU0EUvXn5NimJFluI0M9CESmpn2LBT6GLdCGtuGrBurXQz9ZP6sqdSLfiry66qZuKILZu2kWhloJSRWv8QME24CZKIY8mzeflxbnDzMvkNUnfqy8Dl3kzmcw5986dO/faCoUCYOvt7XWQTiLiYr0DrG0KEZVIFvuFhQUcgw0JMHAE9jBxMQKSReAqI4DgaSZZJGELh8Mc3EvEz3pPjSyAwCkiMuuzXEsPA2+6uri4CjVsr8Ph86JVRNN7EbzNXQdeSQKPZLcUOK3mIaWqgBiERIgfg+h4SKIm4Nh0e3I/k7i3c6kJeBkSGiZ3NEPeHhwfg6Njo5COxcARCICSSMBS3xWI22zQns+b5SOBGU9HwOa7EYhe7oPkl3U6d3x1BSLBIMgJmY4byRn3KAoMZjPmWBhpCL79Zk4Dxxa/fQeGh29o4z/kRGddLph2u60nEI1+g8zhQyVz7tZWGDh5AtpUtWR+3umiZCwlcPPlK5j9/hMC3Ze0I2l7cB/kh49gMpWEgWy2ZD36hWUEonY71Whq6jn4nz2FCzsJ6Podo0eSWH5H17TnlQPdDENOuORw0h6dLXK6E8YzacuupiELbNqLsUF/3kUrFXXxkQfO6LU0RkBwKB8Uyv7+1unUxucUxdojQI2SzKmmXW7wknEXAcG5DySW4VxScLrBXNZaAmjO9yxoItCkp67iWgxG3kLBWh8YIJHNZ3BTHowsJYCOd283Rc1eTuOeXG5PIIra7dYdASdxK72rHUOKSKNwI9rJex+3FfVJGgxEVQm4W1ton9mK7XFK/ZHorfDfTujrCMGxJ4/p949rQ9DQ30+kD2QS+YLjo/RRwjUYDQPd3RCfeQFN14foU+1paaFjPwnbGLI3RkZLHjFDPoB/lJeXifZb0DwRIZs2a6+i/kHi4AmynmafJE/A/yJB/D6QBZCxn2imrH+F7bk5loDI5HseMkRLXyhErRGfmaEW+BWZoGR9HR0UFP+7MTJG11UjgWl5A+lRjmDCeNbnr2VSDB+TMs+M/xLZlli+zoVmr7Vqwt4apiSUS/SJw9S5FiR4Ws6HvERzCOApNE2lwgTrhQaH0xDYtpKDzcxutcIkJdYFKhvIbEFIV5rRm0KIrWC/HwkOTva5KFRA5Uoz/FaNFKdaDk9IrFWzhADeqfOtysXpPuU578Xy7VM5EgL4GdHEOgLly/NqjRFD8HomSOKzSEIAP8XAd5ikOVDFOFAw8MyWIVHPLUEzoqLmO2bADRMoQ8LPSKwxx+1koLIZcFMEdCS8THjmkWWmT5kBN01AIOHSXVVF9Gwz+/0TYABfRvbGJeOP2wAAAABJRU5ErkJggg==",
	qservice:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAlCAYAAAAjt+tHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABSJJREFUeNq0V11MXEUU/nZZdpddXKgKmihCxbQJhDam8gCl9GUpoX1oG7c2/sREMaTV+GIfLD7wgIlWU7WkUpqYaDSWNrGpNlJjpW0Eq8S2tAJl1VoTQLEIhgCyy+6yP845O/f2su7PvQqTnMz9mTvfN985c+4cUywWA7W6ujqL6MzCrLK3YHlbWFhUWIj67u5uuoeJCEhwArZLs0oC5mUCj0oCBB6QFiISJrfbrYA7hLlkb18hBQjYL2xO9iFllXYJXrj93Lk+rGA77XZXaVXRSu8g8BJbDhxmM+zmrGUFDkQj8EejIAxBokJxgzbwiMSKgFNLmFOJM7MS7YqtCHgSEiqmEmi6o92Sl4eCp55EXs1GuGo38TPf4BCmu84I60JwdEzvVGYYiXRvdhaCtbV44fRn/3qXt6mGbfUbr6N9+w7YentRthjRzyJdmxJeeu++e2A6+KYKHp6dxew3F/HbawfY6JqeUaMxRSeO49D99/K3GRVN93Iky4w2MdEHn5xEWVk5g4y83IzJj48lHV8oXFPUvB/19fUoOnUKz+zyYMfEFDYHF40r4DOZ8KrLgaaX9jE4+flqWQWmP++KA73SDOe6Cl7lyRwbvrBbMdx5HAPVNTyWvml9+xA+ctjSKpHyDX24qugBNDY+xyv/6fEnuF97ohMPHT0iCOzH+u8uorPBLQhYeXyrK4fHDDds456UWFddjQ6n3RgBWn2PLVuAN/L9rfYOjm7aARRsdH1zz/P8bsuWepaYrCASU2OEXEXN43mMAziVCkmfXrHGQ6OqKp41J4/FfU6Sc1YbGxMkRvm6vLycyRKAJxBU5yBXUSMVqF22WvQT8FriCUMJvHR72yH+pk5htMrWOxzqSpWd4nK52K5kGyDgFy6gtnv3Lt5maj4fG1OTka24OE522ItHF0IoiEbj2zbLdFsFkZxoDsPbsCEYYsn6+vowcVeh+pyUICNXUCBS+3n8dw5ApSlxwAsZHETf8ABfbw4t6leAslhliA8suDo+vuTd9a3bWJVb7XECLz7bCI9QgKzlb7+qBPtdyk7zpcoFKRPRHl9A+NWJCwE/KoXk5FPa75j8E1Nt77Cvd176HlND19VveqzZIn4saAiEOC4+nZzgfq8vYDwT0of75hfQ+qMXF9auQe2lfhHtFlViv9mEr86e5S0LS5YmdQOPiHdDpQ/i2h/j2OsPLlHFUCom6Yj9kZs3YC68Gy1/TauTETAFa7LJfxXg74cC7JZ0aVjX31CZ4F0nsHNNKed228wMK+SMxZaMDebnC7VK8eEvN/g7z0Lw//2MEkl0CJ+ez3eh0mlDhTMXq6ZnEJmdwdzqEoyKmDgv4mVOgD8tZN8aCOk7X+g9DxCJ4nAERyNRlDQ1oVpmOEpWXu8wTGLL2t46iBbhMr1nAS2BqJ7BJQL8wKwPl9sO4+ueXgSE5F+K56SC44dBHM7g7yS1AhMIa4xPr5nOhZwjxK74LydjTY3AZtaUS7xZ6eisGbjsx3LlVinRLBpwPxUNqQoTqhfutGTrApsOL2IkuJCuMPFr64KovJmTAyoSSjNO14LYt9RnIqGAi3k2JsRXYmlG11E9xal6hhck+tMpoQHfkBBbqYvTDOW50mvLt2vJSGjAH9ZKnEAgeXmerkliBJ4rjUgMaElowNdL8HlpAQUoVctIIAWJXEUJPr7fXvm8EXDdBJKQcEkS/TJwN0jQOSPghggkkHBIs8pXISm93wi4YQIaEtaErRrWRraR+f4RYAAMqZ7V/z/CFgAAAABJRU5ErkJggg==",
	perfectservice:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAlCAYAAAAjt+tHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA6BJREFUeNq8V0FPGkEUfq4UKBowJCXxANqbSbs0jadGveGl0vSs/AG1P0D0B9T2B9T+garnptoe9GabnkxTsUkPJio0MfFghCgFimvnm53ZjOsusApO8jLMssz3vfe+N8zrury8JIzx8XEfmzRmfjH7qL2jzsxgVsO8sbGBNXWBgAAHcFCYXxDQ2gRuCAIArwirgURXKpWS4CFmYTEHOxQBAJeZlcRck14GBXjs5ebmd+rg+JhKPVOjooY+BPDBwH0KaRoFte62AleMCyobBgGDkdBlGlThgURHwDFse0qdaVLt0joC7kDCwpQq1+juh9YW4PjC/K1+f6tS60nq5IuEKTI2ytehZJLP5Z0dKm597QyBwECC4vNZir5I0/lOjj/rfzV77b3qYZ52n0/wuW0EANo/O8M/AxyedkciVE0kODE54P3F6SkF2fMbE3DLbckWWoT9nBHhltu98l14bIyb+bstx7S4EjjP5SjAPPAxDwOJuDkPDDCPDun3ZMZ6b2h1mQqLb6x02CPWo+tUeL3YuBQcc83Aj94tcZEB+GjpPR3MZWlv2sw3hPfoyzp19/VRNJ121ArAw0KgnlMAj2H1YomHvV4sXvFShtb8PEoP3y7ydJiVEeHP4cCfBt67EoCq4wtZbgAFOEAgOhDq0R/T8cqq5R3EJvWBSEEPzcTXkMDJ2hrbNG7VtSo4CYQU7U3PUCyToV9NvPRMAOz351o74Qq3AHcVIfIYsYlHasJRbEnd8fmNIxDLTPFw97PD5GT9Mw93ND3BS1CuoQOU49DqCkvZuiVKkKzm8/SA7QE9mGVsVhS01FIEIDRsihIDEEoRa5TjIFM7AGDYHAcMCMMgWoDgqAbZ2NQkhUdHuFidouSuAQCwDTCDPWbU9PHyivVMnnogu5+dtw4tEJLkrHTkC44HlSuB4w/L1yvj01rLInQD83QS3umtRNxQ73oYkkBdMX577dRQ9rYwNaVdqvDbDLs6d4KEvJbLpWzRfAp4GU2DW2OCfiHqu9cS2En9Hx1U/zZqTMpqX2CIRUm8oNtaM64TRuwb/49vQkKCs31GbPqyt2b4bLTSnFp3eEZiu1EkFPBhm7bcm9Mm7bmc1fbthxMJBfypGmIbAef2vNEQxADeKwwkfqokFPAnAvxMWEUCuY2mBFxI9MpIYCien3kBb5mAA4mwILEthDssQEtewD0RsJEICfOLr2oi9GUv4J4JKCT8tlKtq8r2st9/AQYAMzDz3r0Yr1wAAAAASUVORK5CYII="
};
var warsztatShowPointId = false;

function GoogleMap(){
	this.initialize = function(){
		var h = $(window).height() - 188;
		$("#map_canvas").css({"height":h+"px"});
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(displayPosition,geolocationError);
		} else {
			geolocationError();
		}
	}
}
function createMarker(location) {
	var mapicon = $.trim(location.umowa).toLowerCase().replace(/ /g,'').replace(/-/g,'');
	var latlng = new google.maps.LatLng(parseFloat(location.lat), parseFloat(location.lng));
	var marker = new google.maps.Marker({
		map: map,
		position: latlng,
		icon:icons[mapicon]
	});
	var infowindow = new google.maps.InfoWindow({
		content: '<div class="noscrollbar">' + location.konto + '<br /><br /><span class="capitalize">'+location.ulica.toLowerCase()+'<br />'+location.kod.substr(0,2)+'-'+location.kod.substr(2)+' '+location.miasto.toLowerCase()+'</span><br /><br /><a href="geo:0,0?q='+encodeURI(location.miasto+', '+location.ulica)+'" class="ui-btn ui-mini ui-icon-location ui-btn-icon-left ui-corner-all">pokaż w nawigacji</a></div>'
	});
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map, this);
	});
}
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
function displayPosition(pos){
	currentPosition = pos;
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
	if(!warsztatShowPointId){
		var l = Object.keys(use_warsztaty).length;
		for(var i=0; i<l; i++){
			createMarker(use_warsztaty[i]);
		}
	} else {
		createMarker(use_warsztaty[warsztatShowPointId]);
	}
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		title: 'Twoja lokalizacja'
	});
	if(!warsztatShowPointId){
		var closestMarker1 = closestMarker(latlng, use_warsztaty);
	} else {
		var closestMarker1 = warsztatShowPointId;
	}
	warsztatShowPointId = false;
	
	var path = new google.maps.MVCArray();
	var service = new google.maps.DirectionsService();
	var poly = new google.maps.Polyline({ map: map, strokeColor: '#FF8200' });
	var src = latlng;
	
	var des = new google.maps.LatLng(use_warsztaty[closestMarker1].lat,use_warsztaty[closestMarker1].lng);
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
	$("#map_canvas").addClass("loaded");
	map.fitBounds(bounds);
}
function geolocationError() {
	if(typeof window.plugins != 'undefined' && typeof window.plugins.toast != 'undefined'){
		window.plugins.toast.showLongCenter('Nie można ustalić pozycji.',function(a){},function(b){});
	}
	$('#page3 .ui-content').prepend('<div class="input-outer"><input type="text" id="address" placeholder="Wprowadź adres (autouzupełnianie)" /></div>');
	$("#address").textinput();
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
			position: google.maps.ControlPosition.BOTTOM_RIGHT
		},
		scaleControl: true,
		streetViewControl: false
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	if(!warsztatShowPointId){
		var l = Object.keys(use_warsztaty).length;
		for(var i=0; i<l; i++){
			createMarker(use_warsztaty[i]);
		}
	} else {
		createMarker(use_warsztaty[warsztatShowPointId]);
	}
	warsztatShowPointId = false;
	showGeolocationForm();
}
function showGeolocationForm(){
	var input = $("#address").get(0);
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
function showPoint(id){
	$("#map_canvas").empty();
	document.getElementById("map_canvas").innerHTML="";
	warsztatShowPointId = id;
}
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
	part = part.toLowerCase();
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
			var mailbody = '\n\nWysłano przeglądając warsztat:\n'+item.konto+'\n'+item.ulica+'\n'+item.kod.substr(0,2)+'-'+item.kod.substr(2)+' '+item.miasto+'\n\n';
			$("#warsztaty_content").append('<a class="warsztat-btn bell" onclick="dial(\''+item.kom+'\')">zadzwoń <small>(+48 '+item.kom.substr(0,3)+' '+item.kom.substr(3,3)+' '+item.kom.substr(6,3)+')</small></a>');
			$("#warsztaty_content").append('<a class="warsztat-btn envelope" onclick="warsztatMail('+i+')">napisz e-mail</a>');
			$("#warsztaty_content").append('<a class="warsztat-btn paper_plane" href="geo:0,0?q='+encodeURI(item.miasto+', '+item.ulica)+'">nawiguj</a>');
			$("#warsztaty_content").append('<a class="warsztat-btn map" href="#page3" onclick="showPoint('+i+')">pokaż na mapie</a>');
			$('#warsztat').page();
		}
	});
}
function dial(number){
	window.location.href = 'tel:+48'+number;
}
function warsztatMail(id){
	var mailbody = '';
	$.each(use_warsztaty,function(i,item){
		if(i==id){
			mailbody = '<p>Warsztat:<br />'+item.konto+'<br />'+item.ulica+'<br />'+item.kod.substr(0,2)+'-'+item.kod.substr(2)+' '+item.miasto+'</p>';
		}
	});
	window.plugin.email.isServiceAvailable(
		function(isAvailable){
			window.plugin.email.open({
				to:['mifdetal@intercars.eu'],
				subject:'Zapytanie z aplikacji mobilnej Inter Cars sieć warsztatów.',
				body:mailbody,
				isHtml:true
			});
		}
	);
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
		
		var cM = -1;
		if(currentPosition){
			cM = closestMarker(currentPosition,use_warsztaty);
		}
		
		use_warsztaty = sortByKey(use_warsztaty, 'miasto');
		$.each(use_warsztaty,function(i,item){
			if(i%per_page==0 && i!=0){
				out = out + '</ul></div><div class="warsztat"><ul data-ajax="false" data-inset="true">';
			}
			if(cM == i){
				out = out + '<li class="closest"><a href="#warsztat" data-ajax="false" onclick="renderWarsztat('+i+')" data-transition="pop"><h5>Najbliższy warsztat</h5><h6>' + item.konto + '</h6><span>' + item.miasto.toLowerCase() + ', ' + item.ulica.toLowerCase() + '</span></a></li>';
			} else {
				out = out + '<li><a href="#warsztat" data-ajax="false" onclick="renderWarsztat('+i+')" data-transition="pop"><h6>' + item.konto + '</h6><span>' + item.miasto.toLowerCase() + ', ' + item.ulica.toLowerCase() + '</span></a></li>';
			}
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

function initNews(){
	var h = $(window).height() - 188;
	$('#articles').css({"min-height":h});
    var new_content = $('#articles_hidden div.news:eq(0)').clone();
    $('#articles').empty().addClass('loading');
	$('#articles').append(new_content);
	$('#page1').page();
	$('#articles ul').listview();
    return false;
};
function clickNews(news_index, jq){
    var new_content = $('#articles_hidden div.news:eq('+(news_index-1)+')').clone();
    $('#articles').empty().append(new_content);
	$('#articles ul').listview();
    return false;
};
function getNews() {
	var _news = [];
	var ajaxNews = $.ajax({
		url: newsUrl,
		type: 'GET',
		async: false,
		cache: false
	});
	ajaxNews.done(function(res){
		if(typeof res != 'undefined') {
			$('#articles').removeClass('loading');

			var xml = $(res);
			var items = xml.find("item");

			var list_block = $('<ul/>');
			list_block.appendTo('#articles');

			$.each(items, function(i, v) {
				entry = {
					title: $(v).find("title").text(),
					date: $(v).find("pubDate").text(),
					link: $(v).find("link").text(),
					description: $.trim($(v).find("description").text())
				};
				_news.push(entry);
			});
		}
	});

	var len = Object.keys(_news).length;
	if( len > 0 ) {
		$('#articles').empty();
		var out = '<div class="news"><ul data-ajax="false" data-inset="true">';
		var per_page = 10;

		$.each(_news,function(i,item){
			if(i%per_page==0 && i!=0){
				out = out + '</ul></div><div class="news"><ul data-ajax="false" data-inset="true">';
			}
			var _date = new Date(Date.parse(item.date));
			var months = Array("Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca", "Lipca", "Sierpnia", "Września", "Października", "Listopada", "Grudnia");
			var date_string = _date.getDate() + " " + months[_date.getMonth()] + " " + _date.getFullYear();
			out = out + '<li><a href="' +item.link+ '" data-ajax="false" rel="external"><h6>' + item.title + '</h6><span>' +date_string+ '</span></a></li>';
		});
		out = out + '</div>';

		$("#articles_hidden").html(out);
		$('.articles_pagination').pagination('destroy').pagination({
			items: len,
			itemsOnPage: per_page,
			cssStyle: 'light-theme',
			prevText: '<',
			nextText: '>',
			edges: 1,
			displayedPages: 3,
			onPageClick: clickNews,
			onInit: initNews
		});
	} else {
		window.plugins.toast.showLongCenter('Nie udało się wgrać listy aktualności. Włącz internet aby pobrać najnowszą listę.',function(a){},function(b){});
	}
};

$(document).on('pageshow pagechange',function(){
	$(".ui-page-active [data-role=header]").fixedtoolbar({updatePagePadding:true});
});
$(document).on('pageshow','#page1',function(){
	initNews();
});
$(document).on('pageshow','#page3',function(){
	if(typeof GoogleMap != 'undefined'){
		var gmap = new GoogleMap();
		gmap.initialize();
	}
});
$(document).on('pageshow','#page4',function(){
	$("#wycena").validate({
		errorPlacement: function(error, element) {
			error.insertAfter(element);
		},
		messages: {
			required: "pole wymagane"
		},
		submitHandler:function(form){
			var mailbody1 = '<p>Dane z formularza:</p><p>numer VIN: '+$("#vin").val()+'<br />marka, model, silnik: '+$("#marka").val()+'<br />rok produkcji: '+$("#rok").val()+'<br />rodzaj paliwa: '+$("#paliwo").val()+'<br />numer rejestracyjny: '+$("#rejestr").val()+'<br />usługa do wyceny: '+$("#usluga").val()+'<br />e-mail: '+$("#email").val()+'<br />numer telefonu: '+$("#tel").val()+'<br />miasto: '+$("#miasto").val()+'</p>';
			window.plugin.email.isServiceAvailable(
				function(isAvailable){
					window.plugin.email.open({
						to:['mifdetal@intercars.eu'],
						subject:'Zapytanie z aplikacji mobilnej Inter Cars sieć warsztatów.',
						body:mailbody1,
						isHtml:true
					});
				}
			);
		}
	});
});
$(document).ready(function(){
	checkVersion();
	warsztatyLista(false);
	getNews();
	$(".refresh_connection").bind("click",function(){
		if(navigator.onLine) {
			checkVersion();
			warsztatyLista(false);
			getNews();
		} else {
			window.plugins.toast.showShortCenter('Brak połączenia z internetem.',function(a){},function(b){});
		}
	});
	$('body').on('click', '[rel="external"]', function(e){
		e.preventDefault();
		var _el = $(this);
		window.open(_el.attr('href'), '_system', 'location=no');
	});
});