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
	<li class="list-group-item">\
		<span style="float:right" id="#{linkBtnId}"><img src="http://dn.api1.kage.kakao.co.kr/14/dn/btqa9B90G1b/GESkkYjKCwJdYOkLvIBKZ0/o.jpg" width="30" height="30"/></span>\
		<a href="#{url}" target="_blank">#{title}</a>\
		<p onclick="window.open(\'#{url}\')">#{summary}#{imgTag}</p>\
	</li>\
';

function drawList() {
	var welList = $("._contentlist");
	for (var i = 0; i < list.length; i++) {
		var linkBtnId = "kakao-link-btn" + i;
		list[i].linkBtnId = linkBtnId;
		if (!list[i].title) {
			list[i].title = "[제목없음]";
		}
		if (!list[i].image) {
			list[i].image = "http://dn.api1.kage.kakao.co.kr/14/dn/btqaWmFftyx/tBbQPH764Maw2R6IBhXd6K/o.jpg";	// default image;
			list[i]["imgTag"] = "";
		} else {
			list[i]["imgTag"] = "<img src='" + list[i].image + "' width='160' height='120'>";			
		}
		list[i]["summary"] = "본문" + list[i]["summary"] + "본문";
		var html = makeHtml(__listTemplate, list[i]);
		var wel = $(html);
		welList.append(wel);

		try {
			// 카카오 로그인 버튼을 생성합니다.
			Kakao.Link.createTalkLinkButton({
				container : '#' + linkBtnId,
				label : list[i].title,
				image : {
					src : list[i].image,
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
