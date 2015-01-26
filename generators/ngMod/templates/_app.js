angular.module('<%= modName %>', [<%= depStr %>])
	.run(function () {
		console.log('<%= modName %> initialized');
	});
