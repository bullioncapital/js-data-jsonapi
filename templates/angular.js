(function(){
	angular
	    .module('js-data')
        .provider('DSJsonApiAdapator', DSJsonApiAdapatorProvider)
        .run(['DS', 'DSJsonApiAdapator', function(DS, DSJsonApiAdapator){
            DS.registerAdapter('jsonApi', DSJsonApiAdapator);
        }]);

    var DSJsonApiAdapter = require('../js-data-jsonapi');

    function DSJsonApiAdapatorProvider(){
        var defaults = {};
        this.defaults = defaults;

        this.$get = ['DS', function(DS){
            var adapter = new DSJsonApiAdapter(defaults);
            DS.registerAdapter('jsonApi', adapter);
            return adapter;
        }];
    }

}());
