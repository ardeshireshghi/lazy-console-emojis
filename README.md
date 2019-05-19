# Console log with Emoji created JIT

## Summary
Creates console emoji functions on the fly. Example

```js
console.beer('It is beer O\'clock');
// Output: 🍺 It is beer O'clock
```

## Usage

### Browser

Store the minified version in CDN or static server and load it into the page:

```html
<script type="text/javascript" src="browser/lazy-console.emojis.min.js">
<script>
  console.angry('API Error! 500');
<script>
```

### Node/Webpack/Browerify

```js
// ES5
require('lazy-console-emojis/dist/console');

// ES2015/ES6
import 'lazy-console-emojis/dist/console';
```
