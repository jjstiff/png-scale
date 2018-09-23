# png-scale

PNG scaling for Node.js depending only on [pngjs](https://github.com/lukeapage/pngjs).

  * Scale by percentage.
  * Scale to defined size.
  
Implemented scaling algorithms

  * box_scaling: shrink with top-left from box, grow by filling box.
  
## Install

```bash
npm install png-scale
```

## Usage

### Scale by percentage from file to file.
This a complete example. Just set your filename: in_fn.
```js
const PNGScale = require('png-scale');
const fs = require('fs');

var in_fn = "input.png";
var out_fn = "output.png";
var config = {dst:{width:"30%",height:"30%"}};

var in_file = fs.createReadStream(in_fn)
  .on('error',function(e) {console.log("Error reading file.",e); });
 
var out_file = fs.createWriteStream(out_fn)
  .on('error',function(e) {console.log("Error writing file.",e); })
  .on('close',function() {
    console.log("Scaling complete!");
    console.log("  input:",in_fn);
    console.log("  output:",out_fn);
    console.log("  config:",JSON.stringify(config));
  });

PNGScale.scale(in_file,config,function(err,data) {
  if(err) { console.log("Error with scaling.",err); }
  else { data.pipe(out_file); }
});
```

### Scale to size from file to file.
Same as above with single line changed.
```js
var config = {dst:{width:"200px",height:"100px"}};
```

'px' is optional. This is the same as above.
```js
var config = {dst:{width:"200",height:"100"}};
```

### Specify one dimension, scaling is proportional.

Scale proportionally by percentage.
```js
var config = {dst:{width:"30%"}};
```

Scale proportionally to size.
```js
var config = {dst:{height:"100px"}};
```

### Specify pngjs.PNG options.

Scale proportionally and output as colorType:0 (grayscale).
```js
var config = {dst:{width:"50%"},PNG:{colorType:0}};
```

  
## Additional Resources

  * <https://www.npmjs.com/package/png-crop>
  * <https://www.npmjs.com/package/pngjs>
  * <https://en.wikipedia.org/wiki/Image_scaling>
  * <https://www.compuphase.com/graphic/scale2.htm> (not currently implemented)

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.