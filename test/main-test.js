var assert = require('assert');
var MockBrowser = require('mock-browser').mocks.MockBrowser

var mock = new MockBrowser()
window = mock.getWindow()
global.window = window
global.location = window.location
global.document = window.document
global.navigator = window.navigator

var Store = require("../index")

describe('Main', function() {
  describe('Store', function() {

    it('set', function() {
      Store.initialize();

      var setTest = Store("set.test");
      setTest.set("set test variable")
      assert.equal(Store.db.data[setTest.key], "set test variable");
    });

    it('get', function() {
      Store.initialize();

      var getTest = Store("get.test");
      Store.db.data[getTest.key] = "get test variable";

      assert.equal(getTest.get(), "get test variable");
    });

    it('onChange', function() {
      Store.initialize();

      var onChangeTest = Store("onChange.test");
      var testValue = ""
      onChangeTest.onChange(function(){
        testValue = this.get();
      })
      onChangeTest.set("change test variable")

      assert.equal(testValue, "change test variable");
    });

    it('detach', function() {
      Store.initialize();

      var onForgetTest = Store("onForget.test");
      var testValue = ""
      testOnForgetFunction = function(){
        testValue = this.get();
      }

      onForgetTest.onChange(testOnForgetFunction);
      onForgetTest.set("change test variable")

      assert.equal(testValue, "change test variable");

      onForgetTest.detach(testOnForgetFunction)

      onForgetTest.set("change test variable 2")

      assert.equal(testValue, "change test variable");

      assert.equal(onForgetTest.get(), "change test variable 2")
    });

    it('trigger', function() {
      Store.initialize();

      var onChangeTest = Store("onChange.test");
      var testValue = ""

      onChangeTest.onChange(function(data){
        testValue = data;
      })

      onChangeTest.trigger("change test variable");

      assert.equal(testValue, "change test variable");
    });

    it('remember', function() {
      Store.initialize();

      var rememberTest = Store("remember.test");

      rememberTest.remember();
      rememberTest.set("remember test");

      assert.equal(Store.permanent.getItem(Store.storageKey), "{\"remember.test\":\"remember test\"}");

      Store.db.data["remember.test"] = "";

      assert.equal(rememberTest.get(), "");

      rememberTest.remember();

      assert.equal(rememberTest.get(), "remember test");
    });

    it('forget', function() {
      Store.initialize();

      var forgetTest = Store("forget.test");

      forgetTest.remember()
      forgetTest.set("forget test")

      assert.equal(forgetTest.get(), "forget test")

      Store.db.data["forget.test"] = ""

      assert.equal(forgetTest.get(), "")

      forgetTest.forget()

      assert.equal(Store.permanent.getItem(Store.storageKey), "{}")
    });

    it('ReactMixin', function() {
      Store.initialize();

      var mixinKeys = Object.keys(Store.ReactMixin);
      var expected = '["getInitialState","componentDidMount","componentWillUnmount","followChange","setStores"]'

      assert.equal(JSON.stringify(mixinKeys), expected)
    });
  });
});
