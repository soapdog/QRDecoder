/**
 * Lawnchair!
 * --- 
 * clientside json store 
 *
 */
var Lawnchair = function (options, callback) {
    // ensure Lawnchair was called as a constructor
    if (!(this instanceof Lawnchair)) return new Lawnchair(options, callback);

    // lawnchair requires json 
    if (!JSON) throw 'JSON unavailable! Include http://www.json.org/json2.js to fix.'
    // options are optional; callback is not
    if (arguments.length <= 2 && arguments.length > 0) {
        callback = (typeof arguments[0] === 'function') ? arguments[0] : arguments[1];
        options  = (typeof arguments[0] === 'function') ? {} : arguments[0];
    } else {
        throw 'Incorrect # of ctor args!'
    }
    // TODO perhaps allow for pub/sub instead?
    if (typeof callback !== 'function') throw 'No callback was provided';
    
    // default configuration 
    this.record = options.record || 'record'  // default for records
    this.name   = options.name   || 'records' // default name for underlying store
    
    // mixin first valid  adapter
    var adapter
    // if the adapter is passed in we try to load that only
    if (options.adapter) {
        
        // the argument passed should be an array of prefered adapters
        // if it is not, we convert it
        if(typeof(options.adapter) === 'string'){
            options.adapter = [options.adapter];    
        }
            
        // iterates over the array of passed adapters 
        for(var j = 0, k = options.adapter.length; j < k; j++){
            
            // itirates over the array of available adapters
            for (var i = Lawnchair.adapters.length-1; i >= 0; i--) {
                if (Lawnchair.adapters[i].adapter === options.adapter[j]) {
                    adapter = Lawnchair.adapters[i].valid() ? Lawnchair.adapters[i] : undefined;
                    if (adapter) break 
                }
            }
            if (adapter) break
        }
    
    // otherwise find the first valid adapter for this env
    } 
    else {
        for (var i = 0, l = Lawnchair.adapters.length; i < l; i++) {
            adapter = Lawnchair.adapters[i].valid() ? Lawnchair.adapters[i] : undefined
            if (adapter) break 
        }
    } 
    
    // we have failed 
    if (!adapter) throw 'No valid adapter.' 
    
    // yay! mixin the adapter 
    for (var j in adapter)  
        this[j] = adapter[j]
    
    // call init for each mixed in plugin
    for (var i = 0, l = Lawnchair.plugins.length; i < l; i++) 
        Lawnchair.plugins[i].call(this)

    // init the adapter 
    this.init(options, callback)
}

Lawnchair.adapters = [] 

/** 
 * queues an adapter for mixin
 * ===
 * - ensures an adapter conforms to a specific interface
 *
 */
Lawnchair.adapter = function (id, obj) {
    // add the adapter id to the adapter obj
    // ugly here for a  cleaner dsl for implementing adapters
    obj['adapter'] = id
    // methods required to implement a lawnchair adapter 
    var implementing = 'adapter valid init keys save batch get exists all remove nuke'.split(' ')
    ,   indexOf = this.prototype.indexOf
    // mix in the adapter   
    for (var i in obj) {
        if (indexOf(implementing, i) === -1) throw 'Invalid adapter! Nonstandard method: ' + i
    }
    // if we made it this far the adapter interface is valid 
	// insert the new adapter as the preferred adapter
	Lawnchair.adapters.splice(0,0,obj)
}

Lawnchair.plugins = []

/**
 * generic shallow extension for plugins
 * ===
 * - if an init method is found it registers it to be called when the lawnchair is inited 
 * - yes we could use hasOwnProp but nobody here is an asshole
 */ 
Lawnchair.plugin = function (obj) {
    for (var i in obj) 
        i === 'init' ? Lawnchair.plugins.push(obj[i]) : this.prototype[i] = obj[i]
}

/**
 * helpers
 *
 */
