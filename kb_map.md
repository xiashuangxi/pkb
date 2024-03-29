---
layout: default
---
### 知识关系图
{% include setup.html %}
<style>
	.links line {
	  stroke: blue;
	  stroke-opacity: 1;
	}

	input[type="checkbox"] {
		-webkit-appearance:none;
		height: 0.8em;
		width: 0.8em;
		cursor:pointer;
		position:relative;
		-webkit-transition: .10s;
		/*border-radius:4em;*/
		border: 1px solid black;
		/*background-color:red;*/

		margin: 0;
	}

	input[type="checkbox"]:checked {
		background-color:black;
	}

	.out_l,
	.in_l {
		display: flex;
    align-items: center;
    margin-right: 6px;
	}

	.out_l::after,
	.in_l::after  {
		margin-left: 2px;
		content: "\A";
		display: inline-block;
		width: 12px;
		height: 3px;
	}
	.out_l::after  {
		background-color: #ff7f0e;
	}
	.in_l::after  {
		background-color: #2ca02c;
	}

	.in_panel {
		left: 10px; 
		top: 10px;
		display: flex;
		flex-flow: row;
		align-items: center;
		position: absolute;
		user-select: none;
	}
	.in_panel .out_panel_info {
		display: flex;
		background-color: #dddddd;
		border-radius: 4px;
		padding: 0px 4px;
		box-shadow: 1px 1px 0px #9b9b9b;
	}

	.in_panel .button{
		margin-left: 10px;
		cursor: pointer;
		padding: 0px 6px;
	}
	.in_panel .button:first-child{
		margin-left: 100px;
	}
	.in_panel .button:active {
		background-color: black;
		color:white;
	}

	.map_info {
		right: 10px;
    /*bottom: 155px;*/
    bottom: 15px;
    display: flex;
    flex-flow: row;
    align-items: center;
    position: absolute;
    user-select: none;
    background-color: #dddddd;
    border-radius: 4px;
    padding: 0px 4px;
    box-shadow: 1px 1px 0px #9b9b9b;
    background-color: #dddddd;
	}
	.progress_ui{
    flex-flow: row;
    align-items: center;
    position: absolute;
    user-select: none;
    background-color: #dddddd;
    border-radius: 4px;
    padding: 0px 4px;
    box-shadow: 1px 1px 0px #9b9b9b;
    background-color: #dddddd;
    display:none;
	}
</style>

<div style="position: relative;">
	<textarea id="namespace" style='display:none'> {{namespace}} </textarea>
	<div class="in_panel">
		<div class="out_panel_info">
			<div class="in_l">内联</div>
			<div class="out_l">外联</div>
			<div style="display: flex;align-items: center;">
				<input type="checkbox" style="margin-right: 2px" onchange="toggle_out()"><span>显示外联</span>
			</div>
		</div>

		<div class="out_panel_info button" title="放大">+</div>
		<div class="out_panel_info button" title="缩小">-</div>
	</div>

	<div id="map_info" class="map_info"></div>
	<div id="progress_ui" class="progress_ui"></div>

	<svg id="svg" style='width: 100%; height: 550px; border: 1px solid;'>
	</svg>


</div>

