# RangeListJS

Simple Javascript data-structure that stores the contents of various ranges

 A pair of integers define a range, for example: [1, 5) 
 This range includes integers: 1, 2, 3, and 4.
 
 A range list is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)
 
 API usage
 --
 1. Instantiate: 
 ```
    var r = require('./rangelist');
    var rl = r.rangeList();
 ```
 
 2. add(range) - expects an array of two integers signifying the lower and upper bounds of the range to add 
    example:- `rl.add([-1,6])`
 
 3. remove(range) - expects an array of two integers signifying the lower and upper bounds of the range to remove 
    example:- `rl.remove([2,9])`
   
 4. print() - prints existing ranges as defined previously
    example:- `rl.print();`
