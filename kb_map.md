---
layout: default
---

# 知识关系图

<div id="svg" style="border: 1px solid;overflow: auto"></div>
<!-- <svg width="1500" height="600"></svg> -->
<!-- feed -->
<!-- https://xiashuangxi.github.io/pkb/feed.xml -->
{% include setup.html %}
<script src="{{namespace}}/assets/scripts/lib/jquery.min.js"></script>
<script src="{{namespace}}/assets/scripts/lib/d3.v7.min.js"></script>
<script>

	// var nodes = [];
	// var links = [];

	// var load_rss_json = function() {
	// 	var json;
	// 	// rss ulr
	// 	// test: https://xiashuangxi.github.io/bookphrase/feed.xml
	// 	// examples:https://observablehq.com/@d3/mobile-patent-suits
	// 	var feedURL = "https://xiashuangxi.github.io/bookphrase/feed.xml";
	// 	$.ajax({
	// 		async: false,
	// 		type: 'GET',
	// 		url: "https://api.rss2json.com/v1/api.json?rss_url=" + feedURL,
	// 		dataType: 'jsonp',
	// 		success: function(result) {
	// 			draw(result)
	// 		}
	// 	});
	// }

	// var parse_data = function( data){
	// 	console.log(items)
	// 	var items = data.items;
	// 	for (var i = 0; i < items.length; i++){
	// 		var obj = items[i];
	// 		nodes.push( Object.create({id: obj.title}));
	// 	}

	// 	links.push(Object.create({source:"Source",target:"Target",type:"link"}));
	// 	console.log(links);
	// 	console.log(nodes);
	// }

	// var chart = {
	// 	links: [],
	// 	nodes: [],

	// 	svg: d3.create('svg'),
	// }

	// var draw = function( data ) {
	// 	console.log(data);
	// 	function dragstarted(event,d) {
	// 		console.log("dragstarted")
	// 	}
	// 	function dragged(event,d) {}
	// 	function dragended(event,d) {}



	// 	return d3.drag()
	// 	.on("start",dragstarted)
	// 	.on("drag",dragged)
	// 	.on("end",dragended);
	// }
	// window.onload = function () { 
	// 	load_rss_json()
	// }

</script>

