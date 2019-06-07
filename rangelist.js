// Task: Implement a class named 'RangeList'
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range list is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)


/* NOTES
** -----
** This problem is solved by breaking any inbound range-interval down into 3 broad cases, plus some special cases
** Any inbound interval when compared to existing intervals can fall into one of 3 broad categories
** Category 1: The inbound interval is completely independent of existing intervals. It's either strictly > or strictly <
**             For example, if the intervals are [1-5][10-21] and the inbound interval is [23-30]
** Categroy 2: The inbound interval FULLY CONSUMES/FULLY CONSUMED by existing intervals
**             For example, if the intervals are [1-5][10-21] and the inbound interval is [14-19] or [8-24]
** Category 3: The inbound interval PARTIALLY overlaps at-least one interval
**             For example, if the intervals are [1-5][10-21]  and the inbound interval is [3-14]
**             This interval overlaps both existing interval, one on the right-end and one on the left-end
**
** These cases are carefully evaluated along with the special case scenarios to store the rangeList using just the 
** indices involved. 
** The runtime complexity is O(n) where n is the number of range-pairs that come in.
** The space complexity is also O(n)
*/

class RangeList {

  constructor() {
    // This is going to be a list of lists, with inner lists being of size 2
    this.listOfNumbers = [];
  }

