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
</style>
<textarea id="namespace" style='display:none'> {{namespace}} </textarea>
<svg id="svg" style='width: 100%; height: 550px;'></svg>
<!-- <script src="{{namespace}}/assets/scripts/lib/d3.v7.min.js"></script> -->
<script src="{{namespace}}/assets/scripts/lib/d3.v4.min.js"></script>
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

	function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
	}

	function dragged( d){
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}

	function dragended( d){
		if (!d3.event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	}

	function init_canvas(){
		svg = d3.select('svg');

		color = d3.scaleOrdinal(types, d3.schemeCategory10);

		simulation = d3.forceSimulation()
		.force('link', d3.forceLink().id( function(d) { return d.id }))
		.force('charge', d3.forceManyBody())
		.force('center', d3.forceCenter(width / 2, height / 2));
	}

	function chart() {
		  var link = svg.append("g")
		      .attr("class", "links")
		    .selectAll("line")
		    .data(links)
		    .enter().append("line")
		      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });


  	    var node = svg.append("g")
      		.attr("fill", "currentColor")
      		.attr("stroke-linecap", "round")
      		.attr("stroke-linejoin", "round")
    		.selectAll("g")
    		.data(nodes)
    		.enter()
    		.append("g");

      	node.append("circle")
	     	.attr("stroke", "white")
	     	.attr("stroke-width", 1.5)
	     	.attr("r", 4); // 4

      	node.append("text")
	    	.attr("x", 8)//8
	     	.attr("y", "0.31em")//0.31em
	     	.text(function(d) { return d.id })
	    	.clone(true).lower()
	      	.attr("fill", "none")
	      	.attr("stroke", "white")
	      	.attr("stroke-width", 3);//3

	    var drag_handler = d3.drag()
	    	.on("start", dragstarted)
      		.on("drag", dragged)
      		.on("end", dragended);

      	drag_handler(node)

      	simulation.nodes(nodes)
      		.on("tick", ticked);

  		simulation.force("link")
  			.links(links);

		var linkArc = function(d) {
			var r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
			return `
			    M${d.source.x},${d.source.y}
			    A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
			  `;
		}

  		function ticked() {
			link.attr("d", linkArc);
    		link
        		.attr("x1", function(d) { return d.source.x; })
        		.attr("y1", function(d) { return d.source.y; })
        		.attr("x2", function(d) { return d.target.x; })
        		.attr("y2", function(d) { return d.target.y; });

    		node
        		.attr("transform", function(d) {
          			return "translate(" + d.x + "," + d.y + ")";
        		})
  		}
	}

// 	d3.select(window).on("resize", function(){
		
// simulation.alphaTarget(0.3).restart()
// 	});
	function load_data(){
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
	  			chart()
	  		}
	  	})
	}

	window.onload = function(){
		init_canvas();
		load_data();
	}
</script>