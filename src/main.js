var ReactMixin = require("./react-mixin");

var Store = function(key){
  var options = {};
  options.key = key;

  options.get = function(){
    return Store.db.get(this.key);
  }

  options.set = function(value){
    return Store.db.set(this.key, value);
  }

  options.onChange = function(callback){
    Store.db.callbacks[this.key] = Store.db.callbacks[this.key] || [];
    Store.db.callbacks[this.key].push(callback);

    return this;
  }

  options.detach = function(callback){
    var id = Store.db.callbacks[this.key].indexOf(callback);
    Store.db.callbacks[this.key].splice(0, id + 1);

    return this;
  }

  options.remember = function(){
    Store.db.persistent.push(this.key)
    var data = Store.permanent.getItem(Store.storageKey);
    if(data && data.length != ""){
      Store.db.data[this.key] = JSON.parse(data)[this.key];
    }

    return this;
  }

  options.forget = function(){
    var id = Store.db.persistent.indexOf(this.key);
    Store.db.persistent.splice(0, id + 1);

    Store.db.persist()

    return this;
  }

  options.was = function(){
      return Store.db.dataWas[this.key];
  }

  options.trigger = function(value){
    Store.db.trigger(this.key, value);
  }

  return options;
}

Store.db = {
  get: function(key){
    return this.data[key];
  },

  set: function(key, value){
    this.dataWas[key] = this.data[key];
    this.data[key] = value;

    if(!this.dataWas[key] || this.dataWas[key] != this.data[key]){
      Store.db.persist(key, value)
    }

    return this.data[key];
  },

  persist: function(key, value){
    var rememberedData = {};

    this.trigger(key, value);

    Store.db.persistent.forEach(function(key){
      rememberedData[key] = Store.db.data[key];
    })

    var rememberedDataJSON = JSON.stringify(rememberedData);

    Store.permanent.setItem(Store.storageKey, rememberedDataJSON);

    return this;
  },

  trigger: function(key, value){
    (Store.db.callbacks[key] || []).forEach(function(callback){
      callback.bind(Store(key))(value);
    });
  }
}

Store.db.callbacks = {};
Store.db.data = {};
Store.db.dataWas = {};
Store.db.persistent = [];

Store.initialize = function(){
  Store.db.callbacks = {};
  Store.db.data = {};
  Store.db.dataWas = {};
  Store.db.persistent = [];

  Store.permanent = window.sessionStorage;

  return this;
}
Store.initialize()
Store.ReactMixin = ReactMixin;
if(typeof module != "undefined" && module.exports){
  module.exports = Store;
}else{
  window.Store = Store;
}
