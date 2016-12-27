var Store = require("./src/main");

if(typeof module != "undefined" && module.exports){
  module.exports = Store;
}else{
  window.Store = Store;
}
