operators = ["^", "@", "*", "/", "+", "-"];


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
    console.log("the formula is ", argumentsAndOperators)

    if (!argumentsAndOperators) {
        console.error("Invalid formula syntax.");
        return;
    }

    for (let argOrOp of argumentsAndOperators) {
        if (document.getElementById(argOrOp) != null) {
            continue;
        } else if (operators.find((element) => argOrOp === element)) {
            continue;
        } else if (argOrOp === '(' || argOrOp === ')') {
            continue;
        } else {
            console.error("Invalid elemnt ", argOrOp);
            return;
        }
    }

    console.log("successfully validated entries")
    let calculator = new Calculator(argumentsAndOperators);

    console.log("constructed the calculator")
    const resultOutput = document.getElementById("resultOutput");
    if (!resultOutput) {
        console.error("Output element not found.");
        return;
    }

    calculator.addListenerAndSetOutput(resultOutput);
    console.log("added input listeners, ready for calculation")
});

class Calculator {
    constructor(formula) {
        this.formula = formula;
        this.ids = formula.filter((element) => {
            return !(operators.includes(element) || element === '(' || element === ')')
        })
        console.log("elemnt ids are ", this.ids)

        this.elementIdToValue = new Map()
        for (let elementId of this.ids) {
            this.elementIdToValue.set(elementId, 0)
        }
    }
    
    constructFormula(formula, values) {
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
        
        
        for (let op of operators) {
            while (formula.includes(op)) {
                let index = formula.indexOf(op);
                let left = values.get(formula[index - 1]) || formula[index + 1] || 0;
                let right = values.get(formula[index + 1]) || formula[index + 1] || 0;
                let result;
                
                switch (op) {
                    case "^": result = Math.pow(left, right); break;
                    case "@": result = Math.pow(left, 1/right); break;
                    case "*": result = left * right; break;
                    case "/": result = left / right; break;
                    case "+": result = left + right; break;
                    case "-": result = left - right; break;
                    default: console.error("Unknown operator: " + op); return null;
                }
                console.log(index, left, op, right, " = ", result)
                
                formula.splice(index - 1, 3, result);
                console.log(formula)
            }
        }        
        return formula[0];
    }

    addListenerAndSetOutput(output) {
        for (let elemntId of this.ids) {
            let element = document.getElementById(elemntId);
            element.addEventListener("input", () => {
                this.elementIdToValue.set(element.id, parseFloat(element.value) || 0);
                output.value = this.calculate(this.elementIdToValue);
            })
        }
    }
    
    calculate(values) {
        console.log("calculating new formula for ", values)
        return this.constructFormula([...this.formula], values);
    }
}
