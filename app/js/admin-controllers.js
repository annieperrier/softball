
softballControllers.controller('AdminCtrl', ['$scope',
	function ($scope) {
}]);

softballControllers.controller('AdminLoginCtrl', ['$scope', '$state', 'Auth', 'Messaging',
	function ($scope, $state, Auth, Messaging) {
		$scope.msg = {};
		$scope.adminemail = null;
		$scope.adminpass = null;

		$scope.login = function(email, pass) {
			console.log('attempted login: ', email, pass);
			Messaging.clearMsg();
			if (!email || !pass)
			{
				Messaging.setMsg('error', 'Please enter a username and password.');
				return false;
			}
			Auth.$authWithPassword({ email: email, password: pass }, {rememberMe: true}).then(function(user) {
				console.log('Login success:', user);
				$state.go('main.admin.games.add');
			}, function(err) {
				console.log('Login error:', err);
				Messaging.setMsg('error', 'Invalid username or password');
			});
		};

		var init = function()
		{
		};
		init();
}]);

softballControllers.controller('AdminGamesCtrl', ['$scope', 'Games',
	function ($scope, Games) {

		// the game object of data to edit
		$scope.gameobj = {};

		// some static data - populate dropdowns
		$scope.static = {};
		// seasons object
		$scope.static.seasons = {};
		// year object with season
		$scope.static.yearseason = {};
		// list of games for the selected year and season
		$scope.static.games = {};

		// the latest defaults to use
		$scope.defaults = {};
		$scope.defaults.season = null;
		$scope.defaults.year = null;
		$scope.defaults.gameObj = null;

		// currently selected game from the list
		$scope.sel = {};
		$scope.sel.year = null;
		$scope.sel.season = null;
		$scope.sel.dateObj = null;

		// set the date string from Date object, zero pad
		$scope.setDateString = function()
		{
			var y = $scope.sel.dateObj.getFullYear();
			var m = ('0' + ($scope.sel.dateObj.getMonth() + 1)).slice(-2);
			var d = ('0' + $scope.sel.dateObj.getDate()).slice(-2);
			$scope.gameobj.date = y+'-'+m+'-'+d;
		};

		$scope.loadSeasons = function()
		{
			// set season
			$scope.static.seasons = Games.getSeasons($scope.nowseason);
			$scope.defaults.season = $scope.static.seasons[$scope.nowseason];
		};

		$scope.loadYears = function()
		{
			// set year
			return Games.getYearSeasons().then(function(data) {
				$scope.static.yearseason = data;
				$scope.defaults.year = $scope.static.yearseason[$scope.nowyear];
			});
		};

		function init()
		{
			console.log('AdminGamesCtrl init');
		}
		init();
}]);

softballControllers.controller('AdminGamesAddCtrl', ['$scope', 'Games', 'Messaging',
	function ($scope, Games, Messaging) {

		$scope.submitAddGame = function()
		{
			console.log('submitAddGame', $scope.gameobj);
			$scope.setDateString();

			$scope.gameobj.season = $scope.sel.season.season;
			$scope.gameobj.year = $scope.sel.year.year;
			$scope.gameobj.gameid = $scope.sel.year.year + '-' + $scope.sel.season.season + '-' + $scope.gameobj.game;

			console.log('submitAddGame final object', $scope.gameobj);
			Games.addGame($scope.gameobj).then(function() {
				Messaging.setMsg('success', 'Game added.');
			}, function() {
				Messaging.setMsg('error', 'Unable to add game.');
			});
		};

		$scope.resetAddGame = function()
		{
			setDefaultValues();
		};

		$scope.loadGames = function(year, season)
		{
			// set new game to last game of current season + 1
			return Games.getGames($scope.nowyear, $scope.nowseason).then(function(data) {
				// find highest game number
				if (data)
				{
					$scope.static.games = data;
					var hg = 0;
					for (var i = 0; i< data.length; i++)
					{
						if (data[i].game > hg)
							hg = data[i].game;
					}
				}
				$scope.gameobj.game = hg + 1;
			});
		};

		function setDefaultValues()
		{
			// set default values for new object
			// set date to now
			$scope.sel.dateObj = $scope.nowdate;
			$scope.gameobj.status = 'played';
			$scope.gameobj.type = 'regular';
			$scope.gameobj.scoreus = 0;
			$scope.gameobj.scorethem = 0;
			$scope.gameobj.result = 'win';

			$scope.loadSeasons();
			$scope.sel.season = $scope.defaults.season;

			$scope.loadYears().then(function() {
				$scope.sel.year = $scope.defaults.year;
			});

			$scope.loadGames();
		}

		function init()
		{
			console.log('AdminGamesAddCtrl init');
			setDefaultValues();
		}
		init();
}]);