Lawnchair.prototype = {

    isArray: Array.isArray || function(o) { return Object.prototype.toString.call(o) === '[object Array]' },
    
    /**
     * this code exists for ie8... for more background see:
     * http://www.flickr.com/photos/westcoastlogic/5955365742/in/photostream
     */
    indexOf: function(ary, item, i, l) {
        if (ary.indexOf) return ary.indexOf(item)
        for (i = 0, l = ary.length; i < l; i++) if (ary[i] === item) return i
        return -1
    },

    // awesome shorthand callbacks as strings. this is shameless theft from dojo.
    lambda: function (callback) {
        return this.fn(this.record, callback)
    },

    // first stab at named parameters for terse callbacks; dojo: first != best // ;D
    fn: function (name, callback) {
        return typeof callback == 'string' ? new Function(name, callback) : callback
    },

    // returns a unique identifier (by way of Backbone.localStorage.js)
    // TODO investigate smaller UUIDs to cut on storage cost
    uuid: function () {
        var S4 = function () {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },

    // a classic iterator
    each: function (callback) {
        var cb = this.lambda(callback)
        // iterate from chain
        if (this.__results) {
            for (var i = 0, l = this.__results.length; i < l; i++) cb.call(this, this.__results[i], i) 
        }  
        // otherwise iterate the entire collection 
        else {
            this.all(function(r) {
                for (var i = 0, l = r.length; i < l; i++) cb.call(this, r[i], i)
            })
        }
        return this
    }
// --
};
/**
 * indexed db adapter
 * === 
 * - originally authored by Vivian Li
 *
 */ 

Lawnchair.adapter('indexed-db', (function(){

  function fail(e, i) { console.error('error in indexed-db adapter!', e, i); }

  var STORE_NAME = 'lawnchair';

  // update the STORE_VERSION when the schema used by this adapter changes
  // (for example, if you change the STORE_NAME above)
  var STORE_VERSION = 2;

  var getIDB = function() {
    return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB;
  };
  var getIDBTransaction = function() {
      return window.IDBTransaction || window.webkitIDBTransaction ||
          window.mozIDBTransaction || window.oIDBTransaction ||
          window.msIDBTransaction;
  };
  var getIDBKeyRange = function() {
      return window.IDBKeyRange || window.webkitIDBKeyRange ||
          window.mozIDBKeyRange || window.oIDBKeyRange ||
          window.msIDBKeyRange;
  };
  var getIDBDatabaseException = function() {
      return window.IDBDatabaseException || window.webkitIDBDatabaseException ||
          window.mozIDBDatabaseException || window.oIDBDatabaseException ||
          window.msIDBDatabaseException;
  };
  var useAutoIncrement = function() {
      // using preliminary mozilla implementation which doesn't support
      // auto-generated keys.  Neither do some webkit implementations.
      return !!window.indexedDB;
  };


  // see https://groups.google.com/a/chromium.org/forum/?fromgroups#!topic/chromium-html5/OhsoAQLj7kc
  var READ_WRITE = (getIDBTransaction() &&
                    'READ_WRITE' in getIDBTransaction()) ?
    getIDBTransaction().READ_WRITE : 'readwrite';

  return {
    
    valid: function() { return !!getIDB(); },
    
    init:function(options, callback) {
        this.idb = getIDB();
        this.waiting = [];
        this.useAutoIncrement = useAutoIncrement();
        var request = this.idb.open(this.name, STORE_VERSION);
        var self = this;
        var cb = self.fn(self.name, callback);
        var win = function() {
            // manually clean up event handlers on request; this helps on chrome
            request.onupgradeneeded = request.onsuccess = request.error = null;
            return cb.call(self, self);
        };
        
        var upgrade = function(from, to) {
            // don't try to migrate dbs, just recreate
            try {
                self.db.deleteObjectStore('teststore'); // old adapter
            } catch (e1) { /* ignore */ }
            try {
                self.db.deleteObjectStore(STORE_NAME);
            } catch (e2) { /* ignore */ }

            // ok, create object store.
            var params = {};
            if (self.useAutoIncrement) { params.autoIncrement = true; }
            self.db.createObjectStore(STORE_NAME, params);
            self.store = true;
        };
        request.onupgradeneeded = function(event) {
            self.db = request.result;
            self.transaction = request.transaction;
            upgrade(event.oldVersion, event.newVersion);
            // will end up in onsuccess callback
        };
        request.onsuccess = function(event) {
           self.db = request.result; 
            
            if(self.db.version != (''+STORE_VERSION)) {
              // DEPRECATED API: modern implementations will fire the
              // upgradeneeded event instead.
              var oldVersion = self.db.version;
              var setVrequest = self.db.setVersion(''+STORE_VERSION);
              // onsuccess is the only place we can create Object Stores
              setVrequest.onsuccess = function(event) {
                  var transaction = setVrequest.result;
                  setVrequest.onsuccess = setVrequest.onerror = null;
                  // can't upgrade w/o versionchange transaction.
                  upgrade(oldVersion, STORE_VERSION);
                  transaction.oncomplete = function() {
                      for (var i = 0; i < self.waiting.length; i++) {
                          self.waiting[i].call(self);
                      }
                      self.waiting = [];
                      win();
                  };
              };
              setVrequest.onerror = function(e) {
                  setVrequest.onsuccess = setVrequest.onerror = null;
                  console.log("Failed to create objectstore " + e);
                  fail(e);
              };
            } else {
                self.store = true;
                for (var i = 0; i < self.waiting.length; i++) {
                      self.waiting[i].call(self);
                }
                self.waiting = [];
                win();
            }
        }
        request.onerror = function(ev) {
            if (request.errorCode === getIDBDatabaseException().VERSION_ERR) {
                // xxx blow it away
                self.idb.deleteDatabase(self.name);
                // try it again.
                return self.init(options, callback);
            }
            console.error('Failed to open database');
        };
    },

    save:function(obj, callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.save(obj, callback);
            });
            return;
         }
         
         var self = this, request;
         var win  = function (e) {
             // manually clean up event handlers; helps free memory on chrome.
             request.onsuccess = request.onerror = null;
             if (callback) { obj.key = e.target.result; self.lambda(callback).call(self, obj) }
         };

         var trans = this.db.transaction(STORE_NAME, READ_WRITE);
         var store = trans.objectStore(STORE_NAME);
         if (obj.key) {
             request = store.put(obj, obj.key);
         } else if (this.useAutoIncrement) {
             request = store.put(obj); // use autoIncrementing key.
         } else {
             request = store.put(obj, this.uuid()); // use randomly-generated key
         }
         
         request.onsuccess = win;
         request.onerror = fail;
         
         return this;
    },
    
    batch: function (objs, callback) {
        
        var results = []
        ,   done = objs.length
        ,   self = this

        var putOne = function(i) {
            self.save(objs[i], function(obj) {
                results[i] = obj;
                if ((--done) > 0) { return; }
                if (callback) {
                    self.lambda(callback).call(self, results);
                }
            });
        };

        for (var i = 0, l = objs.length; i < l; i++) 
            putOne(i);
        
        return this
    },
    

    get:function(key, callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.get(key, callback);
            });
            return;
        }
        
        
        var self = this;
        var win  = function (e) {
            var r = e.target.result;
            if (callback) {
                if (r) { r.key = key; }
                self.lambda(callback).call(self, r);
            }
        };
        
        if (!this.isArray(key)){
            var req = this.db.transaction(STORE_NAME).objectStore(STORE_NAME).get(key);

            req.onsuccess = function(event) {
                req.onsuccess = req.onerror = null;
                win(event);
            };
            req.onerror = function(event) {
                console.log("Failed to find " + key);
                req.onsuccess = req.onerror = null;
                fail(event);
            };
        
        } else {

            // note: these are hosted.
            var results = []
            ,   done = key.length
            ,   keys = key

            var getOne = function(i) {
                self.get(keys[i], function(obj) {
                    results[i] = obj;
                    if ((--done) > 0) { return; }
                    if (callback) {
                        self.lambda(callback).call(self, results);
                    }
                });
            };
            for (var i = 0, l = keys.length; i < l; i++) 
                getOne(i);
        }

        return this;
    },

    exists:function(key, callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.exists(key, callback);
            });
            return;
        }

        var self = this;

        var req = this.db.transaction(STORE_NAME).objectStore(STORE_NAME).openCursor(getIDBKeyRange().only(key));

        req.onsuccess = function(event) {
            req.onsuccess = req.onerror = null;
            // exists iff req.result is not null
            // XXX but firefox returns undefined instead, sigh XXX
            var undef;
            self.lambda(callback).call(self, event.target.result !== null &&
                                             event.target.result !== undef);
        };
        req.onerror = function(event) {
            req.onsuccess = req.onerror = null;
            console.log("Failed to test for " + key);
            fail(event);
        };

        return this;
    },

    all:function(callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.all(callback);
            });
            return;
        }
        var cb = this.fn(this.name, callback) || undefined;
        var self = this;
        var objectStore = this.db.transaction(STORE_NAME).objectStore(STORE_NAME);
        var toReturn = [];
        objectStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
               toReturn.push(cursor.value);
               cursor['continue']();
          }
          else {
              if (cb) cb.call(self, toReturn);
          }
        };
        return this;
    },

    keys:function(callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.keys(callback);
            });
            return;
        }
        var cb = this.fn(this.name, callback) || undefined;
        var self = this;
        var objectStore = this.db.transaction(STORE_NAME).objectStore(STORE_NAME);
        var toReturn = [];
        // in theory we could use openKeyCursor() here, but no one actually
        // supports it yet.
        objectStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
               toReturn.push(cursor.key);
               cursor['continue']();
          }
          else {
              if (cb) cb.call(self, toReturn);
          }
        };
        return this;
    },

    remove:function(keyOrArray, callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.remove(keyOrArray, callback);
            });
            return;
        }
        var self = this;
        if (this.isArray(keyOrArray)) {
            // batch remove
            var i, done = keyOrArray.length;
            var removeOne = function(i) {
                self.remove(keyOrArray[i], function() {
                    if ((--done) > 0) { return; }
                    if (callback) {
                        self.lambda(callback).call(self);
                    }
                });
            };
            for (i=0; i < keyOrArray.length; i++)
                removeOne(i);
            return this;
        }
        var request;
        var win  = function () {
            request.onsuccess = request.onerror = null;
            if (callback) self.lambda(callback).call(self)
        };
        var key = keyOrArray.key ? keyOrArray.key : keyOrArray;
        request = this.db.transaction(STORE_NAME, READ_WRITE).objectStore(STORE_NAME)['delete'](key);
        request.onsuccess = win;
        request.onerror = fail;
        return this;
    },

    nuke:function(callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.nuke(callback);
            });
            return;
        }
        
        var self = this
        ,   win  = callback ? function() { self.lambda(callback).call(self) } : function(){};
        
        try {
            this.db
                .transaction(STORE_NAME, READ_WRITE)
                .objectStore(STORE_NAME).clear().onsuccess = win;
            
        } catch(e) {
            fail();
        }
        return this;
    }
    
  };
  
})());
/**
 * dom storage adapter 
 * === 
 * - originally authored by Joseph Pecoraro
 *
 */ 
