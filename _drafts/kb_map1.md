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
	<input type="checkbox" style="margin-right: 2px" checked>显示外联
</div>
<svg id="svg" style='width: 100%; height: 550px; border: 1px solid;'></svg>
<script src="{{namespace}}/assets/scripts/lib/d3.v7.min.js"></script>
<script>
	
	var chart = function() {
		var svg = d3.select("svg")
		.attr("width", 100)
      .attr("height", 33)
      .attr("viewBox", `0 -20 100 33`);

	  // while (true) {
	  //   svg.selectAll("text")
	  //     .data(randomLetters())
	  //     .join("text")
	  //       .attr("x", (d, i) => i * 16)
	  //       .text(d => d);

	  //   return svg.node();
	  //   await Promises.tick(2500);
	  // }

	  function __chart() {
	  	svg.selectAll("text")
	      .data([Math.floor(Math.random() * 100)])
	      .join("text")
	        .attr("x", (d, i) => i * 16)
	        .text(d => d);

	       console.log("xx")

	    return svg.node();
	  }
	  setInterval(__chart,200);
}

	window.onload = function(){
		chart();
	}
</script>
