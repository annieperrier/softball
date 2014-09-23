var softballDirectives = angular.module('softballDirectives', []);
//camel cased directive name
//in your HTML, someName will be named as some-name

softballDirectives.directive('chartPie', ['$parse',
	function ($parse) {

	//explicitly creating a directive definition variable
	//this may look verbose but is good for clarification purposes
	//in real life you'd want to simply return the object {...}
	var directiveDefinitionObject = {
		//We restrict its use to an element
		//as usually  <bars-chart> is semantically
		//more understandable
		restrict: 'E',
		//this is important,
		//we don't want to overwrite our directive declaration
		//in the HTML mark-up
		replace: false,
		template: '<canvas></canvas>',
		//our data source would be an array
        //passed thru chart-data attribute
        scope: {data: '=chartData'},
		link: function (scope, element, attrs) {
			scope.$watchCollection('data', function(){
				//console.log('watch seen');
				scope.drawChart(scope.data);
			}, true);

			scope.drawChart = function(data)
			{
				if (!data)
				{
					//console.log("No data for graph yet.");
					return false;
				}
				scope.data = data;

				var w = 200,	//width
				h = 200;		//height

				var options = {
					tooltipFontSize: 12,
					tooltipFontColor: "#000",
					tooltipFillColor: "rgba(255,255,255,0.9)",
					responsive: true
				};
				var canvas  = element.find('canvas')[0];
				canvas.width = w;
				canvas.height = h;

				var ctx = canvas.getContext("2d");
				var myPieChart = new Chart(ctx).Pie(scope.data, options);
			};
		}
	};
	return directiveDefinitionObject;
}]);


softballDirectives.directive('chartBar', ['$parse',
	function ($parse) {

	//explicitly creating a directive definition variable
	//this may look verbose but is good for clarification purposes
	//in real life you'd want to simply return the object {...}
	var directiveDefinitionObject = {
		//We restrict its use to an element
		//as usually  <bars-chart> is semantically
		//more understandable
		restrict: 'E',
		//this is important,
		//we don't want to overwrite our directive declaration
		//in the HTML mark-up
		replace: false,
		template: '<canvas></canvas><div></div>',
		//our data source would be an array
		//passed thru chart-data attribute
		scope: {data: '=chartData'},
		link: function (scope, element, attrs) {
			scope.$watchCollection('data', function(){
				//console.log('watch seen');
				scope.drawChart(scope.data);
			}, true);

			scope.drawChart = function(data)
			{
				if (!data)
				{
					//console.log("No data for graph yet.");
					return false;
				}
				scope.data = data;

				var w = 400,	//width
				h = 150;		//height

				var options = {
					tooltipFontSize: 12,
					tooltipFontColor: "#000",
					tooltipFillColor: "rgba(255,255,255,0.9)",
					tooltipTitleFontColor: "#000",
					tooltipTitleFontStyle: "normal",
					tooltipTitleFontSize: 12,
					barShowStroke: false,

					//String - A legend template
					legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\">"+
									"<% for (var i=0; i<datasets.length; i++){%>"+
									"<li>"+
									"<span style=\"background-color:<%=datasets[i].fillColor%>\"></span>"+
									"<%if(datasets[i].label){%><%=datasets[i].label%><%}%>"+
									"</li>"+
									"<%}%>"+
									"</ul>",

					maintainAspectRatio: false,
					responsive: true
				};
				var canvas  = element.find('canvas')[0];
				canvas.width = w;
				canvas.height = h;

				var ctx = canvas.getContext("2d");
				var myChart = new Chart(ctx).Bar(scope.data, options);
				if (scope.data.datasets.length > 1)
					element.find('div')[0].innerHTML = myChart.generateLegend();
			};
		}
	};

	return directiveDefinitionObject;
}]);


softballDirectives.directive('chartLine', ['$parse',
	function ($parse) {

	//explicitly creating a directive definition variable
	//this may look verbose but is good for clarification purposes
	//in real life you'd want to simply return the object {...}
	var directiveDefinitionObject = {
		//We restrict its use to an element
		//as usually  <bars-chart> is semantically
		//more understandable
		restrict: 'E',
		//this is important,
		//we don't want to overwrite our directive declaration
		//in the HTML mark-up
		replace: false,
		template: '<canvas></canvas><div></div>',
		//our data source would be an array
		//passed thru chart-data attribute
		scope: {data: '=chartData'},
		link: function (scope, element, attrs) {
			scope.$watchCollection('data', function(){
				//console.log('watch seen');
				scope.drawChart(scope.data);
			}, true);

			scope.drawChart = function(data)
			{
				if (!data)
				{
					//console.log("No data for graph yet.");
					return false;
				}
				scope.data = data;

				var w = 400,	//width
				h = 150;		//height

				var options = {
					tooltipFontSize: 12,
					tooltipFontColor: "#000",
					tooltipFillColor: "rgba(255,255,255,0.9)",
					tooltipTitleFontColor: "#000",
					tooltipTitleFontStyle: "normal",
					tooltipTitleFontSize: 12,
					barShowStroke: false,

					//String - A legend template
					legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\">"+
									"<% for (var i=0; i<datasets.length; i++){%>"+
									"<li>"+
									"<span style=\"background-color:<%=datasets[i].fillColor%>\"></span>"+
									"<%if(datasets[i].label){%><%=datasets[i].label%><%}%>"+
									"</li>"+
									"<%}%>"+
									"</ul>",

					maintainAspectRatio: false,
					responsive: true
				};
				var canvas  = element.find('canvas')[0];
				canvas.width = w;
				canvas.height = h;

				var ctx = canvas.getContext("2d");
				var myChart = new Chart(ctx).Line(scope.data, options);
				element.find('div')[0].innerHTML = myChart.generateLegend();
			};
		}
	};

	return directiveDefinitionObject;
}]);
