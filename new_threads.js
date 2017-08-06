var proxy = '';

function loadScript(url, callback)
{
	// Adding the script tag to the head as suggested before
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;

	// Then bind the event to the callback function.
	// There are several events for cross browser compatibility.
	script.onreadystatechange = callback;
	script.onload = callback;

	// Fire the loading
	head.appendChild(script);
}

const refreshJson = function() {
	button = document.getElementById('refreshButton');
	if (button.disabled) {
		return;	
	}
	console.log('start');
	button.disabled = true;

	$.ajax({
		url: '//' + proxy + 'bbs.sgamer.com/api/mobile/index.php?module=newthreads&fids=44&version=1&limit=' + document.getElementById('threadCount').value,
		success: handleJson
	})
	.always(function() {
		button.disabled = false;
	});
}

const handleJson = function(json) {
	console.log(json);
	threads = json['Variables']['data'];
	content = "";
	for (key in threads) {
		thread = threads[key];
		console.log(thread);

		content += '<tr>';
		
		content += '<td>';
		content += '<a target="_blank" href="/forum.php?mod=viewthread&tid=' + thread['tid'] + '&action=printable">print</a>';
		content += '/';
		content += '<a target="_blank" href="/forum.php?mod=viewthread&tid=' + thread['tid'] + '">link</a>';
		content += '</td>';
		
		content += '<td>' + thread['subject'] + '</td>';
	
		d = new Date(+thread['dateline']);
		content += '<td><a target="_blank" href="//bbs.sgamer.com/home.php?mod=space&uid=' + thread['authorid'] + '">' + thread['author'] + '</a>@' + thread['dateline'] + '</td>';

		content += '</tr>';
	}

	document.getElementById('jsonWarpper').innerHTML = content;
}

const mainEntry = function() {

	document.open('text/html', 'replace');
	document.write(`
<html><body onload="refreshJson()">
<style>
body {
	font: 15px/1.5 Tahoma,'Microsoft Yahei','Simsun'
}
table {
	border-collapse: collapse;
	width: 100%;
}
tr:nth-child(even) {
	background-color: #eeeeee;
	vertical-align: middle;
}
td {
	padding: 10px;
}
</style>
<div>Threads to read: <input id="threadCount" value="20" onkeydown = "if (event.keyCode == 13) refreshJson()" ></div>
<button id="refreshButton" onclick='refreshJson()' >Refresh</button>
<table>
<tbody id="jsonWarpper">
</tbody>
</table></body>
	`);
	document.close();
};

if (confirm("Use this tool?")) {
	loadScript('//code.jquery.com/jquery-git.js ', mainEntry);
}
