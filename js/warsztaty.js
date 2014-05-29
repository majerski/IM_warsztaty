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
			$("#warsztaty_content").append('<a class="warsztat-btn bell" onclick="dial(\''+item.kom+'\')">zadzwoń do warsztatu</a><br /><a class="warsztat-btn paper_plane" href="geo:0,0?q='+encodeURI(item.miasto+', '+item.ulica)+'">nawiguj do warsztatu</a>');
			$("#warsztaty_content").append('<div id="map_canvas" class="map"><div class="error">nie udało się załadować mapy...<br /><br /><a href="#" data-role="button" data-theme="c" data-inline="true" data-icon="refresh" data-iconpos="top" class="refresh_map">odśwież</a></div></div>');
			$('#warsztaty_content button').button();
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
			$('#warsztaty_lista').empty().html('Brak warsztatów.');;
			
		} else {
			window.plugins.toast.showLongCenter('Nie udało się wgrać listy warsztatów. Włącz internet aby pobrać najnowszą listę.',function(a){},function(b){});
		}
	}
}
$(document).on('pagebeforeshow',function(){
	$(this).find('a[data-rel=back]').buttonMarkup({
        iconpos: 'notext'
    });
});
$(document).on('pageshow pagechange',function(){
	$(".ui-page-active [data-role=header]").fixedtoolbar({updatePagePadding:true});
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