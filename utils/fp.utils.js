const compose = (fa, fb) => x => fa(fb(x));
module.exports =  {compose}