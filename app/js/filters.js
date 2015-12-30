var softballFilters = angular.module('softballFilters', []);

/**
* Calculate the total of a specific field of an array of items.
*/
softballFilters.filter("total", [
	function() {
		return function(items, field) {
			var total = 0, i = 0;
			if (!items)
				return 0;
			for (i = 0; i < items.length; i++)
			{
				total += parseFloat(items[i][field] ? items[i][field] : 0);
			}
			return total;
		};
}]);

softballFilters.filter("toFixed", [
	function() {
		return function(item, precision) {
			if (item)
				return item.toFixed(precision);
			return 0;
		};
}]);

softballFilters.filter("avg", [
	function() {
		return function(a, b, precision) {
			if (!precision)
				precision = 0;
			//console.log("Avg of: "+a+" over: "+b+" to precision: "+precision)
			return ((a ? a : 0) / (b ? b : 1)).toFixed(precision);
		};
}]);
softballFilters.filter("avgSum", ['totalFilter', 'avgFilter',
	function(totalFilter, avgFilter) {
		return function(items, field1, field2, precision) {
			var a = totalFilter(items, field1);
			var b = totalFilter(items, field2);
			return avgFilter(a, b, precision);
		};
}]);

softballFilters.filter("slug", [
	function() {
		return function(b1, b2, b3, hr, ab, precision) {
			return (((b1 ? b1 : 0) + ((b2 ? b2 : 0)*2) +
				((b3 ? b3 : 0)*3) + ((hr ? hr : 0)*4))/
				(ab ? ab : 1))
				.toFixed(precision);
		};
}]);

softballFilters.filter("slugSum", ['totalFilter', 'slugFilter',
	function(totalFilter, slugFilter) {
		return function(items, b1, b2, b3, hr, ab, precision) {
			var tb1 = totalFilter(items, b1);
			var tb2 = totalFilter(items, b2);
			var tb3 = totalFilter(items, b3);
			var thr = totalFilter(items, hr);
			var tab = totalFilter(items, ab);
			return slugFilter(tb1, tb2, tb3, thr, tab, precision);
		};
}]);

softballFilters.filter("xfactor", [
	function() {
		return function(b1, b2, b3, hr, r, rbi) {
			return (((b1 ? b1 : 0) + ((b2 ? b2 : 0)*2) +
				((b3 ? b3 : 0)*3) + ((hr ? hr : 0)*4) +
				(r ? r : 0) + (rbi ? rbi : 0)));
		};
}]);
softballFilters.filter("xfactorSum", ['totalFilter', 'xfactorFilter',
	function(totalFilter, xfactorFilter) {
		return function(items, b1, b2, b3, hr, r, rbi, precision) {
			var tb1 = totalFilter(items, b1);
			var tb2 = totalFilter(items, b2);
			var tb3 = totalFilter(items, b3);
			var thr = totalFilter(items, hr);
			var tr = totalFilter(items, r);
			var trbi = totalFilter(items, rbi);
			return xfactorFilter(tb1, tb2, tb3, thr, tr, trbi, precision);
		};
}]);

softballFilters.filter("avgOfTotals", ['totalFilter', 'avgFilter',
	function(totalFilter, avgFilter) {
		return function(items, field, precision) {
			var a = totalFilter(items, field);
			var cnt = items.length;
			return avgFilter(a, cnt, precision);
		};
}]);

softballFilters.filter("yearSeasonDisplay", [
	function() {
		return function(year, season) {
			var res = '';
			if (year)
				res += year;
			if (season)
			{
				if (year)
					res += ' ';

				switch(season)
				{
					case 1:
						res += 'Winter';
						break;
					case 2:
						res += 'Spring';
						break;
					case 3: 
						res += 'Summer';
						break;
					case 4:
						res += 'Fall';
						break;
				}
			}
			return res;
		};
}]);

