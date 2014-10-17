var softballApp = angular.module('softballApp', [
	'ui.router', 
	'softballConfig', 
	'softballControllers', 
	'softballFilters', 
	'softballServices', 
	'softballDirectives'
	]);

softballApp.config(['$stateProvider', '$urlRouterProvider', 
	function($stateProvider, $urlRouterProvider) {
		// Now set up the states
		$stateProvider

			// MAIN //////////////////////////////////////////////////////

			.state('main', {
				abstract: true,
				url: "",
				views: {
					'': {
						template: '<div ui-view></div>'
					},
					// load nav menu in top level parent
					'navmenu@': {
						templateUrl: 'navmenu.html',
						controller: 'GameListCtrl'
					}
				}
			})

			.state('main.info', {
				url: "/info",
				views: {
					'': {
						templateUrl: 'info.html'
					}
				}
			})

			// DASHBOARD //////////////////////////////////////////////////////

			.state('main.dashboard', {
				abstract: true,
				url: "/dashboard",
				templateUrl: 'main.filter.html'
			})

			.state('main.dashboard.team', {
				url: "/team?year&season&showsub",
				views: {
					'': {
						templateUrl: 'dashboard.team.html',
						controller: 'DashboardTeamCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.yearseasonsub.html',
						controller: 'FilterYearSeasonCtrl'
					}
				}
			})
			.state('main.dashboard.games', {
				url: "/games?year&season",
				views: {
					'': {
						templateUrl: 'dashboard.games.html',
						controller: 'DashboardGamesCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.yearseason.html',
						controller: 'FilterYearSeasonCtrl'
					}
				}
			})
			.state('main.dashboard.player', {
				url: "/player?year&season",
				views: {
					'': {
						templateUrl: 'dashboard.player.html',
						controller: 'DashboardPlayerCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.yearseason.html',
						controller: 'FilterYearSeasonCtrl'
					}
				}
			})

			// BATTING ////////////////////////////////////////////////////////

			.state('main.batting', {
				abstract: true,
				url: "/batting",
				templateUrl: 'main.filter.html'
			})

			.state('main.batting.team', {
				url: "/team?year&season&showsub",
				views: {
					'': {
						templateUrl: 'batting.team.html',
						controller: 'BattingTeamCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.yearseasonsub.html',
						controller: 'FilterYearSeasonCtrl'
					}
				}
			})
			.state('main.batting.game', {
				url: "/game?gameid",
				views: {
					'': {
						templateUrl: 'batting.game.html',
						controller: 'BattingGameCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.games.html'
					}
				}
			})
			.state('main.batting.player', {
				url: "/player?name&year&season",
				views: {
					'': {
						templateUrl: 'batting.player.html',
						controller: 'BattingPlayerCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.players.html'
					}
				}
			})

			// FIELDING ////////////////////////////////////////////////////////

			.state('main.fielding', {
				abstract: true,
				url: "/fielding",
				templateUrl: 'main.filter.html'
			})

			.state('main.fielding.team', {
				url: "/team?year&season&showsub",
				views: {
					'': {
						templateUrl: 'fielding.team.html',
						controller: 'FieldingTeamCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.yearseasonsub.html',
						controller: 'FilterYearSeasonCtrl'
					}
				}
			})
			.state('main.fielding.game', {
				url: "/game?gameid&showsub",
				views: {
					'': {
						templateUrl: 'fielding.game.html',
						controller: 'FieldingGameCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.games.html'
					}
				}
			})
			.state('main.fielding.player', {
				url: "/player?name&year&season",
				views: {
					'': {
						templateUrl: 'fielding.player.html',
						controller: 'FieldingPlayerCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.players.html'
					}
				}
			})

			;

		// route to root if no valid route found
		$urlRouterProvider
			.when('/batting', '/batting/team')
			.when('/fielding', '/fielding/team')
			.when('/dashboard', '/dashboard/team')

			// go to the current year and season dashboard
			.otherwise(function($injector, $location){
				var d = new Date();
				var y = d.getFullYear();
				// get the season 1-4 winter-fall
				// only allow 2-3
				var s = Math.ceil((d.getMonth()+1) / 3);
				// late in the year, show last season
				if (s > 3)
					s = 3;
				// early in the year, show last season of last year
				else if (s < 2)
				{
					s = 3;
					y--;
				}
				return '/dashboard/games?year='+y+'&season='+s;
			});

}]);


softballApp.run(function($rootScope, $state) {
	// have the ui.router state available for setting active tabs for parents
	// ng-class="{active:$state.includes('season.dashboard')}"
	$rootScope.$state = $state;
	//console.log($state);
});
