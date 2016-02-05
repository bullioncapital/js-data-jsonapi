var DSHttpAdapter = require('js-data-http')

function DSJsonApiAdapter (options) {
  var defaultOptions = {
    serialize: DSJsonApiAdapter.serialize,
    deserialize: DSJsonApiAdapter.deserialize,
    queryTransform: DSJsonApiAdapter.queryTransform
  }

  options = _.extend({}, defaultOptions, options)

  this.defaults = options
  this.http = new DSHttpAdapter(options)
}

/*	==========================================================================
	 Prototype Methods
	========================================================================== */
DSJsonApiAdapter.prototype.create = function (definition, attrs, options) {
  return this.http.create(definition, attrs, options)
}

DSJsonApiAdapter.prototype.find = function (definition, id, options) {
  return this.http.find(definition, id, options)
}

DSJsonApiAdapter.prototype.findAll = function (definition, params, options) {
  return this.http.findAll(definition, params, options)
}

DSJsonApiAdapter.prototype.update = function (definition, id, attrs, options) {
  options.method = 'PATCH'
  return this.http.update(definition, id, attrs, options)
}

DSJsonApiAdapter.prototype.updateAll = function (definition, attrs, params, options) {
  return this.http.updateAll(definition, attrs, params, options)
}

DSJsonApiAdapter.prototype.destroy = function (definition, id, options) {
  return this.http.destroy(definition, id, options)
}

DSJsonApiAdapter.prototype.destroyAll = function (definition, params, options) {
  return this.http.destroyAll(definition, params, options)
}

/*	==========================================================================
	 Static Methods
	========================================================================== */
DSJsonApiAdapter.serialize = function serialize (resourceConfig, data) {
  return {
    data: {
      id: data.id,
      type: resourceConfig.name,
      attributes: _.omit(data, ['id'])
    }
  }
}

DSJsonApiAdapter.deserialize = function (resourceConfig, response) {
  // Add the include data first
  if (_.has(response, 'data.include')) {
    if (!Array.isArray(response.data.include)) {
      response.data.include = [response.data.include]
    }

    response.data.include.map(injectInclude.bind(this, resourceConfig))
  }

  var deserializedData = null

  if (_.has(response, 'data.data')) {
    if (!Array.isArray(response.data.data)) {
      response.data.data = [response.data.data]
    }

    deserializedData = response.data.data.map(deserializeData.bind(this, resourceConfig))
  }

  return deserializedData
}

DSJsonApiAdapter.queryTransform = function (resourceConfig, params) {
  var returnParams = {}

  if (params.offset) _.set(returnParams, 'offset', params.offset)
  if (params.limit) _.set(returnParams, 'limit', params.limit)
  if (params.where) {
    _.forEach(params.where, function (value, key) {
      _.set(returnParams, key, value)
    })
  }

  return returnParams
}

/*	==========================================================================
	 Helper Functions
	========================================================================== */
function deserializeData (resourceConfig, data) {
  if (!data) {
    return
  }

  if (data.relationships) {
    _.forEach(data.relationships, function (value) {
      var relations = [].concat(value.data)

      _.forEach(relations, function (relation) {
        if (!data[ relation.type + 'Ids' ]) {
          data[ relation.type + 'Ids' ] = []
        }

        data[ relation.type + 'Ids' ].push(relation.id)
      })
    })

    delete data.relationships
  }

  // Move the attributes to the top level
  _.extend(data, data.attributes)
  delete data.attributes

  // Remove the type
  delete data.type

  return data
}

function injectInclude (resourceConfig, data) {
  data = deserializeData(data)

  var type = data.type
  delete data.type

  resourceConfig.getResource(type).inject(data)
}

module.exports = DSJsonApiAdapter
