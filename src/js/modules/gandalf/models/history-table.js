angular.module('ng-gandalf').factory('DecisionHistoryTable', function ($gandalf, DecisionTable, DecisionHistoryRule) {

  function DecisionHistoryTable () {
    this.decision = null;
    this.request = null;
    this.createdAt = null;
    this.updatedAt = null;

    DecisionTable.apply(this, arguments);
  }
  DecisionHistoryTable.prototype = Object.create(DecisionTable.prototype, {
    _modelRule: {
      value: DecisionHistoryRule
    }
  });
  DecisionHistoryTable.prototype.constructor = DecisionHistoryTable;

  DecisionHistoryTable.prototype.parse = function (data) {

    DecisionTable.prototype.parse.call(this, data);
    console.log('parse');

    this.decision = data.final_decision;
    this.request = data.request;
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);

    return this;
  };

  DecisionHistoryTable.prototype.fetch = function () {
    console.log('fetch');
    return $gandalf.historyById(this.id).then(function (resp) {
      return this.parse(resp.data);
    }.bind(this));
  };


  DecisionHistoryTable.prototype.toJSON = function () {
    var res = DecisionTable.prototype.toJSON.call(this);
    res.final_decision = this.decision;
    res.request = this.request;
    res.created_at = this.createdAt;
    res.updated_at = this.updatedAt;

    return res;
  };

  DecisionHistoryTable.find = function (tableId, size, page) {
    var self = this;
    return $gandalf.history(tableId, size, page).then(function (resp) {
      resp.data = resp.data.map(function (item) {
        return new self(item._id, item);
      });
      return resp;
    });
  };

  return DecisionHistoryTable;

});