<!-- test -->
<script>
	var links = [];
	var nodes = [];
	// var types = ['outlink','inlink'];
	var types = ["licensing", "suit", "resolved"];
	var data = [];
	// <svg viewBox="-576,-300,1152,600" style="font: 12px sans-serif;">
	var height = 600;
	var width  = 1400;

	// init links
	// for (var i = 3; i >= 1; i--) {
	// 	var obj = {
	// 		source: 'Source'+i,target: 'target'+i,type:'licensing'
	// 	}
	// 	links.push(obj);
	// }





	// links.push({ source: "Microsoft" , target: "Mi", type: "licensing"});
	// links.push({ source: "Microsoft" , target: "Huawei", type: "licensing"});
	// links.push({ source: "Microsoft" , target: "oracle", type: "licensing"});
	// links.push({ source: "大米" , target: "oracle", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft", type: "licensing"});

	// links.push({ source: "大米" , target: "Microsoft1", type: "suit"});
	// links.push({ source: "大米" , target: "Microsoft2", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft3", type: "suit"});
	// links.push({ source: "大米" , target: "Microsoft4", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft5", type: "suit"});
	// links.push({ source: "大米" , target: "Microsoft6", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft7", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft8", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft9", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft0", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft11", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft22", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft33", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft44", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft55", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft66", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft77", type: "licensing"});
	// links.push({ source: "大米" , target: "Microsoft88", type: "licensing"});

	// nodes.push({id: "Microsoft"})
	// nodes.push({id: "Mi"})
	// nodes.push({id: "Huawei"})
	// nodes.push({id: "oracle"})
	// nodes.push({id: "大米"})
	// nodes.push({id: "Microsoft1"})
	// nodes.push({id: "Microsoft2"})
	// nodes.push({id: "Microsoft3"})
	// nodes.push({id: "Microsoft4"})
	// nodes.push({id: "Microsoft5"})
	// nodes.push({id: "Microsoft6"})
	// nodes.push({id: "Microsoft7"})
	// nodes.push({id: "Microsoft8"})
	// nodes.push({id: "Microsoft9"})
	// nodes.push({id: "Microsoft0"})
	// nodes.push({id: "Microsoft11"})
	// nodes.push({id: "Microsoft22"})
	// nodes.push({id: "Microsoft33"})
	// nodes.push({id: "Microsoft44"})
	// nodes.push({id: "Microsoft55"})
	// nodes.push({id: "Microsoft66"})
	// nodes.push({id: "Microsoft77"})
	// nodes.push({id: "Microsoft88"})

	// for (var i = 3; i >= 1; i--) {
	// 	var obj = {
	// 		id: 'Source'+i
	// 	}
	// 	nodes.push(obj);
	// }

	// for (var i = 3; i >= 1; i--) {
	// 	var obj = {
	// 		id: 'target'+i
	// 	}
	// 	nodes.push(obj);
	// }

	var __chart  =function() {

		console.log('__chart')

	data = {
		nodes: nodes,
		links: links
	};

	// 
	var drag = function(simulation) {

		var dragstarted = function(event,d){
			console.log("dragstarted")
			if(!event.active){
				simulation.alphaTarget(0.3).restart();
			}
			d.fx = d.x;
			d.fy = d.y;
		}

		var dragged = function(event,d){
			console.log("dragged")
 			d.fx = event.x;
    		d.fy = event.y;
		}

		var dragended = function(event,d){
			console.log("dragended")
			if (!event.active) {simulation.alphaTarget(0);}
    		d.fx = null;
    		d.fy = null;
		}

		return d3.drag()
			.on('start',dragstarted)
			.on('drag',dragged)
			.on('end',dragended);
	}

	var linkArc = function(d) {
		var r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
		// console.log(d.source)
		return  `
		    M${d.source.x},${d.source.y}
		    A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
		  `;
	}
	var color = d3.scaleOrdinal(types, d3.schemeCategory10);

	// var chart = {
		links= data.links.map(d => Object.create(d)),
		nodes= data.nodes.map(d => Object.create(d)),

		simulation= d3.forceSimulation(nodes)
			.force('link', d3.forceLink(links).id(d=> d.id))
			.force('charge', d3.forceManyBody().strength(-350))
			// .force("center",  d3.forceCenter(width/2, height/2))
			.force('x', d3.forceX())
			.force('y', d3.forceX())
			.restart();
		

		// <svg viewBox="-576,-300,1152,600" style="font: 12px sans-serif;">
		svg= d3.create('svg')
			// .attr('viewBox', [-576,-300,1152,600])
			      .attr("viewBox", [-width / 2, -height / 2, width, height])

			.style('font', '9px sans-serif')
			// .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

			// chart.
	// svg.append('defs').selectAll('marker')
	// 	.data(types)
	// 	.join('marker')
	// 		.attr('id', d => "aaaa"+d)
	// 		.attr('viewBox', '0 -5 10 10')//0 -5 10 10
	// 		.attr('refX', 15)//15
	// 		.attr('refY', -0.5)
	// 		.attr('markerWidth',3)
	// 		.attr('markerHeight',3)
	// 		.attr('orient','auto')
	// 	.append('path')
	// 		.attr('fill', color)
	// 		.attr('d', 'M0,-5L10,0L0,5');
	svg.append("defs").selectAll("marker")
    .data(types)
    .join("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -0.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    .append("path")
      .attr("fill", color)
      .attr("d", "M0,-5L10,0L0,5");

		// link = svg.append('g')
		// 	.attr('fill', 'none')
		// 	.attr('stroke-width', 1.5)
		// 	.selectAll('path')
		// 	.data(links)
		// 	.join('path')
		// 	.attr('stroke', d => color(d.type))
			// .attr('marker-end' d => `url(d.type)`)),
	link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 0.8)//1.5
    .selectAll("path")
    .data(links)
    .join("path")
      .attr("stroke", d => color(d.type))
      .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

		// node= svg.append('g')
		// 	.attr('fill', 'currentColor')
		// 	.attr('stroke-linecap', 'round')
		// 	.attr('stroke-linejoin', 'round')
		// 	.selectAll('g')
		// 	.data(nodes)
		// 	.join('g')
		// 	.call(drag(simulation))

		node = svg.append("g")
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
	      .attr("r", 4); // 4

      	node.append("text")
	      .attr("x", 8)//8
	      .attr("y", "0.31em")//0.31em
	      .text(d => d.id)
	    .clone(true).lower()
	      .attr("fill", "none")
	      .attr("stroke", "white")
	      .attr("stroke-width", 3);//3

  	simulation.on("tick", () => {
    	link.attr("d", linkArc);
    	node.attr("transform", d => `translate(${d.x},${d.y})`);
  	});

  // invalidation.then(() => simulation.stop());

  
	// }

	

	svg.node();
  	document.getElementById('svg').append(svg.node());
  	}

  	var load_rss_json = function() {
		var json;
		// rss ulr
		// test: https://xiashuangxi.github.io/bookphrase/feed.xml
		// examples:https://observablehq.com/@d3/mobile-patent-suits
		var feedURL = "https://xiashuangxi.github.io/pkb/feed.xml";
		$.ajax({
			async: false,
			type: 'GET',
			url: "https://api.rss2json.com/v1/api.json?rss_url=" + feedURL,
			dataType: 'jsonp',
			success: function(result) {
				// draw(result)
				console.log(result)

				if( result ){

					for (var i = result.items.length - 1; i >= 0; i--) {
						var obj = result.items[i];
						console.log(obj.content)
						var re = /^"(\/http\/.+)"$/
						console.log(obj.content.match(re))		

						nodes.push({id: obj.title});
						
					}
				}


				__chart()
			}
		});
	}
	load_rss_json()
</script>