<script src="{{namespace}}/assets/scripts/lib/d3.v7.min.js"></script>
<script>
	var svg;
	var simulation;
	var height = document.getElementById('svg').clientHeight;
	var width = document.getElementById('svg').clientWidth;
	var links = [];
	var nodes = [];
	var data = [];

	var color = [];
	var types = ["licensing", "suit", "resolved"];
	var color = d3.scaleOrdinal(types, d3.schemeCategory10)

	function linkArc(d) {
	  var r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
	  return `
	    M${d.source.x},${d.source.y}
	    A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
	  `;
	}

	var drag = function( simulation) {  
	  function dragstarted(event, d) {
	    if (!event.active) simulation.alphaTarget(0.3).restart();
	    d.fx = d.x;
	    d.fy = d.y;
	  }
	  
	  function dragged(event, d) {
	    d.fx = event.x;
	    d.fy = event.y;
	  }
	  
	  function dragended(event, d) {
	    if (!event.active) simulation.alphaTarget(0);
	    d.fx = null;
	    d.fy = null;
	  }
	  
	  return d3.drag()
	      .on("start", dragstarted)
	      .on("drag", dragged)
	      .on("end", dragended);
	}

	var chart = function() {
		
		reset_map_info(nodes,links);

		document.getElementById('svg').innerHTML="";
		
		simulation = d3.forceSimulation(nodes)
			.force('link', d3.forceLink(links).id( function(d) { return d.id }) )
			.force('charge', d3.forceManyBody().strength(-600))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('x', d3.forceX())
			.force('y', d3.forceY());

		svg = d3.select('svg');

		svg.append('defs').selectAll('marker')
			.data(types)
			.join('marker')
			.attr('id', function(d) {return `arrow-${d}`} )
			.attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -0.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    	.append("path")
      .attr("fill", color)
      .attr("d", "M0,-5L10,0L0,5");

    var link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
    	.selectAll("path")
    	.data(links)
    	.join("path")
      .attr("stroke", function(d){ return color(d.type)} ) //d => color(d.type)
      //d => `url(${new URL(`#arrow-${d.type}`, location)})`
      .attr("marker-end", function(d){return `url(${new URL(`#arrow-${d.type}`, location)})`});

    var node = svg.append("g")
     	.attr("fill", "currentColor")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
    	.selectAll("g")
    	.data(nodes)
    	.join("g")
      .call(drag(simulation));

    node.append("circle")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)
      .attr("r", 4);

  	node.append("text")
      .attr("x", 8)
      .attr("y", "0.31em")
      .text(d => d.id)
    	.clone(true).lower()
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 3);

    simulation.on("tick", () => {
    	link.attr("d", linkArc);
    	node.attr("transform", d => `translate(${d.x},${d.y})`);
  	});
  	return svg.node();
	}

	var ___out____=false
	var toggle_out = function(){
		if(___out____) {
			remove_out_link();
			chart();
			___out____ = false;
		} else{
			nodes=[];
			links=[];
			load_data();
			___out____ = true;
		}
	}

	function node_push(obj) {
		// console.log("Push:"+obj.id)
		if(nodes.length == 0){
			nodes.push(obj)
		}else{
			var exis = false;
			for (var i = nodes.length - 1; i >= 0; i--) {
				var node = nodes[i];
				if (obj.id == node.id) { exis = true; break;}
			}
			if(!exis){ nodes.push(obj)}
		}

	}

	function escape2Html(str) { 
	 var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'}; 
	 return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];}); 
	} 

	let ConvertStringToHTML = function (str) {
   let parser = new DOMParser();
   let doc = parser.parseFromString(str, 'text/html');
   return doc.body;
	}

	remove = function(arr,inx) {
		arr.filter(function (item){
			return item !== inx
		})
	}

	var remove_out_link = function() {
		var _new_nodes = [];
		for (var i = nodes.length - 1; i >= 0; i--) {
			var n = nodes[i]
			if( n.t == 'in'){
				_new_nodes.push(n)
			}
		}
		nodes = _new_nodes;

		var _new_links = []
		for (var i = links.length - 1; i >= 0; i--) {
			var l = links[i]
			if(l.t == 'in'){
				_new_links.push(l)
			}
		}
		links = _new_links;
	}

	var load_data = function() {
		// show
	  show_load_data_progress_ui()

		var namespace = document.getElementById('namespace').value.trim();
	  var url = namespace.length == 0 ? "/feed.xml?rn="+Date.now() : "https://xiashuangxi.github.io/pkb/feed.xml?rn="+Date.now();

	  $.ajax({ url: url, success: function(data) {
	  	var entry = data.getElementsByTagName('entry');
	  	
	  	for (var i = entry.length - 1; i >= 0; i--) {
	  	
	  		var __entry = entry[i];
	  		var title = __entry.querySelector('title').innerHTML;
	  		var url = __entry.querySelector('link').getAttribute('href');
	  		var content = escape2Html(__entry.querySelector('content').innerHTML);
	  		// all a:<(a+) (?!(?:href=(["|']+)([http:\/\/])*link\.com([\/])?(.*?)["|'])) *[^>]*>(.*?)[^>]>
	  		var __a_tag = content.match(/<(a+) (?!(?:href=(["|']+)([http:\/\/])*link\.com([\/])?(.*?)["|'])) *[^>]*>(.*?)[^>]>/gm);
	  		
	  		for (var j = __a_tag.length - 1; j >= 0; j--) {

	  			var atag = __a_tag[j]
	  			// console.log(atag)
	  			var in_tag = atag.match(/.*Title:.*/gm);
	  			if(in_tag) {
	  				var in_obj = ConvertStringToHTML(in_tag).firstChild;;
	  				if(in_obj){
	  					links.push({source: title, target:in_obj.innerHTML, type:"resolved", t:"in"});
	  				}
	  			} 

	  			// out
	  			if (___out____) {
		  			var out_null_tag = atag.match(/.*href="#".*/gm);
		  			if(out_null_tag) {
		  				var out_null_obj = ConvertStringToHTML(out_null_tag).firstChild;
		  				if(out_null_obj){
		  					node_push({id: out_null_obj.innerHTML, link: out_null_obj.href, t: "out"})
		  					links.push({source: title, target:out_null_obj.innerHTML, type:"suit", t:"out"});
		  				}
		  			}
		  			// var out_tag = atag.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g);
		  			var out_tag = atag.match(/.*http.*/g);

		  			if(out_tag) {
		  				// console.log(out_tag)
		  				var out_obj = ConvertStringToHTML(out_tag).firstChild;
		  				// console.log(out_obj)
		  				if(out_obj){
		  					node_push({id: out_obj.innerHTML, link: out_obj.href, t: "out"})
		  					links.push({source: title, target:out_obj.innerHTML, type:"suit", t:"out"});
		  				}
		  			}
		  		}
	  		}
	  		node_push({id: title, link: url, t: "in"})

	  	}
			chart()
			hide_load_data_progress_ui();
	  }});

	  console.log(nodes)
	  console.log(links)
	}

	window.onload = function(){
		load_data();
	}

	var reset_map_info = function(ns,ls){
		var text = "";
		var _in = 0;
		var _out = 0;
		var _in_ref = 0;
		var _out_ref = 0;
		for (var i = ns.length - 1; i >= 0; i--) {
			var node = ns[i]
			if (node.t == 'in') { _in = _in + 1;}
			if (node.t == 'out') { _out = _out + 1;}
		}

		for (var i = ls.length - 1; i >= 0; i--) {
			var link = ls[i]
			if (link.t == 'in') { _in_ref = _in_ref + 1;}
			if (link.t == 'out') { _out_ref = _out_ref + 1;}
		}
		// console.log(_in,_out,_in_ref,_out_ref)

		document.getElementById("map_info").innerHTML= "内部文章："+_in+"篇；外部文章："+_out+"篇；内联：<span style='color:#2ca02c'>"+_in_ref+"</span>条；外联：<span style='color:#ff7f0e'>"+_out_ref+"</span>条";
	}

	var load_data_progress_ui_interval;
	var show_load_data_progress_ui = function() {
		var l = 0;
		var progress_ui = document.getElementById("progress_ui");
		var w = progress_ui.offsetWidth;
		var pw = progress_ui.parentElement.offsetWidth;
		var text = "数据加载中，请稍后";
		progress_ui.style.display = "flex";
		progress_ui.style.top = "50%";
		progress_ui.style.left = (pw / 2 - w / 2) + "px";
		progress_ui.innerHTML = text;
		load_data_progress_ui_interval = setInterval(function() {
			
			progress_ui.style.left = (pw / 2 - w / 2) + "px";
			var lt = "";
			for (var i = (l%3); i >= 0; i--) {
				lt = lt+'.';
			}
			l = l + 1;

			progress_ui.innerHTML = text+lt;
		}, 500);

	}

	var hide_load_data_progress_ui = function() { 
		var progress_ui = document.getElementById("progress_ui");
		progress_ui.style.display = "none";
		clearInterval(load_data_progress_ui_interval);
	}
</script>
