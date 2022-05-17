---
layout: default
---

## 知识关系图


{% include setup.html %}

<style>
	.chart button {
		padding: 2px 6px;
   	border: 1px solid black;
    text-align: center;
    cursor: pointer;
    user-select: none;
    margin: 1px;
    width: 22px;
    height: 22px;
    box-shadow: 1px 1px 1px 0 rgb(0 0 0 / 30%);
	}
	.chart button:hover {
		background-color: black;
		color: white;
	}
</style>
<textarea id="namespace" style='display:none'> {{namespace}} </textarea>

<div class="chart" id="svg" style="border: 1px solid;overflow: auto;">
	<div id="chart_button" style="display: none;position: absolute;">
		<button>+</button>
		<button>-</button>
		<button>·</button>
	</div>
</div>
<!-- <svg width="1500" height="600"></svg> -->
<!-- feed -->
<!-- https://xiashuangxi.github.io/pkb/feed.xml -->

<script src="{{namespace}}/assets/scripts/lib/jquery.min.js"></script>
<script src="{{namespace}}/assets/scripts/lib/d3.v7.min.js"></script>


<!-- 	// 	// rss ulr
	// 	// test: https://xiashuangxi.github.io/bookphrase/feed.xml
	// 	// examples:https://observablehq.com/@d3/mobile-patent-suits -->
	

<!-- test -->
<script>
	var links = [];
	var nodes = [];
	// var types = ['outlink','inlink'];
	var types = ["licensing", "suit", "resolved"];
	var data = [];
	// <svg viewBox="-576,-300,1152,600" style="font: 12px sans-serif;">
	var height = document.documentElement.clientHeight - 150;//600;
	var width  = document.documentElement.clientWidth;//1400;

	var __chart  =function() {
		data = { nodes: nodes, links: links};

		var drag = function(simulation) {
			var dragstarted = function(event,d){
				if(!event.active){
					simulation.alphaTarget(0.3).restart();
				}
				d.fx = d.x;
				d.fy = d.y;
			}

			var dragged = function(event,d){
 				d.fx = event.x;
    		d.fy = event.y;
			}
	
			var dragended = function(event,d){
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
			return `
			    M${d.source.x},${d.source.y}
			    A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
			  `;
		}

		var color = d3.scaleOrdinal(types, d3.schemeCategory10);
		links= data.links.map(d => Object.create(d)),
		nodes= data.nodes.map(d => Object.create(d)),

		simulation= d3.forceSimulation(nodes)
			.force('link', d3.forceLink(links).id(d=> d.id))
			.force('charge', d3.forceManyBody().strength(-350))
			.force('x', d3.forceX())
			.force('y', d3.forceX())
			.restart();
		
		svg= d3.create('svg')
			// .attr('viewBox', [-576,-300,1152,600])
			.attr("viewBox", [-width / 2, -height / 2, width, height])
			.style('font', '12px sans-serif')
			.style("cursor", "pointer");
			// .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
			// .call(d3.zoom().on('zoom', function() {
			// 	svg.attr('transform', d3.event.transform)
			// }))
 // const g = svg.append("g");





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

		link = svg.append("g")
  	    .attr("fill", "none")
  	    .attr("stroke-width", 0.8)//1.5
  	  .selectAll("path")
  	  .data(links)
  	  .join("path")
  	    .attr("stroke", d => color(d.type))
  	    .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

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
		// svg.call(zoom)
  //   .call(zoom.transform, d3.zoomIdentity).node();

  	// const zoom = d3.zoom().on("zoom", e => {
   //  	node.attr("transform", (transform = e.transform));
   //    node.style("stroke-width", 3 / Math.sqrt(transform.k));

	  //   console.log('x')
	  // });

  	// document.getElementById('svg').append(
  	// 	svg.call(zoom)
   //  .call(zoom.transform, d3.zoomIdentity)
   //  .node()
  	// );

// k = height / width
//   	x = d3.scaleLinear()
//     .domain([-4.5, 4.5])
//     .range([0, width])
//     y = d3.scaleLinear()
//     .domain([-4.5 * k, 4.5 * k])
//     .range([height, 0])

//   	const zoom = d3.zoom()
//   		.scaleExtent([0.5],32)
//   		.on('zoom', zoomed);
		
// 		svg.call(zoom)
//   			.call(zoom.transform, d3.zoomIdentity);

  	function zoomed({transform}) {
  		const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
    	const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
    	node.attr("transform", transform).attr("stroke-width", 5 / transform.k);
  	}

  	document.getElementById('svg').append(
  		svg.node()
  	);
	}
  var load_rss_json = function() {
  	var namespace = document.getElementById('namespace').value.trim();
  	var url = "https://xiashuangxi.github.io/pkb/feed.xml?rn="+Date.now();
  	if(namespace.length == 0){
  		url = "/feed.xml?rn="+Date.now();
  	}
  	$.ajax({
  		url: url,
  		success: function(result){
  			var entry  = result.getElementsByTagName("entry")
  			for (var i = entry.length - 1; i >= 0; i--) {
  				var e = entry[i];
  				var title = e.querySelector("title").innerHTML
  				var content = e.querySelector("content").innerHTML
  				var url = e.querySelector('link').getAttribute('href');
  				var m = content.match(/"(\/pkb\/.+)"/);
  				if(m) {
  					var ref = m[1];
  					var m1 = ref.match(/(?<=Title:).+/)
  					if(m1){
						for (var i = nodes.length - 1; i >= 0; i--) {
							var n = nodes[i];
							if(m1[0] == n.id) {
								links.push({
									source: title,
									target: m1[0],
									type: 'licensing'
								})
							}
						}
  					}
  				}
				nodes.push({id: title,link: url});
  			}
  			__chart()
  		}
  	})
	}

	window.onload = function() {
		load_rss_json()
		document.getElementById('chart_button').style.display = 'block';
	}
	
</script>