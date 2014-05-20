ak-eventemitter
===============

# API

## `EventEmitter(options)`
Constructor.

- `options` *Object*
```javascript
{
  'delimiter': '.' // used to delimite name spaces
}
```

## `on(ns, callback[, context, once])`
Adds an event listener.

- **`ns`** *String*

Target namespace, wildcard is `*`, e.g `chat.*`

- **`callback`** *Function*

`function (ns, arg1, arg2, ...) {}` see [`emit()`](#emitns).

- **`context`** *Object* [optional]

Context used when calling callback.

- **`once`** `Boolean` [optional]

Privately used by [`once()`](#oncenscallbackcontext)

## `once(ns, callback, context)`
Same as [`on()`](#onnscallbackcontextonce), triggered only once (removed after first [`emit()`](#emitns)).

## `off([ns, callback, context])`
Removes an event listener.

- **`ns`** *String* [optional]

Target namespace, wildcard is `*`, e.g `chat.*`

- **`callback`** *Function* [optional]

`function (ns, arg1, arg2, ...) {}` see [`emit()`](#emitns).

- **`context`** *Object* [optional]

Context used when calling callback.

---

- If no `ns` provided, removes *all* listeners;
- if no `callback` provided, removes *all* listeners for given `ns`;
- if no `context` provided, remove a listener for given `ns` and `callback`;
- if `context` provided, removes a listener for given `ns`, `callback` and `context`.

## `emit(ns, ...)`
Emits an event.


- **`ns`** *String* [optional]

Target namespace.

- **`...`** *Mixed* [optional]

Any argument given after `ns` will be passed to listener's callback. See [examples](#examples).

## Inheritance
See this [CoderWall tip](https://coderwall.com/p/3bhwnw).

# Examples

## Example 1: simple event
```javascript
var ee = new EventEmitter();

ee.on('someevent', function (ns, val1, val2) {
  console.log(ns, val1, val2);
});

ee.emit('someevent', 123, 'abc'); // -> 'someevent', 123, 'abc'
```

## Example 2: wildcard event
```javascript
var ee = new EventEmitter();

ee.on('room.*', function (ns, data) {
  console.log(ns, data);
});

ee.emit('room.user.enter', 'john'); // -> 'room.user.enter', 'john'
ee.emit('room.user.leave', 'john'); // -> 'room.user.leave', 'john'
ee.emit('room.topic.update', 'JavaScript is awesome!'); // -> 'room.topic.update', 'JavaScript is awesome!'
```

## Example 3: on, once, off
```javascript
var ee = new EventEmitter();

ee.on('room.*', function (ns, data) {
  console.log(ns, data);
});

ee.once('room.user.enter', function (ns, user) {
  console.log('Hello ' + user + '! You\'re the first in!');
});

ee.emit('room.user.enter', 'john'); 
// -> 'room.user.enter', 'john'
// -> 'Hello john! You're the first in!'

ee.off('room.*');

ee.emit('room.user.leave', 'john'); // Nothing is logged (because we offed 'room.*')
```

## Example 4: context
```javascript
var ee = new EventEmitter();
var counter = {
  'enter': 0,
  'leave': 0
};

ee.on('room.user.enter', function (ns) {
  this.enter += 1;
}, );

ee.on('room.user.leave', function (ns) {
  this.leave += 1;
}, );

ee.emit('room.user.enter', 'john');
ee.emit('room.user.leave', 'mary');
ee.emit('room.user.enter', 'george');
ee.emit('room.user.enter', 'paul');

console.log(counter); // -> {'enter': 3, 'leave': 1}
```