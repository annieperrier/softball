var softballConfig = angular.module('softballConfig', []);

softballConfig.constant('CONFIG', {
		'BASE_URL': 'https://terrorbytes.firebaseio.com/dev/',
		'COLORS': {
			'B1': {
				'color': '#5cb85c',
				'highlight': '#449d44'
			},
			'B2': {
				'color': '#f0ad4e',
				'highlight': '#ec971f'
			},
			'B3': {
				'color': '#5bc0de',
				'highlight': '#31b0d5'
			},
			'HR': {
				'color': '#428bca',
				'highlight': '#3071a9'
			},
			'win': {
				'color': '#5cb85c',
				'highlight': '#449d44'
			},
			'lose': {
				'color': '#d9534f',
				'highlight': '#c9302c'
			},
			'tie': {
				'color': '#f0ad4e',
				'highlight': '#ec971f'
			},
			'new': {
				'color': '#5bc0de',
				'highlight': '#31b0d5'
			}
		}
	}
);