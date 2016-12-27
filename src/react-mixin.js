ReactMixin = {
  getInitialState: function(){
    this.stores = this.stores || {}
    this.setStores();

    var state = {};
    var c = this;
    Object.keys(this.stores).forEach(function(key){
      var store = c.stores[key];
      state[key] = store.get();
    })

    return state;
  },

  componentDidMount: function(){
    var c = this
    Object.keys(this.stores).forEach(function(key){
      var store = c.stores[key];

      callback = function(){
        var state = {};
        state[key] = store.get();

        c.setState(state);
      }

      c.detachables.push(store.onChange(callback))
    })
  },

  componentWillUnmount: function(){
    this.detachables = this.detachables || []
    this.detachables.forEach(function(store){
      store.detach()
    })
  },

  followChange: function(change){
    this.detachables.push(change)
  },

  setStores: function(){
    this.detachables = [];
    var followStores = {}

    if(typeof this.followStores == "function"){
      followStores = this.followStores()
    }else {
      followStores = this.followStores
    }

    if(followStores instanceof Array){
      var fs = followStores;
      followStores = {};
      fs.forEach(function(item){
        if(item instanceof Object) {
          key = Object.keys(item)[0];
          followStores[key] = item[key];
        }else{
          followStores[item] = item;
        }
      })
    }

    var followStores = followStores || {};

    var c = this;

    Object.keys(followStores).forEach(function(key){

      c.stores[key] = Store(followStores[key])
    })
  }
}

if(typeof module != "undefined"){
  module.exports = ReactMixin;
}
