//Model.News
define([
    "admin/models/model-list",
    "admin/models/model-language",
    "admin/collections/collection-list"
], function(
    ModelList,
    ModelLanguage,
    CollectionList
) {

    return ModelList.extend({

        urlRoot: 'api/languages',

        initialize: function() {
            this.attributes.data = new CollectionList([], {
                model: ModelLanguage,
                url: this.urlRoot
            });
        }

    });

});