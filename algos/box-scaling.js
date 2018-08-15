// box-scaling.js
//

module.exports = function(src, dst, sX, sY, sW, sH, dX, dY, dW, dH)
{ 
  sX |= 0;
  sY |= 0;
  sW |= 0;
  sH |= 0;
  dX |= 0;
  dY |= 0;
  dW |= 0;
  dH |= 0;

  if (sX > src.width || sY > src.height || sX + sW > src.width || sY + sH > src.height) {
    throw new Error('bitblt reading outside image');
  }

  if (dX > dst.width || dY > dst.height || dX + dW > dst.width || dY + dH > dst.height) {
    throw new Error('bitblt writing outside image');
  }
  
  var copy = function(ys,yd,xs,xd,count) {
    src.data.copy(dst.data,
      ((dY + yd) * dst.width + dX + xd) << 2,
      ((sY + ys) * src.width + sX + xs) << 2,
      ((sY + ys) * src.width + sX + xs + count) << 2
    );
  }
  
  var y_shrink = function(x_fun) {
    var y_ = [];
    for (var ys = 0; ys < sH; ys++) {
      var yd = Math.floor(ys*dH/sH);
      if(y_[yd]) continue;
      y_[yd] = true;
      x_fun(ys,yd);
    }
  }
  
  var y_grow = function(x_fun) {
    for (var yd = 0; yd < dH; yd++) {
      var ys = Math.floor(yd*sH/dH);
      x_fun(ys,yd);
    }
  }
  
  var x_shrink = function(ys,yd) {
    var x_ = [];
    for(var xs = 0; xs < sW; xs++ ) {
      var xd = Math.floor(xs*dW/sW);
      if(x_[xd]) continue;
      x_[xd] = true;
      copy(ys,yd,xs,xd,1);
    }
  }
  
  var x_grow = function(ys,yd) {
    for(var xd = 0; xd < dW; xd++ ) {
      var xs = Math.floor(xd*sW/dW);
      copy(ys,yd,xs,xd,1); // Could be faster by doing more than 1 when needed.
    }
  }
  
  if(sH >= dH && sW >= dW) { y_shrink(x_shrink); }
  else if(sH >= dH) { y_shrink(x_grow); }
  else if(sW >= dW) { y_grow(x_shrink); }
  else { y_grow(x_grow); }
};