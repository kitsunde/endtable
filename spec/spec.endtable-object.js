describe 'Endtable.Object'
	describe 'constructor'
		it 'should save a new object created'
			endtableCore = new endtable.Core({
				database: 'test'
			});	
		
			setTimeout(function() {
				var person = {};
				endtableObject = new endtable.Object({
					engine: endtableCore
				}).load({
					keys: 'name',
					type: 'person',
					key: 'John Doe'
				}, function(error, obj) {
					person = obj;
				});
				
				setTimeout(function() {
					person.name.should.equal('John Doe')
					person.age.should.equal(75)
				}, TIMEOUT_INTERVAL);
			}, TIMEOUT_INTERVAL);
			
			endtableObject = new endtable.Object({
				engine: endtableCore,
				type: 'person',
				name: 'John Doe',
				age: 75
			});
			
			this.should.assert_later()
		end
		
		it 'should re-save new objects when instance variables are added'
			endtableObject = new endtable.Object({
				engine: endtableCore,
				type: 'person',
				name: 'Bob Yewchuck',
				age: 99
			});
			endtableObject.brain = 'big'
			
			setTimeout(function() {
				endtableObject = new endtable.Object({
					engine: endtableCore
				}).load({
					keys: 'name',
					type: 'person',
					key: 'Bob Yewchuck'
				}, function(error, obj) {
					obj.brain.should.equal('big')
				});
			}, 1000);
			
			this.should.assert_later()
		end
	end
	
	describe 'save'
		it 'should save an object when a new element is added to an array'
			endtableCore = new endtable.Core({
				database: 'test'
			});	
		
			loadCallback = function(error, obj) {
				obj.array[2] = 'orange';
			}
			
			endtableObject = new endtable.Object({
				engine: endtableCore
			}).load({
				keys: 'name',
				type: 'person',
				key: 'Array Test'
			}, loadCallback);
			
			this.should.assert_later()
		end
		
		it 'should save an object when a new element is added to an object'
		
		end
	end

	describe 'load'
		it 'should populate an objects instance variables with fields from key/value store'
			endtableCore = new endtable.Core({
				database: 'test'
			});	
		
			assertCallback = function(error, obj) {
				obj.name.should.equal('Mark Twain')
				obj.age.should.equal(150)
			}
			
			endtableObject = new endtable.Object({
				engine: endtableCore
			}).load({
				keys: 'name',
				type: 'person',
				key: 'Mark Twain'
			}, assertCallback);
			
			this.should.assert_later()
		end
		
		it 'should return an array of objects if a query would return multiple results'
		
		end
		
		it 'should allow the default constructor of the object generation function to be overridden'
		
		end
	end
	
	describe 'delete'
		it 'should let you delete a single document'
		
		end
		
		it 'should let you delete a range of objects'
		
		end
	end
	
	it 'should set a dirty flag on the object when an instance variable is added'
		endtableCore = new endtable.Core({
			database: 'test'
		});
		
		assertCallback = function(error, obj) {
			obj._dirty.should.equal(false);
			obj.newKey = ['apple', 'banana'];
			
			setTimeout(function() {
				obj._dirty.should.equal(true);
			}, TIMEOUT_INTERVAL);
		}
		
		endtableObject = new endtable.Object({
			engine: endtableCore,
			saveRate: 50000
		}).load({
			keys: 'name',
			type: 'person',
			key: 'Zeebert'
		}, assertCallback);
		
		this.should.assert_later()
	end
	
	it 'should set the dirty flag on the object when an instance variable is updated'
		endtableCore = new endtable.Core({
			database: 'test'
		});
		
		assertCallback = function(error, obj) {
			obj._dirty.should.equal(false);
			obj.age = 55
			obj._dirty.should.equal(true);
		}
		
		endtableObject = new endtable.Object({
			engine: endtableCore
		}).load({
			keys: 'name',
			type: 'person',
			key: 'Change Test'
		}, assertCallback);
		
		this.should.assert_later()
	end
	
	it 'should automatically persist an object to couch if it has been dirtied'
		var dirtyCallback = function(error, obj) {
			obj.name = 'Brian Wilson';
		}
		
		endtableCore = new endtable.Core({
			database: 'test'
		});
		
		var saveCalled = false;
		endtableCore.connector.saveDocument = function(params, callback) {
			saveCalled = true;
		}
		
		endtableObject = new endtable.Object({
			engine: endtableCore
		}).load({
			keys: 'name',
			type: 'person',
			key: 'Christian'
		}, dirtyCallback);
		
		setTimeout(function() {
			saveCalled.should.equal(true);
		}, TIMEOUT_INTERVAL);
		
		this.should.assert_later()
	end
	
	it 'should actually save the values back to couch when an object is dirtied'
		var dirtyCallback = function(error, obj) {
			obj.name = 'Brian Wilson';
		}
		
		endtableCore = new endtable.Core({
			database: 'test'
		});
		
		endtableObject = new endtable.Object({
			engine: endtableCore
		}).load({
			keys: 'name',
			type: 'person',
			key: 'Change Test2'
		}, dirtyCallback);
		
		setTimeout(function() {
			var loadCallback = function(error, obj) {
				obj.name.should.equal('Brian Wilson');
			}
			
			endtableObject = new endtable.Object({
				engine: endtableCore
			}).load({
				keys: 'name',
				type: 'person',
				key: 'Brian Wilson'
			}, loadCallback);
		}, TIMEOUT_INTERVAL);
		
		this.should.assert_later()
	end	
end