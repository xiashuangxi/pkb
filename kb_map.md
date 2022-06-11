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
</style>
<textarea id="namespace" style='display:none'> {{namespace}} </textarea>
<div style="display: flex;flex-flow: row;align-items: center;">
	<div class="in_l">内联</div>
	<div class="out_l">外联</div>
	<input type="checkbox" style="margin-right: 2px">显示外联
</div>

<svg id="svg" style='width: 100%; height: 550px; border: 1px solid;'></svg>
<script src="{{namespace}}/assets/scripts/lib/d3.v7.min.js"></script>
<!-- <script src="{{namespace}}/assets/scripts/lib/d3.v4.min.js"></script> -->
<!-- <script src="https://d3js.org/d3.v4.min.js"></script> -->
<script>
	var svg;
	var color = [];
	var simulation;
	var height = document.getElementById('svg').clientHeight;
	var width = document.getElementById('svg').clientWidth;
	var links = [];
	var nodes = [];
	var data = [];

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

  	// invalidation.then(() => simulation.stop());

  	return svg.node();
	}

	// function dragstarted(d) {
	// 	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	// 	d.fx = d.x;
	// 	d.fy = d.y;
	// }

	// function dragged( d){
	// 	d.fx = d3.event.x;
	// 	d.fy = d3.event.y;
	// }

	// function dragended( d){
	// 	if (!d3.event.active) simulation.alphaTarget(0);
	// 	d.fx = null;
	// 	d.fy = null;
	// }

	// function init_canvas(){
	// 	svg = d3.select('svg');

	// 	color = d3.scaleOrdinal(types, d3.schemeCategory10);

	// 	simulation = d3.forceSimulation()
	// 	.force('link', d3.forceLink().id( function(d) { return d.id }))
	// 	.force('charge', d3.forceManyBody().strength(-500))
	// 	.force('center', d3.forceCenter(width / 2, height / 2));
	// }

	// function chart() {
	// 	  	var link = svg.append("g")
	// 	      .attr("class", "links")
	// 	      // .attr("stroke-width",3.5)
	// 	    .selectAll("line")
	// 	    .data(links)
	// 	    .enter().append("line")
	// 	      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });


 //  	    var node = svg.append("g")
 //      		.attr("fill", "currentColor")//currentColor
 //      		.attr("stroke-linecap", "round")
 //      		.attr("stroke-linejoin", "round")
 //    		.selectAll("g")
 //    		.data(nodes)
 //    		.enter()
 //    		.append("g");

 //      	node.append("circle")
	//      	.attr("stroke", "white")
	//      	.attr("stroke-width", 1.5)
	//      	.attr("r", 4); // 4

 //      	node.append("text")
	//     	.attr("x", 8)//8
	//      	.attr("y", "0.31em")//0.31em
	//      	.text(function(d) { return d.id })
	//     	.clone(true).lower()
	//       	.attr("fill", "none")
	//       	.attr("stroke", "white")
	//       	.attr("stroke-width", 3);//3

	//     var drag_handler = d3.drag()
	//     	.on("start", dragstarted)
 //      		.on("drag", dragged)
 //      		.on("end", dragended);

 //      	drag_handler(node)

 //      	simulation.nodes(nodes)
 //      		.on("tick", ticked);

 //  		simulation.force("link")
 //  			.links(links);

	// 	var linkArc = function(d) {
	// 		var r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
	// 		return `
	// 		    M${d.source.x},${d.source.y}
	// 		    A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
	// 		  `;
	// 	}

 //  		function ticked() {
	// 			link.attr("d", linkArc);
 //    		link
 //        		.attr("x1", function(d) { return d.source.x; })
 //        		.attr("y1", function(d) { return d.source.y; })
 //        		.attr("x2", function(d) { return d.target.x; })
 //        		.attr("y2", function(d) { return d.target.y; });
 //    		node
 //        		.attr("transform", function(d) {
 //          		return "translate(" + d.x + "," + d.y + ")";
 //        		})
 //  		}
	// }

// 	d3.select(window).on("resize", function(){
		
// simulation.alphaTarget(0.3).restart()
// 	});
	function load_data(){
		var namespace = document.getElementById('namespace').value.trim();
	  	var url = "https://xiashuangxi.github.io/pkb/feed.xml?rn="+Date.now();
	  	var linkreg=/"(\/pkb\/.+)"/;
	  	if(namespace.length == 0){
	  		linkreg = /"(\/.+)"/
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
	  				// var m = content.match(/"(\/pkb\/.+)"/);
	  				var m = content.match(linkreg);
	  				console.log(linkreg)
	  				if(m) {
	  					var ref = m[1];
	  					var m1 = ref.match(/(?<=Title:).+/)
	  					console.log(content)
	  					console.log(ref)
	  					if(m1){
								for (var j = nodes.length - 1; j >= 0; j--) {
									var n = nodes[j];
									if(m1[0] == n.id) {
										links.push({
											source: title,
											target: m1[0],
											// 站内链接 resolved ， 站外链接 suit
											type: 'suit' //"licensing", "suit", "resolved"
										})
									}
								}
	  					}
	  				}
	  				// console.log("title:"+title)
						nodes.push({id: title,link: url});
	  			}
	  			chart()
	  		}
	  	})
	}

	window.onload = function(){
		// init_canvas();
		// chart()
		load_data();
	}
</script>
