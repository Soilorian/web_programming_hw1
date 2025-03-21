# توضیح کد جاوااسکریپت ماشین حساب

در اینجا کد جاوااسکریپت یک ماشین حساب را توضیح می‌دهیم که فرمول‌هایی که شامل متغیرها و عملگرها هستند پردازش می‌شود. در این کد، از برخی ویژگی‌های DOM برای دریافت ورودی و اعمال عملیات ریاضی استفاده شده است.

## 1. تعریف عملگرها

```js
operators = ["^", "@", "*", "/", "+", "-"]
```

در ابتدا، یک آرایه `operators` تعریف می‌شود که شامل عملگرهایی مانند توان (`^`)، ریشه (`@`)، ضرب (`*`)، تقسیم (`/`)، جمع (`+`)، و تفریق (`-`) است. این عملگرها در فرمول‌ها برای محاسبات ریاضی استفاده خواهند شد. همچنین از پرانتز نیز در فرمول پشتیبانی می‌شود و ترتیب اولویت‌ها نیز رعایت شده‌است.

## 2. اضافه کردن لیسنر به DOM پس از بارگذاری صفحه

```js
document.addEventListener("DOMContentLoaded", function () {
    const formulas = document.getElementsByTagName("formula")
    if (formulas.length === 0) {
        console.error("No formula elements found.")
        return
    }
    let element = formulas[0]
    let evaluator = element.getAttribute("evaluator")
    
    if (!evaluator) {
        console.error("Evaluator attribute is missing in formula element.")
        return
    }
```

در این قسمت، یک رویداد `DOMContentLoaded` تعریف شده که بعد از بارگذاری کامل صفحه اجرا می‌شود. این کد به دنبال برچسب‌های `<formula>` در HTML می‌گردد و در صورتی که چنین برچسبی وجود نداشته باشد، خطا را در کنسول نمایش می‌دهد.

## 3. بررسی و تجزیه فرمول

```js
    let argumentsAndOperators = evaluator.match(/[a-zA-Z0-9_]+|[*/+\-()^@]/g)
    console.log("the formula is ", argumentsAndOperators)

    if (!argumentsAndOperators) {
        console.error("Invalid formula syntax.")
        return
    }
```

در این بخش، فرمول استخراج شده از ویژگی `evaluator` تجزیه می‌شود تا متغیرها و عملگرهای آن شناسایی شوند. اگر فرمول صحیح نباشد، خطا نمایش داده می‌شود.

## 4. بررسی صحت فرمول

```js
    for (let [index, argOrOp] of argumentsAndOperators.entries()) {
        if (document.getElementById(argOrOp) != null) {
            if (argumentsAndOperators[index + 1] != undefined && !operators.find((element) => argumentsAndOperators[index + 1] === element)) {
                console.log("invalid formula syntax ", argOrOp, argumentsAndOperators[index + 1])
            } else {
                continue
            }
        } else if (operators.find((element) => argOrOp === element)) {
            if (argumentsAndOperators[index + 1] != undefined && operators.find((element) => argumentsAndOperators[index + 1] === element)) {
                console.log("invalid formula syntax ", argOrOp, argumentsAndOperators[index + 1])
            } else if (index === 0) {
                console.log("formula can not be started with an operand")
            } else {
                continue
            }
        } else if (argOrOp === '(' || argOrOp === ')') {
            if (argumentsAndOperators[index + 1] != undefined && operators.find((element) => argumentsAndOperators[index + 1] === element) && argOrOp === '(') {
                console.log("invalid formula syntax ", argOrOp, argumentsAndOperators[index + 1])
            } else if (argumentsAndOperators[index + 1] != undefined && !operators.find((element) => argumentsAndOperators[index + 1] === element) && argOrOp === ')') {   
                console.log("invalid formula syntax ", argOrOp, argumentsAndOperators[index + 1])
            } else {
                continue
            }
        } else {
            console.error("Invalid elemnt ", argOrOp, " in formula")
            return
        }
    }

    console.log("successfully validated entries")
    let calculator = new Calculator(argumentsAndOperators)

    console.log("constructed the calculator")
    const resultOutput = document.getElementById("resultOutput")
    if (!resultOutput) {
        console.error("Output element not found.")
        return
    }

    calculator.addListenerAndSetOutput(resultOutput)
    console.log("added input listeners, ready for calculation")
})
```

در این بخش، صحت فرمول بررسی می‌شود. در صورتی که فرمول دارای اشتباهاتی باشد (مثل قرار دادن عملگرها به طور نادرست یا شروع فرمول با عملگر)، خطا در کنسول چاپ می‌شود. در نهایت، یک نمونه از کلاس `Calculator` ساخته می‌شود و ورودی‌های آن به یک عنصر خروجی متصل می‌شود.

