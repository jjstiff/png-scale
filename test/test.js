
const PNGScale = require('../');
const fs = require('fs');

const INFILE_1 = "green_sea_shell.png";
const INFILE_2 = "tvs.png";

const INFILE = function(x) { return __dirname+"/input/"+x }
const OUTFILE = function(x) { return __dirname+"/output/"+x }

const write = function(file,stream,cb) {
  var out = fs.createWriteStream(OUTFILE(file));
  stream.pipe(out).on('finish',function(err){ if(cb) cb(err,"Wrote to file: "+file); })
}

const verify = function(file,stream,cb) {
  try {
    var v = fs.readFileSync(OUTFILE(file),'binary');
    var i = 0;
    var fail = false;
    
    stream.on('data',function(c) {
      fail |= 0!=Buffer.compare(c,new Buffer(v.slice(i,i+c.length),'binary'))
      i+=c.length;
    }).on('end', function() {
      if(fail || i != v.length) {
        if(cb) cb("stream does not match file: "+file);
      }  
      else {
        if(cb) cb(null,"stream matches file: "+file);
      }
    });
  }
  catch(e) {
    if(cb) cb(e);
  }
}

console.log(process.argv);

const confirmation_method = (process.argv[2] == 'write' ? write : verify); 

const scale_test = function(prefix,name,f_in,config,f_out,cb)
{
  var log = function(err,message) {
    console.log(prefix,message,"|",name+":",f_in,JSON.stringify(config),f_out,err?JSON.stringify(err):"");
    if(cb) cb(err,message);
  }
  var s_in = fs.createReadStream(INFILE(f_in));
  PNGScale.scale(s_in,config,function(err,data) {
    if(err) {
      log(err,"error scaling");
    }
    else {
      confirmation_method(f_out,data,function(err,status) {
        log(err,err?"error in verification":"success");
      });
    }
  });
}


var tests = [
  function(prefix,cb) {
    scale_test(prefix,"Scale 50%",INFILE_1,{dst:{width:"50%",height:"50%"}},"scale_050.png",cb);
  },
  function(prefix,cb) {
    scale_test(prefix,"Scale 200%",INFILE_1,{dst:{width:"200%",height:"200%"}},"scale_200.png",cb);
  },
]

var i = 0;
var fail = 0;
var success = 0;
var test = function() {
  if(i>=tests.length) {
    console.log("Complete:",success,"successes.",fail,"failures.");
    return;
  }
  var t = tests[i];
  i++;
  if(t) {
    t(i+":",function(err,result) {
      if(err) fail++;
      else success++;
      setTimeout(test);
    })
  }
  else {
    setTimeout(test);
  }
}
setTimeout(test);


