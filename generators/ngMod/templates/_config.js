angular.module('<%= modName %>')
	.config(function ($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('<%= modName %>', {
				abstract: true
			})
			.state('<%= modName %>.index', {
				url: '/<%= modURL %>',
				views: {
					'nav@': {
						template: ''
					},
					'content@': {
						templateUrl: '<%= modName %>.index.html',
						controller: '<%= modName %>Ctrl'
					}
				}
			})
	});