## 5. تعریف کلاس Calculator

```js
class Calculator {
    constructor(formula) {
        this.formula = formula
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
        console.log("start ", formula, " for ", values)
        while (formula.includes("(")) {
            let openIndex = -1
            let closeIndex = -1
            
            for (let i = 0; i < formula.length; i++) {
                if (formula[i] === "(") openIndex = i
                if (formula[i] === ")" && openIndex !== -1) {
                    closeIndex = i
                    break
                }
            }
            
            if (openIndex === -1 || closeIndex === -1) {
                console.error("Mismatched parentheses.")
                return null
            }
            
            let innerExpression = formula.slice(openIndex + 1, closeIndex)
            let innerResult = this.constructFormula(innerExpression, values)
            formula.splice(openIndex, closeIndex - openIndex + 1, innerResult)
            console.log("after ()", formula)
        }
        
        
        for (let op of operators) {
            while (formula.includes(op)) {
                let index = formula.indexOf(op)
                let left = values.get(formula[index - 1])
                if (left == null) {
                    left = formula[index - 1]
                }
                let right = values.get(formula[index + 1])
                if (right == null) {
                    right = formula[index + 1]
                }
                let result
                
                switch (op) {
                    case "^": result = Math.pow(left, right); break
                    case "@": result = Math.pow(left, 1/right); break
                    case "*": result = left * right; break
                    case "/": result = left / right; break
                    case "+": result = left + right; break
                    case "-": result = left - right; break
                    default: console.error("Unknown operator: " + op); return null
                }
                console.log(index, left, op, right, " = ", result)
                
                formula.splice(index - 1, 3, result)
                console.log(formula)
            }
        }        
        return formula[0]
    }

    addListenerAndSetOutput(output) {
        for (let elemntId of this.ids) {
            let element = document.getElementById(elemntId)
            element.addEventListener("input", () => {
                this.elementIdToValue.set(element.id, parseFloat(element.value) || 0)
                output.value = this.calculate(this.elementIdToValue)
            })
        }
    }
    
    calculate(values) {
        console.log("calculating new formula for ", values)
        return this.constructFormula([...this.formula], values)
    }
}
```

کلاس `Calculator` مسئول پردازش فرمول‌های ریاضی است. این کلاس متغیرها و عملگرها را شناسایی کرده و سپس عملیات مربوطه را به ترتیب در فرمول اعمال می‌کند. همچنین، با استفاده از رویدادهای `input`، ورودی‌های کاربر را گرفته و نتیجه را محاسبه می‌کند.
این محاسبه به صورت `pass by reference` در یک مپ در کلاس `Calculator` صورت می‌گیرد و با تغییر مقدار هر `input`، مقدار متناظر با آن در مپ نیز آپدیت می‌شود.

# تست‌ها
برای بررسی عملکرد این ماشین حساب، سه صفحه‌ی `HTML` هرکدام برای یک محاسبه طراحی شده‌اند.

### تست اول

تست اول مربوط به یک ماشین حساب برای حساب کردن سود یا ضرر پس از یک معامله‌ی رمزارزی است. در این صفحه، تعداد سهم خریداری شده و قیمت خرید و فروش آن سهم را وارد می‌کنید و نتیجه‌ی آن را در خروجی می‌بینید.

#### نکات خاص

جعبه‌ی خروجی با توجه به عدد سود یا ضرر به رنگ‌های قرمز و سبز تغییر می‌کند.

در پس‌زمینه، یک نمودار مثل نمودار بورس در حال حرکت است.

طراحی `responsive` است و دو حالت مختلف بر اساس اندازه‌ی صفحه دارد.

### تست دوم

این تست مربوط به یک ماشین‌حساب برای محاسبه‌ی نیروز جنگی در بازی 
`clash of clans` 
هستش. تعداد یک نیرو را می‌گیرد به همراه لول و قدرت آن نیرو و آن را با لول و قدرت معجون خشم ترکیب می‌کند و اگر حریف معجون سم نیز داشته باشد، به همان میزان از نیرو کم می‌کند.

#### نکات خاص

صفحه با یک انیمیشن لود می‌شود.

موسیقی پس‌زمینه در صفحه موجود است.

طراحی `responsive` است و سه حالت مختلف بر اساس اندازه‌ی صفحه دارد.

### تست سوم

این تست مربوط به حل یک معادله و به دست آوردن `x` است. در این تست شما می‌توانید معادله‌ای به فرم
$$ ax^b + c = d $$
را حل کنید، در صورت قابل حل نبودن معادله، جوابی چاپ نمی‌شود.

#### نکات خاص

این صفحه دارای تم سیاه و سفید است.

طراحی `responsive` است و سه حالت مختلف بر اساس اندازه‌ی صفحه دارد.