//
// TODO does it make sense to be chainable all over the place?
// chainable: nuke, remove, all, get, save, all    
// not chainable: valid, keys
//
Lawnchair.adapter('dom', (function() {
    var storage = window.localStorage
    // the indexer is an encapsulation of the helpers needed to keep an ordered index of the keys
    var indexer = function(name) {
        return {
            // the key
            key: name + '._index_',
            // returns the index
            all: function() {
				var a  = storage.getItem(this.key)
				if (a) {
					a = JSON.parse(a)
				}
                if (a === null) storage.setItem(this.key, JSON.stringify([])) // lazy init
                return JSON.parse(storage.getItem(this.key))
            },
            // adds a key to the index
            add: function (key) {
                var a = this.all()
                a.push(key)
                storage.setItem(this.key, JSON.stringify(a))
            },
            // deletes a key from the index
            del: function (key) {
                var a = this.all(), r = []
                // FIXME this is crazy inefficient but I'm in a strata meeting and half concentrating
                for (var i = 0, l = a.length; i < l; i++) {
                    if (a[i] != key) r.push(a[i])
                }
                storage.setItem(this.key, JSON.stringify(r))
            },
            // returns index for a key
            find: function (key) {
                var a = this.all()
                for (var i = 0, l = a.length; i < l; i++) {
                    if (key === a[i]) return i 
                }
                return false
            }
        }
    }
    
    // adapter api 
    return {
    
        // ensure we are in an env with localStorage 
        valid: function () {
            return !!storage && function() {
              // in mobile safari if safe browsing is enabled, window.storage
              // is defined but setItem calls throw exceptions.
              var success = true
              var value = Math.random()
              try {
                storage.setItem(value, value)
              } catch (e) {
                success = false
              }
              storage.removeItem(value)
              return success
            }()
        },

        init: function (options, callback) {
            this.indexer = indexer(this.name)
            if (callback) this.fn(this.name, callback).call(this, this)  
        },
        
        save: function (obj, callback) {
            var key = obj.key ? this.name + '.' + obj.key : this.name + '.' + this.uuid()
            // now we kil the key and use it in the store colleciton    
            delete obj.key;
            storage.setItem(key, JSON.stringify(obj))
            // if the key is not in the index push it on
            if (this.indexer.find(key) === false) this.indexer.add(key)
            obj.key = key.slice(this.name.length + 1)
            if (callback) {
                this.lambda(callback).call(this, obj)
            }
            return this
        },

        batch: function (ary, callback) {
            var saved = []
            // not particularily efficient but this is more for sqlite situations
            for (var i = 0, l = ary.length; i < l; i++) {
                this.save(ary[i], function(r){
                    saved.push(r)
                })
            }
            if (callback) this.lambda(callback).call(this, saved)
            return this
        },
       
        // accepts [options], callback
        keys: function(callback) {
            if (callback) {
                var name = this.name
                var indices = this.indexer.all();
                var keys = [];
                //Checking for the support of map.
                if(Array.prototype.map) {
                    keys = indices.map(function(r){ return r.replace(name + '.', '') })
                } else {
                    for (var key in indices) {
                        keys.push(key.replace(name + '.', ''));
                    }
                }
                this.fn('keys', callback).call(this, keys)
            }
            return this // TODO options for limit/offset, return promise
        },
        
        get: function (key, callback) {
            if (this.isArray(key)) {
                var r = []
                for (var i = 0, l = key.length; i < l; i++) {
                    var k = this.name + '.' + key[i]
                    var obj = storage.getItem(k)
                    if (obj) {
						obj = JSON.parse(obj)
                        obj.key = key[i]
                    } 
                    r.push(obj)
                }
                if (callback) this.lambda(callback).call(this, r)
            } else {
                var k = this.name + '.' + key
                var  obj = storage.getItem(k)
                if (obj) {
					obj = JSON.parse(obj)
					obj.key = key
				}
                if (callback) this.lambda(callback).call(this, obj)
            }
            return this
        },

        exists: function (key, cb) {
            var exists = this.indexer.find(this.name+'.'+key) === false ? false : true ;
            this.lambda(cb).call(this, exists);
            return this;
        },
        // NOTE adapters cannot set this.__results but plugins do
        // this probably should be reviewed
        all: function (callback) {
            var idx = this.indexer.all()
            ,   r   = []
            ,   o
            ,   k
            for (var i = 0, l = idx.length; i < l; i++) {
                k     = idx[i] //v
                o     = JSON.parse(storage.getItem(k))
                o.key = k.replace(this.name + '.', '')
                r.push(o)
            }
            if (callback) this.fn(this.name, callback).call(this, r)
            return this
        },
        
        remove: function (keyOrArray, callback) {
            var self = this;
            if (this.isArray(keyOrArray)) {
                // batch remove
                var i, done = keyOrArray.length;
                var removeOne = function(i) {
                    self.remove(keyOrArray[i], function() {
                        if ((--done) > 0) { return; }
                        if (callback) {
                            self.lambda(callback).call(self);
                        }
                    });
                };
                for (i=0; i < keyOrArray.length; i++)
                    removeOne(i);
                return this;
            }
            var key = this.name + '.' +
                ((keyOrArray.key) ? keyOrArray.key : keyOrArray)
            this.indexer.del(key)
            storage.removeItem(key)
            if (callback) this.lambda(callback).call(this)
            return this
        },
        
        nuke: function (callback) {
            this.all(function(r) {
                for (var i = 0, l = r.length; i < l; i++) {
                    this.remove(r[i]);
                }
                if (callback) this.lambda(callback).call(this)
            })
            return this 
        }
}})());