  /**
   * Returns +2 if [lower, upper] is strictly to the right of the given range
   * Returns -2 if [lower, upper] is strictly to the left of the given range
   * Returns  0 if [lower, upper] is fully consumed by range or vice versa 
   * Returns +1 if [lower, upper] overlaps range on the upperBound
   * Returns -1 if [lower, upper] overlaps range on the lowerBound
   * Ideally, I would do this via use of an 'enum' as available in Java, unsure of whether JS has something similar
   * @param {Integer} lower, {Integer} upper - Lower and Upper bounds 
   * @param {List} range - List of 2 integers 
   */
  getDirection(lower, upper, range) {
    // EXAMPLE:- range = [5,9] lower=2, upper=11
    // This is the case of full consumption, in which case you have to do nothing really
    // In this case, incoming [lower, upper] is ALREADY FULLY captured by existing range
    if(lower > range[0] && upper < range[1]) {
      return 0;
    }
    if(range[0] > lower && range[1] < upper) {
      return 0;
    }
    else if(lower > range[1]) {
      return 2;
    }
    else if(upper < range[0]) {
      return -2;
    }
    // Think [5,15] and [1,7]
    else if(range[1] >= lower && range[1] <= upper){
      return 1;
    }
    else if(range[0] >= lower && range[0] <= upper) {
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
      this.listOfNumbers.push(incomingRange);
      return;
    }
    
    var directionList = [];
    for(var i=0; i<this.listOfNumbers.length; i++) {
      directionList.push(this.getDirection(incomingLowerBound, incomingUpperBound, this.listOfNumbers[i]))
    }
    
    // SPECIAL CASE for adding bounds at the BEGINNING of list
    if(directionList[0] == -2) {
      this.listOfNumbers.unshift(incomingRange);
      return;
    }

    // SPECIAL CASE for adding bounds at the END of list
    if(directionList[directionList.length-1] == 2) {
      this.listOfNumbers.push(incomingRange);
      return;
    }

    var isFilledWithZeros = true;
    for(var i=0;i<directionList.length; i++) {
      if(directionList[i] != 0) {
        isFilledWithZeros = false;
      } 
    }

    // SPECIAL CASE for when all intervals are fully consumed ==> inbound interval is all encompassing
    if(isFilledWithZeros) {
      if(directionList.length != 1) {
        this.listOfNumbers = []
        this.listOfNumbers.push(incomingRange);
      }
      else {
        // Special case when only ONE element is involved
        // We only replace existing interval IFF incoming interval FULLY CONSUMES existing interval
        if(incomingLowerBound < this.listOfNumbers[0][0] && incomingUpperBound > this.listOfNumbers[0][1]) {
          this.listOfNumbers = []
          this.listOfNumbers.push(incomingRange);
        }
      }
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
    * Case 2, Here we will look at cases where inbound interval is either
    * 1. Fully consumed by existing interval
    * 2. Consumes an existing interval itself
    */
    for(var i=0; i<directionList.length; i++) {
      if(directionList[i] == 0) {
        // Only change interval, if option 2 
        if(incomingLowerBound < this.listOfNumbers[i][0] && incomingUpperBound > this.listOfNumbers[i][1]) {
          this.listOfNumbers[i][0] = incomingLowerBound;
          this.listOfNumbers[i][1] = incomingUpperBound;
          return;
        }
      }
    }

    /*
    ** Now we will address the case where intervals overlap, and see what can be done with this
    ** IF intervals overlap, directionList will look something like this [2, 2, 1, 0, 0,  -1, -2]
    ** This signifies that our incoming bounds overlap with 2 existing intervals
    ** Must delete those entries that have 0 direction as they are FULLY consumed by inbound interval
    ** NOTE: Note, Two 1s in a row is not possible, but Two 2s is possible
    */
    var lowerIntersectingBoundIndex = -1;
    var upperIntersectionBoundIndex = -1;
    var hasLowerIntersectingBoundBeenFound = false;

    for(var i=0; i<directionList.length; i++) {

      if(!hasLowerIntersectingBoundBeenFound) {
        if(directionList[i] == 1) {
          lowerIntersectingBoundIndex = i;
          hasLowerIntersectingBoundBeenFound = true;
        }
      }
      else {
        // Find upper bound of intersection, while making sure fully consumed intervals are ignored
        if(directionList[i] != -1 && directionList[i] != 0) {
          upperIntersectionBoundIndex = i-1;
          break;
        }
      }
      
    }

    // This means there was no '+1' in the directionList
    if(lowerIntersectingBoundIndex == -1) {
      if(upperIntersectionBoundIndex == -1) {
        lowerIntersectingBoundIndex = upperIntersectionBoundIndex = 0;
      }
      // This must mean that the inbound interval is ALREADY captured by existing intervals!
      else {
        return;
      }
    }

    // If we didn't find the upper bound after going through the whole array, then it means that
    // the upper bound is the last 'bound' in itself!
    if(upperIntersectionBoundIndex == -1) {
      upperIntersectionBoundIndex = directionList.length - 1;
    }

    // Now we set about creating and updating the new range value
    var newLowerBound, newUpperBound;
    newLowerBound = Math.min(incomingLowerBound, this.listOfNumbers[lowerIntersectingBoundIndex][0]);
    newUpperBound = Math.max(incomingUpperBound, this.listOfNumbers[upperIntersectionBoundIndex][1]);
    var newRange = [newLowerBound, newUpperBound];

    // This range should now replace the first entry of the series of elements whose direction is depcited by a 0
    this.listOfNumbers[lowerIntersectingBoundIndex] = newRange;

    // Now must delete all elements from [lowerIntersectingBoundIndex+1 ... upperIntersectingBoundIndex]
    // A.k.a, delete all the FULLY CONSUMED overlaps in the direction list
    for(var i=upperIntersectionBoundIndex; i >= lowerIntersectingBoundIndex+1; i--) {
      this.listOfNumbers.splice(i, 1);
    }
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

    // SPECIAL CASES:- Contradiction [x,x) and empty rangeList: Do nothing
    if(incomingLowerBound == incomingUpperBound || this.listOfNumbers.length == 0) {
      return;
    }
    
    // Get direction list for existing ranges, as we did for the add operation as well
    var directionList = [];
    for(var i=0; i<this.listOfNumbers.length; i++) {
      directionList.push(this.getDirection(incomingLowerBound, incomingUpperBound, this.listOfNumbers[i]))
    }


    /* TRIVIAL CASE:-
    ** This means that inbound interval is either to the extreme left of existing intervals
    ** Or extreme right
    ** In both cases, there is no interval to delete. So we do nothing
    */
    if(directionList[0] == -2 || directionList[directionList.length - 1] == 2) {
      return;
    }

    /* ENCOMPASSING CASE:- Check case where incoming bounds force deletion of all existing bounds
    *  ie, if directionList if filled with 0s
    */
    var isFilledWithZeros = true;
    for(var i=0;i<directionList.length; i++) {
      if(directionList[i] != 0) {
        isFilledWithZeros = false;
      } 
    }
    // This signifies that the inbound interval encompasses all existing intervals
    if(isFilledWithZeros) {
      this.listOfNumbers = [];
      return;
    }

    // Now to account for the cases where the inbound interval overlaps at least 1 existing interval
    // AS an example, if the current RangeList is [[1,5], [10,21]] and the range to remove is [15,17]
    // It should then split to [[1,5] [10,15], [15,21]]
    // ANOTHER EXAMPLE:- What if incoming range was [8,13] ==> [[1,5][13,21]]
    // This is where the fully consumed scenario takes place
    // Now to account for the case where the inbound interval to delete is not at the ends, but 
    // somewhere in between, yet not fully captured
    // Example [1,5] [10-21] -> remove ([7,9]) should do nothing since that interval doesn't exist
    
    /* These checks cover 2 cases
    *  Case 1: When incoming interval perfectly fits between two existing intervals WITHOUT overlap,
    *          Thus not requiring any deletion to occur
    *  Case 2: When incoming interval IS FULLY CONSUMED by existing interval. This situation dictactes that
    *          the consuming interval be split into two fresh separate intervals 
    */
    for(var i=0; i<directionList.length; i++) {
      // This checks for empty non-existent intervals that don't require any actual deletion
      if(directionList[Math.max(i-1,0)] == 2 && directionList[i] == -2) {
        return;
      }

      var currentLowerBound = this.listOfNumbers[i][0];
      var currentUpperBound = this.listOfNumbers[i][1];

      /* Signifying total consumption overlap
      ** Making sure that this only takes into account overlapping intervals between intervals without overlap
      ** This splits the existing interval into 2 intervals
      */
      if(directionList[i] == 0 && directionList[Math.max(0, i-1)] == 2 
        && directionList[Math.min(i+1, directionList.length-1)] == -2) {
        var range1 = [this.listOfNumbers[i][0], incomingLowerBound];
        var range2 = [incomingUpperBound, this.listOfNumbers[i][1]];
        this.listOfNumbers.splice(i, 1, range1, range2);
        return;
      }
    }

    /* These checks cover 1 big case
    *  Case 3: When incoming interval partially overlaps with existing interval on either end
    *          In this case, we have to remove any fully consumed intervals in between as well
    *          since the inbound interval to remove encompasses it
    */
    var lowerIntersectionBoundIndex = -1;
    var upperIntersectionBoundIndex = -1;
    // Now we account for partial cases
    for(var i=0;i<directionList.length; i++) {
      // Signifying partial overlap
      if(directionList[i] == 1 || directionList[i] == -1) {
        // Find out where the partial overlap is happening  
        if(directionList[i] == 1) {
          lowerIntersectionBoundIndex = i;
        }
        if(directionList[i] == -1) {
          upperIntersectionBoundIndex = i;
        }
      }
    }

    // If the lower intersection bound was not found, then it means that there were no partial overlaps!
    if(lowerIntersectionBoundIndex == -1) {
      return;
    }

    /* If the upper intersection bound was not found, then it means that the lower-bound interval is all that 
    ** needs modifiction
    */
    if(upperIntersectionBoundIndex == -1) {
      this.listOfNumbers[lowerIntersectionBoundIndex][1] = incomingLowerBound;
    }
    /* If the upper intersection bound was found, then it means we have two bound-values to replace 
    ** in two specific bounds
    ** The bound with the right-end overlap and the bound with the left-end overlap
    */
    else {
      this.listOfNumbers[lowerIntersectionBoundIndex][1] = incomingLowerBound;
      this.listOfNumbers[upperIntersectionBoundIndex][0] = incomingUpperBound;

      /* Finally, in this case, we delete all fully consumed intervals in between 
      ** These intervals are signified by a 0
      */
      for(var i=0; i<directionList.length; i++) {
        if(directionList[i] == 0) {
          this.listOfNumbers.splice(i, 1);
        }
      }

      /* The last check we do is to remove contradictory intervals
      ** For example, an interval like [11,11) is a contradiction. We hence remove it
      */
      for(var i=0; i<this.listOfNumbers.length; i++) {
        if(this.listOfNumbers[i][0] == this.listOfNumbers[i][1]) {
          this.listOfNumbers.splice(i, 1);
        }
      }
    }
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

// Make rangelist available to export
module.exports = {
  rangeList: RangeList
};

