const PNGScale = require('../');
const fs = require('fs');

var in_fn = __dirname+"/../test/input/tvs.png";
var out_fn = "output.png";
var config = {dst:{width:"200px",height:"100px"}};

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