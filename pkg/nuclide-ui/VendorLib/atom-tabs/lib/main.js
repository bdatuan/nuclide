// Generated by CoffeeScript 1.12.2
(function() {
  var Disposable, FileIcons, layout;

  Disposable = require('atom').Disposable;

  FileIcons = require('./file-icons');

  layout = require('./layout');

  module.exports = {
    activate: function(state) {
      var MRUListView, TabBarView, _, base, configKey, keyBindSource;
      layout.activate();
      this.tabBarViews = [];
      this.mruListViews = [];
      TabBarView = require('./tab-bar-view');
      MRUListView = require('./mru-list-view');
      _ = require('underscore-plus');
      keyBindSource = 'tabs package';
      configKey = 'tabs.enableMruTabSwitching';
      this.updateTraversalKeybinds = function() {
        var bindings, disabledBindings;
        bindings = atom.keymaps.findKeyBindings({
          target: document.body,
          keystrokes: 'ctrl-tab'
        });
        if (bindings.length > 1 && bindings[0].source !== keyBindSource) {
          return;
        }
        bindings = atom.keymaps.findKeyBindings({
          target: document.body,
          keystrokes: 'ctrl-shift-tab'
        });
        if (bindings.length > 1 && bindings[0].source !== keyBindSource) {
          return;
        }
        if (atom.config.get(configKey)) {
          return atom.keymaps.removeBindingsFromSource(keyBindSource);
        } else {
          disabledBindings = {
            'body': {
              'ctrl-tab': 'pane:show-next-item',
              'ctrl-tab ^ctrl': 'unset!',
              'ctrl-shift-tab': 'pane:show-previous-item',
              'ctrl-shift-tab ^ctrl': 'unset!'
            }
          };
          return atom.keymaps.add(keyBindSource, disabledBindings, 0);
        }
      };
      atom.config.observe(configKey, (function(_this) {
        return function() {
          return _this.updateTraversalKeybinds();
        };
      })(this));
      if (typeof (base = atom.keymaps).onDidLoadUserKeymap === "function") {
        base.onDidLoadUserKeymap((function(_this) {
          return function() {
            return _this.updateTraversalKeybinds();
          };
        })(this));
      }
      atom.commands.add('atom-workspace', {
        'tabs:close-all-tabs': (function(_this) {
          return function() {
            var i, ref, results, tabBarView;
            ref = _this.tabBarViews;
            results = [];
            for (i = ref.length - 1; i >= 0; i += -1) {
              tabBarView = ref[i];
              results.push(tabBarView.closeAllTabs());
            }
            return results;
          };
        })(this)
      });
      return this.paneSubscription = atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var mruListView, paneElement, tabBarView;
          tabBarView = new TabBarView(pane);
          mruListView = new MRUListView;
          mruListView.initialize(pane);
          paneElement = atom.views.getView(pane);
          paneElement.insertBefore(tabBarView.element, paneElement.firstChild);
          _this.tabBarViews.push(tabBarView);
          pane.onDidDestroy(function() {
            return _.remove(_this.tabBarViews, tabBarView);
          });
          _this.mruListViews.push(mruListView);
          return pane.onDidDestroy(function() {
            return _.remove(_this.mruListViews, mruListView);
          });
        };
      })(this));
    },
    deactivate: function() {
      var i, j, len, len1, mruListView, ref, ref1, ref2, tabBarView;
      layout.deactivate();
      this.paneSubscription.dispose();
      if ((ref = this.fileIconsDisposable) != null) {
        ref.dispose();
      }
      ref1 = this.tabBarViews;
      for (i = 0, len = ref1.length; i < len; i++) {
        tabBarView = ref1[i];
        tabBarView.destroy();
      }
      ref2 = this.mruListViews;
      for (j = 0, len1 = ref2.length; j < len1; j++) {
        mruListView = ref2[j];
        mruListView.destroy();
      }
    },
    consumeFileIcons: function(service) {
      FileIcons.setService(service);
      this.updateFileIcons();
      return new Disposable((function(_this) {
        return function() {
          FileIcons.resetService();
          return _this.updateFileIcons();
        };
      })(this));
    },
    updateFileIcons: function() {
      var i, len, ref, results, tabBarView, tabView;
      ref = this.tabBarViews;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        tabBarView = ref[i];
        results.push((function() {
          var j, len1, ref1, results1;
          ref1 = tabBarView.getTabs();
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            tabView = ref1[j];
            results1.push(tabView.updateIcon());
          }
          return results1;
        })());
      }
      return results;
    }
  };

}).call(this);
