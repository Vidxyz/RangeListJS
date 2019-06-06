// Task: Implement a class named 'RangeList'
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range list is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)

class RangeList {

  constructor() {
    // This is going to be a list of lists, with inner lists being of size 2
    this.listOfNumbers = [];
  }

  /**
   * Returns +1 if [lower, upper] is strictly to the right of the given range
   * Returns -1 if [lower, upper] is strictly to the left of the given range
   * Returns  0 if [lower, upper] is contained/overlapped in the given 
   * Ideally, I would do this via use of an 'enum' as available in Java, unsure of whether JS has something similar
   * @param {Integer} lower, {Integer} upper - Lower and Upper bounds 
   */
  getDirection(lower, upper, range) {
    // This is the case of full consumption, in which case you have to do nothing really
    // In this case, incoming [lower, upper] is ALREADY FULLY captured by existing range
    if(lower > range[0] && upper < range[1]) {
      return 0;
    }
    else if(lower > range[1]) {
      return 2;
    }
    else if(upper < range[0]) {
      return -2;
    }
    else if(lower <= range[1] && upper > range[1]){
      return 1;
    }
    else if(lower < range[0] && upper >= range[0]) {
      return -1;
    }
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

    console.log(`Add function: (${incomingLowerBound}, ${incomingUpperBound})`);

    // Since this means [x,x), which is a contradiction, we ignore this scenario
    if(incomingLowerBound == incomingUpperBound) {
      return;
    }

    // Trivial base case, when rangeList is initially empty
    if(this.listOfNumbers.length == 0) {
      this.listOfNumbers.push(range);
      return;
    }
    
    
    var directionList = [];

    for(var i=0; i<this.listOfNumbers.length; i++) {
      directionList.push(this.getDirection(incomingLowerBound, incomingUpperBound, this.listOfNumbers[i]))
    }
    

    console.log(directionList);

    // Special case for adding bounds at the beginning/end of list
    if(directionList[0] == -2) {
      this.listOfNumbers.unshift(range);
      return;
    }

    if(directionList[directionList.length-1] == 2) {
      this.listOfNumbers.push(range);
      return;
    }

    /* 
    ** Case 1, where incoming bounds form its own unique interval in between
    ** DirectionList will look like this for this case [2,2,2,-2], or [2,-2,-2,-2]
    */
    for(var i=0; i<directionList.length-1; i++) {
      // This means that the new range is between these two ranges, fully internal
      if(directionList[i] == 2 && directionList[i+1] == -2) {
        this.listOfNumbers.splice(i+1, 0, range);
        return;
      }
    }

    /*
    ** Now we will address the case where intervals overlap, and see what can be done with this
    ** IF intervals overlap, directionList will look something like this [2, 2, 1, -1, -2]
    ** This signifies that our incoming bounds overlap with 2 existing intervals
    ** At this point, we are guaranteed to have some 0s, else it would have been satisfied by the case above
    */
    var lowerIntersectingBoundIndex = -1;
    var upperIntersectionBoundIndex = -1;
    var hasLowerIntersectingBoundBeenFound = false;

    // Must delete those entries that have 0 direction
    for(var i=0; i<directionList.length; i++) {

      if(directionList[i] == 0 ) {
        this.listOfNumbers.splice(i,1);
      }

    }

    for(var i=0; i<directionList.length; i++) {

      if(directionList[i] == 1) {
        lowerIntersectingBoundIndex = i;
      }
      if(directionList[i] == -1) {
        upperIntersectionBoundIndex = i;
      }

    }

    // This means there was no '-1' in the directionList
    // This must mean that the inbound interval is ALREADY captured by existing intervals!
    if(lowerIntersectingBoundIndex == -1) {
      return;
    }

    // If we didn't find the upper bound after going through the whole array, then it means that
    // the upper bound is the last "bounds" itself!
    if(upperIntersectionBoundIndex == -1) {
      upperIntersectionBoundIndex = lowerIntersectingBoundIndex;
    }

    var newLowerBound, newUpperBound;
    newLowerBound = Math.min(incomingLowerBound, this.listOfNumbers[lowerIntersectingBoundIndex][0]);
    newUpperBound = Math.max(incomingUpperBound, this.listOfNumbers[upperIntersectionBoundIndex][1]);
    var newRange = [newLowerBound, newUpperBound];

    // This range should now replace the first entry of the series of elements whose direction is depcited by a 0
    this.listOfNumbers[lowerIntersectingBoundIndex] = newRange;
    // Now must delete all elements from lowerIntersectingBoundIndex+1 ... upperIntersectingBoundIndex  
    for(var i=upperIntersectionBoundIndex; i >= lowerIntersectingBoundIndex+1; i--) {
      this.listOfNumbers.splice(i, 1);
    }
    
    // console.log(this.listOfNumbers);
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

    console.log(`Remove function : (${incomingLowerBound}, ${incomingUpperBound})`);

    // Since this means [x,x), which is a contradiction, we ignore this scenario
    // Also takes care of deleting range in an already empty rangeList
    if(incomingLowerBound == incomingUpperBound || this.listOfNumbers.length == 0) {
      return;
    }
    
    // Removal code goes here
    // Get direction list for existing ranges, as we did for the add operation as well
    var directionList = [];
    for(var i=0; i<this.listOfNumbers.length; i++) {
      directionList.push(this.getDirection(incomingLowerBound, incomingUpperBound, this.listOfNumbers[i]))
    }

    console.log(directionList);
    // This means that inbound interval is either to the extreme left of existing intervals
    // Or extreme right
    // In both cases, there is no interval to delete. So we do nothing
    if(directionList[0] == -1 || directionList[directionList.length - 1] == 1) {
      return;
    }

    // Check case where incoming bounds force deletion of all existing bounds
    // ie, if directionList if filled with 0s
    var totalSum = directionList.reduce(function(acc, val){return acc + val;}, 0);
    if(totalSum == 0) {
      this.listOfNumbers = [];
      return;
    }

    // Now to account for the case where the inbound interval to delete is not at the ends, but 
    // somewhere in between, yet not fully captured
    // Example [1,5] [10-21] -> remove ([7,9]) should do nothing since that interval doesn't exist
    for(var i=0; i<directionList.length; i++) {
      // This means that current direction is right, but next direction is left. This means there is a free
      // interval in between. Nothing to delete!
      // console.log(`var i=${i} and directionList value=${directionList[i]}`);
      var currentLowerBound = this.listOfNumbers[i][0];
      var currentUpperBound = this.listOfNumbers[i][1];

      if(directionList[Math.min(i-1,0)] == 1 && directionList[i] == -1) {
        return;
      }

      // Signifying total consumption overlap
      if(directionList[i] == 2) {
        // Have to split the interval
        // [10-21] w/ [15-17]  ==> [10-15][17]
        var range1 = [this.listOfNumbers[i][0], incomingLowerBound];
        var range2 = [incomingUpperBound, this.listOfNumbers[i][1]];

        this.listOfNumbers.splice(i, 1, range1, range2);

      }

      // Signifying partial overlap
      if(directionList[i] == 0) {
        // Find out where the partial overlap is happening  
        console.log(`Partial overlap on index ${i}`);



        if(incomingLowerBound < currentUpperBound && incomingUpperBound > currentUpperBound) {
            console.log('case2')
          // if(incomingUpperBound > currentUpperBound) {
            this.listOfNumbers[i][1] = incomingLowerBound;
            
          // }
          
          // if(incomingUpperBound > currentLowerBound){
          //   console.log("There");
          //   this.listOfNumbers[i][0] = incomingUpperBound;
          //   return;
          // }
        }

        if(incomingUpperBound > currentLowerBound && incomingLowerBound < currentLowerBound) {
            console.log('Case1')  
          // if(incomingLowerBound < currentLowerBound) {
            this.listOfNumbers[i][0] = incomingUpperBound;
            
          // }

        }


        
      }
    }

    // Now to account for the cases where the inbound interval overlaps at least 1 existing interval
    // AS an example, if the current RangeList is [[1,5], [10,21]] and the range to remove is [15,17]
    // It should then split to [[1,5] [10,15], [15,21]]
    // ANOTHER EXAMPLE:- What if incoming range was [8,13] ==> [[1,5][13,21]]
    // This is where the fully consumed scenario takes place


    console.log(this.listOfNumbers);
  }

  /**
   * Prints out the list of ranges in the range list
   * This parses a list of numbers to find out continuous intervals and prints them succintly
   */
  print() {
    var lowerBound = this.listOfNumbers[0];
    var upperBound = this.listOfNumbers[this.listOfNumbers.length-1]
    var outputString = '';

    for(var i=0; i<this.listOfNumbers.length; i++) {
      // Each entry is a list of type [x,y]
      outputString += `[${this.listOfNumbers[i][0]}, ${this.listOfNumbers[i][1]}) `;
    }

    console.log(outputString);
  }
}

module.exports = {
  rangeList: RangeList
};

