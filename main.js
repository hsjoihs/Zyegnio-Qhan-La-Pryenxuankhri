!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');

var GLOBAL_INFO = {};


function $(id) { return document.getElementById(id); }

function ready()
{
	$("form").onsubmit=(function(){main(); return false;});
	$("dat").onkeyup = main;
	$("xenkwan").onclick = main;
	$("temsaku_xuheu").onclick = kagsin;
	main();
}

function main()
{
	var arr = textToArr($("dat").value);

	$("res").innerHTML = "";
	GLOBAL_INFO = {};

	for(var i=0; i<arr.length; i++)
		$("res").innerHTML += xenkwanki_segseg(i,arr[i]);
	
	GLOBAL_INFO.box_length = arr.length;
	GLOBAL_INFO.orig_strs = arr;
	
	kagsin();
	
	return;
}

function search(kanzi)
{
	var a = [];
	/*
	for(var i=0; i<zihom.length; i++)
		if(zihom[i][1].indexOf(kanzi)+1)
			a.push(zihom[i][0]);
	*/
	for(var i=0; i< dzyendziwprieu.length; i++)
	{
		if(dzyendziwprieu[i][1] === kanzi){
			a.push(dzyendziwprieu[i][2]
				.replace(/à/g, "â")
				.replace(/è/g, "ê")
				.replace(/ì/g, "î")
				.replace(/ò/g, "ô")
				.replace(/ù/g, "û")
				.replace(/ỳ/g, "ŷ")
				.replace(/ə̀/g, "ə̂")
				.replace(/l\*r/g, "lr")
				.replace(/g\*/g, "g")
				.replace(/\*/g, "ʼ")
			);
		}
	}
	return a;
}

function xenkwanki_segseg(num,hanzis)
{
	var res = '<div class="outer" id="outer_'+num+'">';
	
	for(var i=0; i<hanzis.length; i++) {
		var isSurrogate = hanzis.charCodeAt(i) == hanzis.codePointAt(i);
		var k = isSurrogate ? hanzis[i] : String.fromCodePoint(hanzis.codePointAt(i));
		res += '<div class="box">';
			var index = num + '_' + i;
			var info = search(k);
			
			if(info.length == 1)
				res += '<div class="kanzi"><ruby><rb>' + k + '</rb><rt id="box_' + index + '">' + zihom_to_gendaikana(info[0]) + '</rt></ruby>'  +'</div>';
			else res += '<div class="kanzi"><ruby><rb>' + k + '</rb><rt id="box_' + index + '"></rt></ruby>'  +'</div>';
			res += '<div class="zihomlist">';
			
			if(info.length == 1) {
				res += '<label class="zihom"><input type="radio" name="radio_' + index + '" class="radio" value="' + info[0] + '" checked><span class="zihomtext">' + info[0] + '</span></label>';
				GLOBAL_INFO["box_" + index] = info[0];
			} else if(info.length > 1) {
				for(var j=0; j<info.length; j++)
					res += '<label class="zihom"><input type="radio" name="radio_' + index + '" class="radio" value="' + info[j] + '" onclick="ev(\'box_' + index + '\', \'' + info[j] + '\')"><span class="zihomtext">' + info[j] + '</span></label>';
			} else {
				res += '<span style="white-space: nowrap; font-size: 80%">(´・ω・`)</span><br>'
			}
			res += '</div>';
		res += '</div>'

		if (!isSurrogate) {
			i++;
		}
	}
	GLOBAL_INFO['box_'+num+'_length'] = hanzis.length;
	
	res += '</div>';
	return res;
}

// "正書法 熟語変換器" -> ["正書法","熟語変換器"]
function textToArr(text)
{
	var kanzi = /([\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])+/g;
	var arr = [];
	var tmp;
	while ((tmp = kanzi.exec(text)) !== null)
		arr.push(tmp[0]);
	
	return arr;
}


function ev(id, zihom)
{
	$(id).innerHTML = zihom_to_gendaikana(zihom);
	GLOBAL_INFO[id] = zihom;

	kagsin();
}

function kagsin()
{
	var str = generate_str();
	if(str){
		removeShareButton();
		createShareButton(str
		+ " " 
		+ ($("temsaku_xuheu").checked ? "#themsiak" : "") 
		+ "\n");
		$("res2").innerHTML = str.replace(/\n/g, "<br>");
	} else {
		removeShareButton();
		$("res2").innerHTML = "";
	}
}

function createShareButton(text){
	$('tweet').innerHTML = "";
	twttr.widgets.createShareButton(
	'https://magnezone462.github.io/Zyegnio-Qhan-La-Pryenxuankhri/index.html',
	$('tweet'),
	{ text: text });
}

function removeShareButton(){$('tweet').innerHTML=""}

function generate_str(){
	var res = "";
	
	var enable = false;
	
	for(var i=0; i<GLOBAL_INFO.box_length;i++){
		res += GLOBAL_INFO.orig_strs[i] + " "
		for(var j=0;j<GLOBAL_INFO["box_"+i+"_length"];j++){
			if(! GLOBAL_INFO["box_"+i+"_"+j]){
				return null;
			} else {
				res += GLOBAL_INFO["box_"+i+"_"+j];
				enable = true;
			}
		}
		res += "\n"
	}
	
	if(!enable) return null;
	
	return res;
}