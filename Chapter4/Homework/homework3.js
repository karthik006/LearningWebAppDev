var main = function () {
   "use strict";
    
    function exercise1(exercise1Array) {

        var sum = 0,
            average = 0;

        exercise1Array.forEach(function (elements) {
            sum = sum + elements;
        });
        average = sum / exercise1Array.length;
        return average;
    }

    function exercise2(exercise2Array) {

        var firstIndex = exercise2Array[0];

        exercise2Array.forEach(function (elements) {
            if (elements > firstIndex) {
                firstIndex = elements;
            }
        });

        return firstIndex;
    }


    function exercise3(exercise3Array) {

        var index = false;

        exercise3Array.forEach(function (elements) {
            if (elements % 2 === 0) {
                index = true;
                return index;
            }
        });

        return index;
    }


    function exercise4(exercise4Array) {

        var index = true;



        exercise4Array.forEach(function (elements) {
            if (elements % 2 !== 0) {
                index = false;
                return index;
            }
        });

        return index;
    }

    function arrayContains(arrayStrings, string) {
        var boolean = false;
        arrayStrings.forEach(function (elements) {
            if (elements === string) {
                boolean = true;
                return boolean;
            }
        });
        return boolean;
    }


    function arrayContainsTwo(arrayStrings, string) {
        var boolean = false,
            count = 0;
        arrayStrings.forEach(function (elements) {
            if (elements === string) {
                count = count + 1;
                if (count === 2) {
                    boolean = true;
                    return boolean;
                }
            }
        });
        return boolean;
    }

    function arrayContainsThree(arrayStrings, string) {
        var boolean = false,
            count = 0;
        arrayStrings.forEach(function (elements) {
            if (elements === string) {
                count = count + 1;
                if (count === 3) {
                    boolean = true;
                    return boolean;
                }
            }
        });
        return boolean;
    }

    function arrayContainsNTimes(arrayStrings, string, n) {
        var boolean = false,
            count = 0;
        arrayStrings.forEach(function (elements) {
            if (elements === string) {
                count = count + 1;
                if (count === n) {
                    boolean = true;
                    return boolean;
                }
            }
        });
        return boolean;
    }

    function underExercise2(exercise2Array) {

        var l;

        l = _.max(exercise2Array);

        return l;
    }


    function underExercise3(exercise3Array) {

        var l;

        l = _.some(exercise3Array, function (elements) {
            return elements % 2 === 0;
        });

        return l;
    }


    function underExercise4(exercise4Array) {
        var l;

        l = _.every(exercise4Array, function (elements) {
            return elements % 2 === 0;
        });

        return l;

    }

    document.getElementById("exercise1").innerHTML = exercise1([1, 2, 3, 4]);
    document.getElementById("exercise2").innerHTML = exercise2([1, 2, 3, 4]);
    document.getElementById("exercise3").innerHTML = exercise3([1, 2, 3, 4]);
    document.getElementById("exercise4").innerHTML = exercise4([1, 2, 3, 4]);
    document.getElementById("exercise5").innerHTML = arrayContains(["hello", "world"], "hello");
    document.getElementById("exercise6").innerHTML = arrayContainsTwo(["a", "b", "c", "d"], "a");
    document.getElementById("exercise7").innerHTML = arrayContainsThree(["a", "b", "c", "d", "a", "a"], "a");
    document.getElementById("exercise8").innerHTML = arrayContainsNTimes(["a", "b", "c", "d", "a"], "a", 2);
    document.getElementById("exercise9").innerHTML = underExercise2([1, 2, 3, 4]);
    document.getElementById("exercise10").innerHTML = underExercise3([1, 2, 3, 4]);
    document.getElementById("exercise11").innerHTML = underExercise4([4, 2, 6, 8]);
};
$(document).ready(main);