softballFilters.filter("yearSeasonGameDisplay", ['yearSeasonDisplayFilter', 
	function(yearSeasonDisplayFilter) {
		return function(year, season, game) {
			var res = yearSeasonDisplayFilter(year, season);
			if (res)
				res += ' ';
			if (game)
				res += ' Game #'+game;
			return res;
		};
}]);

softballFilters.filter("gameDisplayName", ['yearSeasonDisplayFilter', 
	function(yearSeasonDisplayFilter) {
		return function(gameObj) {
			var res = yearSeasonDisplayFilter(gameObj.year, gameObj.season);
			if (res)
				res += ' ';
			if (gameObj.game)
				res += ' Game #'+gameObj.game;
			return res;
		};
}]);

softballFilters.filter("seasonIcon", [
	function() {
		return function(season) {
			var t;
			switch (season)
			{
				case 1:
					t = "asterisk";
					break;
				case 2:
					t = "tree";
					break;
				case 3:
					t = "sun-o";
					break;
				case 4:
					t = "leaf";
					break;
			}
			return t;
		};
}]);
softballFilters.filter("seasonName", [
	function() {
		return function(season) {
			var t;
			switch (season)
			{
				case 1:
					t = "Winter";
					break;
				case 2:
					t = "Spring";
					break;
				case 3:
					t = "Summer";
					break;
				case 4:
					t = "Fall";
					break;
			}
			return t;
		};
}]);

softballFilters.filter("gameTypeName", [
	function() {
		return function(status) {
			var t = "";
			switch (status)
			{
				case 'rescheduled':
					t = "Rescheduled";
					break;
				case 'regular':
					t = "Regular";
					break;
				case 'playoff1':
					t = "Playoff Semi";
					break;
				case 'playoff2':
					t = "Playoff Final";
					break;
			}
			return t;
		};
}]);

softballFilters.filter("gameStatusName", [
	function() {
		return function(status) {
			var t = "";
			switch (status)
			{
				case 'default':
					t = "Default";
					break;
				case 'new':
					t = "New";
					break;
				case 'played':
					t = "Played";
					break;
				case 'rainedout':
					t = "Rained Out";
					break;
			}
			return t;
		};
}]);
softballFilters.filter("gameStatusDescription", [
	function() {
		return function(status) {
			var t = "";
			switch (status)
			{
				case 'played':
					t = "This game was played.";
					break;
				case 'new':
					t = "This game is new.";
					break;
				case 'default':
					t = "This game was defaulted.";
					break;
				case 'rainedout':
					t = "This game was rained out.";
					break;
			}
			return t;
		};
}]);

softballFilters.filter("gameResultDisplay", [
	function() {
		return function(result) {
			var t = "";
			switch (result)
			{
				case 'win':
					t = "Win";
					break;
				case 'lose':
					t = "Lose";
					break;
				case 'defaultus':
					t = "Lose by Default";
					break;
				case 'defaultthem':
					t = "Win by Default";
					break;
				case 'tie':
					t = "Tie";
					break;
			}
			return t;
		};
}]);

softballFilters.filter("gameIdExplode", [
	function() {
		return function(gameid) {
			var res = {};
			if (gameid)
			{
				var g = gameid.split('-');
				res.year = g[0];
				res.season = g[1];
				res.game = g[2];
			}
			return res;
		};
}]);

softballFilters.filter("baseDisplay", [
	function() {
		return function(base) {
			var t;
			switch (base)
			{
				case 'B1':
					t = "1B";
					break;
				case 'B2':
					t = "2B";
					break;
				case 'B3':
					t = "3B";
					break;
				case 'HR':
					t = "HR";
					break;
				default:
					t = base;
					break;
			}
			return t;
		};
}]);

softballFilters.filter("firstLetterToUppercase", [
	function() {
		return function(val) {
			res = val.charAt(0).toUpperCase()+val.slice(1);
			return res;
		};
}]);
