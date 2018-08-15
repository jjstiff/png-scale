'use strict';

var fs = require('fs');
var PNG = require('pngjs').PNG;

var methods = {
  "box_scaling": require('./algos/box-scaling.js')
}
var default_method = methods["box_scaling"];

var pxPercent = function(d,s) {
  var D = d.toString();
  if(D.match(/\%$/)) { return parseInt(parseFloat(D)*s/100); }
  else if(D.match(/px$/)) { return parseInt(D); }
  return d;
}

var scale = function(inStream, config, cb)
{
  if(!cb) { throw new Error("scale requires a callback function"); }
  if(!inStream || !inStream.pipe) throw (new Error("No pipe-able input stream provided."));
  
  var dst = config && config.dst || {};
  var src = config && config.src || {};
  if (!dst.height && !dst.width) {
    throw (new Error("config must specify dst.width or dst.height"));
  }
  
  var method = config.method || default_method;
  inStream.pipe(new PNG()).once('error', cb).on('parsed', function()
  {
    var sX = src.left || 0;
    var sY = src.top || 0;
    var sW = src.width || this.width; sW = Math.min(sW, this.width-sX);
    var sH = src.height || this.height; sH = Math.min(sH, this.height-sY);
    var dX = dst.left || 0;
    var dY = dst.top || 0;
    var dW = sW;
    var dH = sH;
    if(dst.width && dst.height) {
      dW = pxPercent(dst.width,sW); 
      dH = pxPercent(dst.height,sH);
    }
    else if(dst.width) {
      dW = pxPercent(dst.width,sW); 
      dH = Math.round(dW*sH/sW);
    }
    else if(dst.height) {
      dH = pxPercent(dst.height,sH);
      dW = Math.round(dH*sW/sH);
    }

    var writeStream = new PNG({width: dW + dX, height: dH + dY});
    method(this, writeStream, sX, sY, sW, sH, dX, dY, dW, dH)
    cb(null, writeStream.pack());
  });
}

module.exports = {
  methods: methods,
  scale: scale
};
