var warsztaty = {};

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
function pageInit(){
    var new_content = $('#warsztaty_lista_hidden div.warsztat:eq(0)').clone();
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
function renderWarsztat(id){
	var len = Object.keys(warsztaty).length;
	for(var i=1; i<=len; i++) {
		if(i==id){
			//console.log(warsztaty[i]);
			$("#warsztaty_content").empty();
			$("#warsztaty_content").append('<h2>'+warsztaty[i].konto+'</h2>');
			$("#warsztaty_content").append('<p>'+warsztaty[i].ulica+'<br />'+warsztaty[i].kod.substr(0,2)+'-'+warsztaty[i].kod.substr(3)+' '+warsztaty[i].miasto+'</p>');
			$("#warsztaty_content").append('<button data-theme="d" data-disabled="false" onclick="dial(\''+warsztaty[i].kom+'\')">Zadzwoń</button>');
			$('#warsztat button').button();
			$('#warsztat').page();
		}
	}
}
function dial(number){
	window.location.href = 'tel:+48'+number;
}
$(window).load(function(){
	var loader = document.getElementById('main-loader'); 
	loader.style.display = 'none';
	var appDiv = document.getElementById('app'); 
	appDiv.style.display = 'block';
});
$(document).on('pagebeforeshow', function () {
    $(this).find('a[data-rel=back]').buttonMarkup({
        iconpos: 'notext'
    });
});
$(document).ready(function(){
	var feedFromServer = false;
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
					var _local_version = JSON.parse( localStorage["version"] );
					if( parseInt(_local_version.version) != parseInt(response.version) ) {
						localStorage["version"] = JSON.stringify(response);
						feedFromServer = true;
					} else {
						warsztaty = JSON.parse( localStorage["warsztaty"] );
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
	var len = Object.keys(warsztaty).length;
	if( len > 0 ) {
		var out = '<div class="warsztat"><ul data-ajax="false" data-inset="true">';
		var per_page = 11;
		// wstawić pierwszy najbliższy warsztat - jest miejsce akurat dla jednego
		for(var i=1; i<=len; i++) {
			if(i%per_page==0){
				out = out + '</ul></div><div class="warsztat"><ul data-ajax="false" data-inset="true">';
			}
			out = out + '<li><a href="#warsztat" data-ajax="false" onclick="renderWarsztat('+i+')">' + warsztaty[i].konto + '</a></li>';
		}
		out = out + '</div>';
		$("#warsztaty_lista_hidden").html(out);
		$('#warsztaty_paginacja').pagination({
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
		window.plugins.toast.showShortCenter('Nie udało się uzyskać najnowszej listy warsztatów.',function(a){},function(b){});
	}
});