softballControllers.controller('AdminGamesEditCtrl', ['$scope', 'Games', 'Messaging',
	function ($scope, Games, Messaging) {

		// currently selected game from the list
		$scope.sel.gameObj = null;

		$scope.submitEditGame = function()
		{
			console.log('submitEditGame gameobj:', $scope.gameobj);
			$scope.setDateString();
			Games.saveGame($scope.gameobj).then(function() {
				Messaging.setMsg('success', 'Game data saved.');
			}, function() {
				Messaging.setMsg('error', 'Unable to save game data.');
			});
		};

		$scope.resetEditGame = function()
		{
			setDefaultValues();
		};

		// change the game being edited
		$scope.changeGameDetails = function()
		{
			console.log('changing games details for:', $scope.sel.gameObj);
			Games.getGame($scope.sel.year.year, $scope.sel.season.season, $scope.sel.gameObj.game).then(function(data) {
				$scope.gameobj = data;
				$scope.sel.dateObj = new Date($scope.gameobj.date);
			});
		};

		// change the list of games
		$scope.changeGames = function()
		{
			console.log('changing games for:', $scope.sel.year.year, $scope.sel.season.season);
			Games.getGames($scope.sel.year.year, $scope.sel.season.season).then(function(data) {
				console.log('New list of games:', data);
				$scope.static.games = data;
				$scope.sel.gameObj = $scope.static.games[$scope.static.games.length-1];
				$scope.changeGameDetails();
			});
		};

		function setDefaultValues()
		{
			$scope.loadSeasons();
			$scope.sel.season = $scope.defaults.season;
			$scope.loadYears().then(function() {
				$scope.sel.year = $scope.defaults.year;
				$scope.changeGames();
			});
		}

		function init()
		{
			console.log('AdminGamesEditCtrl init');
			setDefaultValues();
		}
		init();
}]);

softballControllers.controller('AdminGamesDeleteCtrl', ['$scope', 'Games', 'Messaging',
	function ($scope, Games, Messaging) {

		// currently selected game from the list
		$scope.sel.gameObj = null;

		$scope.submitDeleteGame = function()
		{
			Messaging.setMsg('confirm', 'Delete game?', true, function() {
				console.log('submitDeleteGame true');
				Games.deleteGame($scope.sel.year.year, $scope.sel.season.season, $scope.sel.gameObj.game).then(function() {
					Messaging.setMsg('success', 'Game deleted.');
					$scope.changeGames();
				}, function() {
					Messaging.setMsg('error', 'Unable to delete game.');
				});
			}, function() {
				console.log('submitDeleteGame false');
			});
		};

		// change the game being edited
		$scope.changeGameDetails = function()
		{
			console.log('changing games details for:', $scope.sel.gameObj);
			Games.getGame($scope.sel.year.year, $scope.sel.season.season, $scope.sel.gameObj.game).then(function(data) {
				$scope.gameobj = data;
				$scope.sel.dateObj = new Date($scope.gameobj.date);
			});
		};

		// change the list of games
		$scope.changeGames = function()
		{
			console.log('changing games for:', $scope.sel.year.year, $scope.sel.season.season);
			Games.getGames($scope.sel.year.year, $scope.sel.season.season).then(function(data) {
				console.log('New list of games:', data);
				$scope.static.games = data;
				$scope.sel.gameObj = $scope.static.games[$scope.static.games.length-1];
				$scope.changeGameDetails();
			});
		};

		function setDefaultValues()
		{
			$scope.loadSeasons();
			$scope.sel.season = $scope.defaults.season;
			$scope.loadYears().then(function() {
				$scope.sel.year = $scope.defaults.year;
				$scope.changeGames();
			});
		}

		function init()
		{
			console.log('AdminGamesDeleteCtrl init');
			setDefaultValues();
		}
		init();
}]);

