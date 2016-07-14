//Model.News
define([
    "admin/models/model-list",
    "admin/models/model-word",
    "admin/collections/collection-list"
], function(
    ModelList,
    ModelWord,
    CollectionList
) {

    return ModelList.extend({
    
        urlRoot: 'api/words',

        initialize: function() {
            this.attributes.data = new CollectionList([], {
                model: ModelWord,
                url: this.urlRoot
            });
        }

    });

});