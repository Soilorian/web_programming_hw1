document.addEventListener("DOMContentLoaded", function () {
    const formulas = document.getElementsByTagName("formula");
    if (formulas.length === 0) {
        console.error("No formula elements found.");
        return;
    }
    
    let element = formulas[0];
    let evaluator = element.getAttribute("evaluator");
    
    if (!evaluator) {
        console.error("Evaluator attribute is missing in formula element.");
        return;
    }
    
    let argumentsAndOperators = evaluator.match(/[a-zA-Z0-9_]+|[*/+\-()^@]/g);
    if (!argumentsAndOperators) {
        console.error("Invalid formula syntax.");
        return;
    }
    
    let calculator = new Calculator(argumentsAndOperators);
    const resultOutput = document.getElementById("resultOutput");
    calculator.addListenerAndSetOutput(resultOutput);
});

class Calculator {
    constructor(formula) {
        this.formula = formula;
    }
    
    constructFormula(formula) {
        while (formula.includes("(")) {
            let openIndex = -1;
            let closeIndex = -1;
            
            for (let i = 0; i < formula.length; i++) {
                if (formula[i] === "(") openIndex = i;
                if (formula[i] === ")" && openIndex !== -1) {
                    closeIndex = i;
                    break;
                }
            }
            
            if (openIndex === -1 || closeIndex === -1) {
                console.error("Mismatched parentheses.");
                return null;
            }
            
            let innerExpression = formula.slice(openIndex + 1, closeIndex);
            let innerResult = this.constructFormula(innerExpression);
            formula.splice(openIndex, closeIndex - openIndex + 1, innerResult);
        }
        
        let operators = ["^", "@", "*", "/", "+", "-"];
        
        for (let op of operators) {
            while (formula.includes(op)) {
                let index = formula.indexOf(op);
                let left = parseFloat(formula[index - 1]);
                let right = parseFloat(formula[index + 1]);
                let result;
                
                switch (op) {
                    case "^": result = Math.pow(left, right); break;
                    case "@": result = Math.sqrt(left); break;
                    case "*": result = left * right; break;
                    case "/": result = left / right; break;
                    case "+": result = left + right; break;
                    case "-": result = left - right; break;
                    default: console.error("Unknown operator: " + op); return null;
                }
                
                formula.splice(index - 1, 3, result);
            }
        }
        return formula[0];
    }

    addListenerAndSetOutput(output) {
        if (!output) {
            console.error("Output element not found.");
            return;
        }
        
        output.addEventListener("change", () => {
            output.textContent = this.calculate();
        });
        output.textContent = this.calculate();
    }
    
    calculate() {
        return this.constructFormula([...this.formula]);
    }
}
