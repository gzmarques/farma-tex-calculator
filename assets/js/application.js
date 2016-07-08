// Get all the keys from document
var keys = document.querySelectorAll('#calculator span');
var operators = ['+', '-', '*', '/'];
var decimalAdded = false;

// Add onclick event to all the keys and perform operations
for(var i = 0; i < keys.length; i++) {

	keys[i].onclick = function(e) {

    //Get all TeX already generated
    var tex = null;
    tex = MathJax.Hub.getAllJax("MathOutput")[0];

		// Get the input and button values
		var input = document.querySelector('.screen');
		var inputVal = input.value;
		var btnVal = $(this).attr('value');

		// Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
		// If clear key is pressed, erase everything
		if(btnVal == 'C') {
			input.value = '';
			decimalAdded = false;
      return MathJax.Hub.queue.Push(["Text",tex,""]);
		}

		// If eval key is pressed, calculate and display the result
		else if(btnVal == '=') {

			var equation = inputVal.toString();
			var lastChar = equation[equation.length - 1];

			// Replace all instances of x and ÷ with * and / respectively. This can be done easily using regex and the 'g' tag which will replace all instances of the matched character/substring
			//equation = equation.replace(/x/g, '*').replace(/÷/g, '/');

			// Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
			if(operators.indexOf(lastChar) > -1 || lastChar == '.')
				equation = equation.replace(/.$/, '');

      if(equation.indexOf('\\sqrt') > -1) {
        equation = equation.replace(/\\sqrt/, "sqrt(");
        equation += ')';
      }

      equation = equation.replace(/\\over/, '/');
      equation = equation.replace(/{/, '(');
      equation = equation.replace(/}/, ')');


			if(equation){
				input.value = math.compile(equation).eval();
        console.log(equation + " = " + input.value);
      }

			decimalAdded = false;
		}

		// indexOf works only in IE9+
		else if(operators.indexOf(btnVal) > -1) {
			// Operator is clicked
			// Get the last character from the equation
			var lastChar = inputVal[inputVal.length - 1];

			// Only add operator if input is not empty and there is no operator at the last
			if(inputVal != '' && operators.indexOf(lastChar) == -1)
				input.value += btnVal;

			// Allow minus if the string is empty
			else if(inputVal == '' && btnVal == '-')
				input.value += btnVal;

			// Replace the last operator (if exists) with the newly pressed operator
			if(operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
				// Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
				input.value = inputVal.replace(/.$/, btnVal);
			}

			decimalAdded =false;
		}

		// Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval or clear key is pressed.
		else if(btnVal == '.') {
			if(!decimalAdded) {
				input.value += btnVal;
				decimalAdded = true;
			}
		}

    // else if(btnVal == "\\over")
      // input.value = "{"+input.value+btnVal+"";

		// if any other key is pressed, just append it
		else
			input.value += btnVal;

    // Updates MathJax display
    MathJax.Hub.queue.Push(["Text",tex,"\\displaystyle{"+input.value+"}"]);

		// prevent page jumps
		e.preventDefault();



	}
}
