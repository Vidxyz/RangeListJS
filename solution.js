// Task: Implement a class named 'RangeList'
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range list is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)

class RangeList {

  constructor() {
    this.listOfNumbers = [];
  }

  /**
   * Returns a list of numbers of the form [lower, lower+1, lower+2, ... ,upper-2, upper-1]
   * @param {Integer} lower, {Integer} upper - Lower and Upper bounds 
   */
  generateExpandedList(lower, upper) {
    var expandedList = [];
    for(var i=lower; i<upper; i++) {
      expandedList.push(i);
    }
    return expandedList;
  }
  
  /**
   * Sanitizes input by ensuring input parameters is of the form [lowerValue, higherValue]
   * Also ensures that decimal values are rounded to reflect integer intervals
   * @param {Array<number>} range - Array of two numbers that specify beginning and end of range.
   */
  sanitizeInput(range) {
    var returnList = range;
    if(range[1] < range[0]) {
      returnList = [range[1], range[0]]
    }

    // Now process the list to ensure only integer values be taken
    for(var i=0; i<returnList.length; i++) {
      returnList[i] = Math.round(returnList[i]);
    }

    return returnList;
  }
  /**
   * Adds a range to the list
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  add(range) {

    // Check to see if argument is of type list [x, y]
    if(this.badInput(range)) {
      console.log('Bad Input. Expect [x,y]')
      return;
    }

    var incomingRange = this.sanitizeInput(range);
    var incomingLowerBound = incomingRange[0];
    var incomingUpperBound = incomingRange[1];

    // console.log(`Add function: (${incomingLowerBound}, ${incomingUpperBound})`);

    // Since this means [x,x), which is a contradiction, we ignore this scenario
    if(incomingLowerBound == incomingUpperBound) {
      return;
    }

    var newExpandedList = this.generateExpandedList(incomingLowerBound, incomingUpperBound);

    // Trivial base case, when rangeList is initially empty
    if(this.listOfNumbers.length == 0) {
      this.listOfNumbers = newExpandedList;
      return;
    }
    
    this.listOfNumbers = this.expandList(this.listOfNumbers, newExpandedList);
    
    // console.log(this.listOfNumbers);
  }

   /**
   * Expands numberList to include all the numbers present in newList
   * Then removes duplicates to ensure the range calculations remain accurate
   * Finally, sorts the list to ensure accuract of range calculations again
   * @param {Array<number>} numberList - list of integers
   * @param {Array<number>} newList - list of integers
   */
  expandList(numberList, newList) {
    var updatedList = numberList.concat(newList);
    updatedList = [...new Set(updatedList)]
    updatedList = updatedList.sort(function(a, b){return a-b});
    return updatedList;
  }

  /**
   * Check to see if input is of the form [x,y] (list of size 2) and not anything else
   * @param {Array<number>} range - anything
   */
  badInput(range) {
    if(!Array.isArray(range) || range.length != 2) {
      return true;
    }

    return false;

  }

  /**
   * Removes all elements of newList that appear in numberList
   * @param {Array<number>} numberList - list of numbers
   * @param {Array<number>} newList - list of numbers. Typically, newList.length < numberList.length (not always)
   */
  removeIntersectionbetween(numberList, newList) {
    numberList = numberList.filter(function(element) {
      return newList.indexOf(element) == -1;
    });

    // Sort by ascending order, takes care of negative ranges
    numberList = numberList.sort(function(a, b){return a-b});
    return numberList;
  }

  /**
   * Removes a range from the list
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  remove(range) {

    if(this.badInput(range)) {
      console.log('Bad Input. Expect [x,y]')
      return;
    }
    
    // Sanitize input by ensuring x <=y in [x,y]
    var incomingRange = this.sanitizeInput(range);
    var incomingLowerBound = incomingRange[0];
    var incomingUpperBound = incomingRange[1];

    // console.log(`Remove function : (${incomingLowerBound}, ${incomingUpperBound})`);

    // Since this means [x,x), which is a contradiction, we ignore this scenario
    // Also takes care of deleting range in an already empty rangeList
    if(incomingLowerBound == incomingUpperBound || this.listOfNumbers.length == 0) {
      return;
    }

    var newExpandedList = this.generateExpandedList(incomingLowerBound, incomingUpperBound);

    // Now we remove every element in this.listOfNumbers that appears in newExpandedList
    this.listOfNumbers = this.removeIntersectionbetween(this.listOfNumbers, newExpandedList);    

    // console.log(this.listOfNumbers);
  }

  /**
   * Prints out the list of ranges in the range list
   * This parses a list of numbers to find out continuous intervals and prints them succintly
   */
  print() {
    var lowerBound = this.listOfNumbers[0];
    var upperBound = this.listOfNumbers[this.listOfNumbers.length-1]
    var outputString = '';

    // Special case, if there is only only element left
    if(this.listOfNumbers.length == 1) {
      outputString += '[' + lowerBound + ',' + (lowerBound + 1) + ') ';
    }

    for(var i=1; i<this.listOfNumbers.length; i++) {

      if(this.listOfNumbers[i] - this.listOfNumbers[i-1] != 1) {
        // Since we are storing [x,y-1], we add +1 to get [x,y)
        var exclusiveUpperBound = (this.listOfNumbers[i-1] + 1);
        outputString += '[' + lowerBound + ',' + exclusiveUpperBound + ') ';
        lowerBound = this.listOfNumbers[i];
      }

      if(i == this.listOfNumbers.length-1) {
        // Since we are storing [x,y-1], we add +1 to get [x,y)
        var exclusiveUpperBound = (upperBound + 1);
        outputString += '[' + lowerBound + ',' + exclusiveUpperBound + ') ';
      }
    }

    console.log(outputString);
  }
}

module.exports = {
  rangeList: RangeList
};

