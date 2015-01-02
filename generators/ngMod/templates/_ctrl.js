angular.module('<%= modName %>.ctrl', [])
	.controller('<%= modName %>Ctrl', function ($scope) {
		$scope.test = {
			message: "Hello world!"
		};
	})
	.run(function () {

	});
