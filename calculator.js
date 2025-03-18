document.addEventListener("DOMContentLoaded", function () {
    const formulas = document.getElementsByTagName("formula");
    let element = formulas[0]
    let evaluator = element.getAttribute("evaluator")
    let argumentsAndOperators = evaluator.match(/[a-zA-Z0-9_]+|[*/+\-()]/g);
    let result = constructFormula(argumentsAndOperators)
    const resultOutput = document.getElementById("resultOutput");

    numberInput.addEventListener("input", function () {
    let inputValue = parseFloat(numberInput.value) || 0;
    resultOutput.value = inputValue * 2;
    });
});

function constructFormula(formula) {
    if (formula.filter('(').size > 0) {
        // parantesis is recersive
        // replace the biggest parantesis with the result of calling this function and the list inside parantesis
        // for each parantesis
    }

    if (formula.filter('^, @')) {
        // first power and root
        // for each set, calculate the value and place the value in the place of operator and operands
    }

    if (formula.filter('*, /')) {
        // then multiplication and division
        // for each set, calculate and place the value and place the value in the place of operator and operands
    }

    // calculate the rest and return the result
}
