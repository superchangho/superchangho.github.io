var list = [];
var baseUrl = "http://52.20.231.141:8181";

function makeHtml(template, htData) {
	for (var key in htData) {
		var searchKey = "#{" + key + "}";
		template = template.replace(new RegExp("#{" + key + "}", "ig"), htData[key]);
	}
	return template;
}

function saveUrl() {
	$.ajax({
		url : baseUrl + '/saveurl.json',
		data : {url:$.trim($("#txtUrl").val())},
		type : "GET",
		timeout : 1000,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		complete : function(res) {
			alert("save");
		} 
	});
}

function loadList() {
	list = [];
	$.ajax({
		url : baseUrl + '/getlist.json',
		type : "GET",
		timeout : 1000,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		complete : function(res) {
			var json = $.parseJSON(res.responseText);
			list = json;
			drawList();
		} 
	});
}

var __listTemplate = '\
	<a href="#{url}" class="list-group-item" target="_blank">\
		<h4 class="list-group-item-heading">#{title} &nbsp;<img src="http://dn.api1.kage.kakao.co.kr/14/dn/btqa9B90G1b/GESkkYjKCwJdYOkLvIBKZ0/o.jpg" id="#{linkBtnId}" width="30" height="30"/></h4>\
		#{img}\
		<p class="list-group-item-text">#{summary}</p>\
	</a>\
';

function drawList() {
	var welList = $("._contentlist");
	for (var i = 0; i < list.length; i++) {
		list[i].linkBtnId = "kakao-link-btn" + i;
		if (!list[i].img) {
			list[i]["img"] = "";
		} else {
			list[i]["img"] = "<img src='" + list[i].img + "' width='160' height='120'>";			
		}
		var html = makeHtml(__listTemplate, list[i]);
		var wel = $(html);
		welList.append(wel);

		try {
			// 카카오 로그인 버튼을 생성합니다.
			Kakao.Link.createTalkLinkButton({
				container : '#' + linkBtnId,
				label : list[i].title,
				image : {
					src : 'http://dn.api1.kage.kakao.co.kr/14/dn/btqaWmFftyx/tBbQPH764Maw2R6IBhXd6K/o.jpg',
					width : '300',
					height : '200'
				},
				webLink : {
					text : '다른 인기글 보러 가기',
					url : 'https://superchangho.github.io'
				},
				webButton : {
					text : "본문 읽기",
					url : 'https://superchangho.github.io/redirect.html?next=' + escape(list[i].url) // 앱 설정의 웹 플랫폼에 등록한 도메인의 URL이어야 합니다.
				}
			});
		} catch (e) {
		}
	}
}
