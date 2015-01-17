angular.module('<%= modName %>.config', ['ui.router'])
	.config(function ($stateProvider) {

		$stateProvider
			.state('<%= modName %>', {
				abstract: true
			})
			.state('<%= modName %>.<%= modState %>', {
				url: '/<%= modURL %>',
				views: {
					'nav@': {
						template: ''
					},
					'content@': {
						templateUrl: '<%= modName %>.<%= modState %>.html',
						controller: '<%= modName %>Ctrl'
					}
				}
			})
	})
	.run(function () {

	});
