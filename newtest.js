var test = require('./rangelist');

console.log('Run starting')

// Example run, with additional tests added on
const rl = new test.rangeList();

rl.remove([6,19]);
rl.print();

rl.add([1, 5]);
rl.print();
// Should display: [1, 5)

rl.add([10, 20]);
rl.print();
// Should display: [1, 5) [10, 20)

rl.add([20, 20]);
rl.print();
// Should display: [1, 5) [10, 20)

rl.add([20, 21]);
rl.print();
// Should display: [1, 5) [10, 21)

rl.add([0, 6]);
rl.print();
// Should display: [1, 5) [10, 21)

rl.add([23, 31]);
rl.print();

rl.add([9, 22]);
rl.print();

// rl.add([3, 8]);
// rl.print();

// rl.add([-8,100]);
// rl.print();
// // Should display: [1, 8) [10, 21)

// rl.add([5, 22]);
// rl.print();
// CHECK EDGE-CASES TO ENSURE NO BREAKAGE

rl.remove([10, 10]);
rl.print();
// Should display: [1, 8) [10, 21)

rl.remove([7, 9]);
rl.print();
// // Should display: [1, 8) [10, 21)

// // rl.remove([10, 11]);
// // rl.print();
// // // Should display: [1, 8) [11, 21)

rl.remove([15,19]);
rl.print();
// Should display: [1, 8) [11, 15) [17, 21)

rl.remove([13,20]);
rl.print();

rl.add([6,9]);
rl.print();

rl.remove([6,9]);
rl.print();

rl.remove([25,29]);
rl.print();

// rl.add([-4, 10])
// rl.print();
// // Should display: [-4, 10) [11, 15) [17, 21)

// rl.remove([3, 19]);
// rl.print();
// // Should display: [-4, 3) [19, 21)

// rl.add('potato')
// rl.add(1.44)
// rl.add([1,2,3,4]);
// rl.add([]);
// rl.add([1]);
// // Should display bad input (x5)

// rl.add([2.2, 9.11])
// // Should round decimals to 2,9
// rl.print();
// // Should display [-4,9) [19,21)

// rl.remove([20, -50])
// rl.print();
// // Should display [20,21)

// rl.add([-4,24])
// rl.print();
// // Should display [-4,24)

// rl.remove([-1,20])
// rl.print();
// // Should display [-4,-1) [20,24)

// rl.add([-3,-1])
// rl.print();
// // Should display [-4,-1) [20,24)

// rl.remove([22,29])
// rl.print();
// Should display [-4,-1) [20,22)