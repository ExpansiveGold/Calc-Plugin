// +----------------------+
// | variable declaration |
// +----------------------+

const numberButtons = document.querySelectorAll('[data-number]')
const NumButtons = [...numberButtons]

const operationButtons = document.querySelectorAll('[data-operation]')
const OpButtons = [...operationButtons]

const OpenBracketBtn = document.querySelector('[data-OpenBrackets]')
const CloseBracketBtn = document.querySelector('[data-CloseBrackets]')

const equalsBtn = document.querySelector('[data-equals]')
const deleteBtn = document.querySelector('[data-delete]')
const clearBtn = document.querySelector('[data-clear]')

const subDisplay = document.querySelector('[data-previous-operand]')
const mainDisplay = document.querySelector('[data-current-operand]')

const stack = []
const stateStack = []
var display = []

var state = 0
var openBrackets = 0
var currentTemp = ''
var displayNumber = '0'
var lastIsClosed = false
var UnaryOperation = false
var logOpen = 0

var operandOne
var selectedOperation
var operandTwo

var lastValue

// +----------------------------+
// | variable declaration - end |
// +----------------------------+



// +-------------+
// | clear logic |
// +-------------+

// clear array that manages on hold operation
function clearStack() {

    let i = stack.length
    do {
        stack.pop()
        i--
    }
    while (i === stack.length && i !== 0)
}

// clear array that stores the last state
function clearStateStack() {

    let i = stateStack.length
    do {
        stateStack.pop()
        i--
    }
    while (i === stateStack.length && i !== 0)
}

// clear array that stores what will be on subdisplay
function clearDisplay() {

    let i = display.length
    do {
        display.pop()
        i--
    }
    while (i === display.length && i !== 0)
}

// reset all variables and clear display
function clear() {
    state = 0
    openBrackets = 0
    lastIsClosed = false
    displayNumber = '0'
    UnaryOperation = false
    logOpen = 0
    clearStack()
    clearStateStack()
    clearDisplay()
    updMainDisplay()
    updSubDisplay()
}

// erase last digit on main display
function erase() {
    // if (mainDisplay.innerText === 'Infinity' || mainDisplay.innerText === '-Infinity' || mainDisplay.innerText === 'NaN') return
    let number = displayNumber.toString()
    let slice = number.slice(0, number.length - 1)
    if (number === '-Infinity' || number === 'Infinity') {
        clear()
        slice = ''
    }
    if (slice === '') {
        slice = '0'
    }
    displayNumber = slice
    updMainDisplay()
}


// +-------------------+
// | clear logic - end |
// +-------------------+



// +-----------------+
// | operation logic |
// +-----------------+

function appendNumber(number) {
    // if the operation ended reset the variables
    if (display[display.length - 1] === '=' || mainDisplay.innerText === '-Infinity' || mainDisplay.innerText === 'Infinity') {
        clear()
    }
    // last oeperation is unary go back to state 2
    // because the way appendNumber is implemented this 'if' execute the state 2 case
    if (UnaryOperation === true) {
        UnaryOperation = false
        displayNumber = ''
        display.pop()
        updSubDisplay()
    }
    // if the number already has a decimal, return
    if (number === '.' && displayNumber.includes('.')) return
    // if display is empty or has an special number, "Pi, e, Infinity", clearing display prevent '0' or 'Infinity' from preceding the actual number
    if (displayNumber === '0' && number !== '.' || displayNumber == Math.PI || displayNumber == Math.E) {
        displayNumber = ''
    }
    // display case for 'Pi'
    if (number === 'π') {
        displayNumber = Math.PI
        updSubDisplay()
        updMainDisplay()
    } else if (number === 'e') {  // display case for 'e'
        displayNumber = Math.E
        updSubDisplay()
        updMainDisplay()
    } else {  // display case for common number
        displayNumber = displayNumber + number.toString();
    }
    // if '.' is pressed add directly to display so the variable that stores the number 
    // don't assumes that the first decimal is '0'
    if (number === '.') {
        mainDisplay.innerText = mainDisplay.innerText + number.toString();
    } else {  // update only if isn't '.' for the reason above
        updMainDisplay()
    }
    console.log(lastIsClosed, 'state stack:', stateStack, 'state:', state, 'stack:', stack, 'display:', display, 'o1:', operandOne, 'op:', selectedOperation, 'o2:', operandTwo)
}

function operation(operation) {
    // case for unary operations
    switch (operation) {
        case 'sqrd':
            if (lastIsClosed === true) { 
                if (state === 2 || state === 3) {
                    displayNumber = operandTwo
                    operandTwo = operandTwo ** 2

                } else {
                    displayNumber = operandOne
                    operandOne = operandOne ** 2
                }

                let parentheses = display[display.length - 1].toString()
                display.pop()

                do {
                    parentheses = display[display.length - 1].toString() + ' ' + parentheses
                    display.pop()
                }
                while (display[display.length - 1] !== '(')

                parentheses = display[display.length - 1].toString() + ' ' + parentheses
                display.pop()

                display.push(parentheses + ' ^ 2')

                UnaryOperation = true

            } 
            else if (state >= 2 && UnaryOperation === true) { 
                operandTwo = operandTwo ** 2
                display[display.length - 1] = '( ' + display[display.length - 1] + ' ) ^ 2'

            } else if (state >= 2 && UnaryOperation === false) { 
                operandTwo = operandTwo ** 2
                display.push('( ' + mainDisplay.innerText + ' ) ^ 2')
                UnaryOperation = true

            } else if (state < 2 && UnaryOperation === true) { 
                operandOne = operandOne ** 2
                display[display.length - 1] = '( ' + display[display.length - 1] + ' ) ^ 2'
                state = 0

            } else if (state < 2 && UnaryOperation === false) { 
                operandOne = operandOne ** 2
                display.push('( ' + mainDisplay.innerText + ' ) ^ 2')
                UnaryOperation = true
                state = 0
            }

            if (operandOne == 'Infinity' || operandTwo == 'Infinity') {
                state = 4
                mainDisplay.innerText = 'Infinity'
                updSubDisplay()
                return
            }

            lastIsClosed = false
            displayNumber = displayNumber ** 2
            updSubDisplay()
            updMainDisplay()
            
            return

        case 'oneOverX':
            if (lastIsClosed === true) {

                if (state === 2 || state === 3) {
                    displayNumber = operandTwo
                    operandTwo = 1 / operandTwo

                } else {
                    displayNumber = operandOne
                    operandOne = 1 / operandOne
                }

                let parentheses = display[display.length - 1].toString()
                display.pop()

                do {
                    parentheses = display[display.length - 1].toString() + ' ' + parentheses
                    display.pop()
                }
                while (display[display.length - 1] !== '(')

                parentheses = display[display.length - 1].toString() + ' ' + parentheses
                display.pop()

                display.push('1 / ' + parentheses)

                UnaryOperation = true

            } else if (state >= 2 && UnaryOperation === true) {
                operandTwo = 1 / operandTwo
                display[display.length - 1] = '1 / ' + display[display.length - 1]

            } else if (state >= 2 && UnaryOperation === false) {
                operandTwo = 1 / operandTwo
                display.push('1 / ' + mainDisplay.innerText)
                UnaryOperation = true

            } else if (state < 2 && UnaryOperation === true) {
                operandOne = 1 / operandOne
                display[display.length - 1] = '1 / ' + display[display.length - 1]
                state = 0

            } else if (state < 2 && UnaryOperation === false) {
                operandOne = 1 / operandOne
                display.push('1 / ' + mainDisplay.innerText)
                UnaryOperation = true
                state = 0
            }

            lastIsClosed = false
            displayNumber = 1 / displayNumber
            updSubDisplay()
            updMainDisplay()
            
            return

        case 'sin':
            if (lastIsClosed === true) {

                if (state === 2 || state === 3) {
                    displayNumber = operandTwo
                    operandTwo = Math.sin(operandTwo)

                } else {
                    displayNumber = operandOne
                    operandOne = Math.sin(operandOne)
                }

                let parentheses = display[display.length - 1].toString()
                display.pop()

                do {
                    parentheses = display[display.length - 1].toString() + ' ' + parentheses
                    display.pop()
                }
                while (display[display.length - 1] !== '(')

                parentheses = display[display.length - 1].toString() + ' ' + parentheses
                display.pop()

                display.push('sin' + parentheses)

                UnaryOperation = true

            } else if (state >= 2 && UnaryOperation === true) {
                operandTwo = Math.sin(operandTwo)
                display[display.length - 1] = 'sin( ' + display[display.length - 1] + ' )'

            } else if (state >= 2 && UnaryOperation === false) {
                operandTwo = Math.sin(operandTwo)
                display.push('sin( ' + mainDisplay.innerText + ' )' )
                UnaryOperation = true

            } else if (state < 2 && UnaryOperation === true) {
                operandOne = Math.sin(operandOne)
                display[display.length - 1] = 'sin( ' + display[display.length - 1] + ' )'
                state = 0

            } else if (state < 2 && UnaryOperation === false) {
                operandOne = Math.sin(operandOne)
                display.push('sin( ' + mainDisplay.innerText + ' )' )
                UnaryOperation = true
                state = 0
            }

            lastIsClosed = false
            displayNumber = Math.sin(displayNumber)
            updSubDisplay()
            updMainDisplay()
            return

        case 'cos':
            if (lastIsClosed === true) {

                if (state === 2 || state === 3) {
                    displayNumber = operandTwo
                    operandTwo = Math.cos(operandTwo)

                } else {
                    displayNumber = operandOne
                    operandOne = Math.cos(operandOne)
                }

                let parentheses = display[display.length - 1].toString()
                display.pop()

                do {
                    parentheses = display[display.length - 1].toString() + ' ' + parentheses
                    display.pop()
                }
                while (display[display.length - 1] !== '(')

                parentheses = display[display.length - 1].toString() + ' ' + parentheses
                display.pop()

                display.push('cos' + parentheses)

                UnaryOperation = true

            } else if (state >= 2 && UnaryOperation === true) {
                operandTwo = Math.cos(operandTwo)
                display[display.length - 1] = 'cos( ' + display[display.length - 1] + ' )'

            } else if (state >= 2 && UnaryOperation === false) {
                operandTwo = Math.cos(operandTwo)
                display.push('cos( ' + mainDisplay.innerText + ' )' )
                UnaryOperation = true

            } else if (state < 2 && UnaryOperation === true) {
                operandOne = Math.cos(operandOne)
                display[display.length - 1] = 'cos( ' + display[display.length - 1] + ' )'
                state = 0

            } else if (state < 2 && UnaryOperation === false) {
                operandOne = Math.cos(operandOne)
                display.push('cos( ' + mainDisplay.innerText + ' )' )
                UnaryOperation = true
                state = 0
            }

            lastIsClosed = false
            displayNumber = Math.cos(displayNumber)
            updSubDisplay()
            updMainDisplay()
            return

        case 'tan':
            if (lastIsClosed === true) {

                if (state === 2 || state === 3) {
                    displayNumber = operandTwo
                    operandTwo = Math.tan(operandTwo)

                } else {
                    displayNumber = operandOne
                    operandOne = Math.tan(operandOne)
                }

                let parentheses = display[display.length - 1].toString()
                display.pop()

                do {
                    parentheses = display[display.length - 1].toString() + ' ' + parentheses
                    display.pop()
                }
                while (display[display.length - 1] !== '(')

                parentheses = display[display.length - 1].toString() + ' ' + parentheses
                display.pop()

                display.push('tan' + parentheses)

                UnaryOperation = true

            } else if (state >= 2 && UnaryOperation === true) {
                operandTwo = Math.tan(operandTwo)
                display[display.length - 1] = 'tan( ' + display[display.length - 1] + ' )'

            } else if (state >= 2 && UnaryOperation === false) {
                operandTwo = Math.tan(operandTwo)
                display.push('tan( ' + mainDisplay.innerText + ' )' )
                UnaryOperation = true

            } else if (state < 2 && UnaryOperation === true) {
                operandOne = Math.tan(operandOne)
                display[display.length - 1] = 'tan( ' + display[display.length - 1] + ' )'
                state = 0

            } else if (state < 2 && UnaryOperation === false) {
                operandOne = Math.tan(operandOne)
                display.push('tan( ' + mainDisplay.innerText + ' )' )
                UnaryOperation = true
                state = 0
            }

            lastIsClosed = false
            displayNumber = Math.tan(displayNumber)
            updSubDisplay()
            updMainDisplay()
            return

        case 'sqrRoot':

            if (state < 2 && operandOne < 0 || state > 1 && operandTwo < 0) {
                state = 4
                mainDisplay.innerText = 'Invalid Entry'
                return
            }

            if (lastIsClosed === true) {

                if (state === 2 || state === 3) {
                    displayNumber = operandTwo
                    operandTwo = Math.sqrt(operandTwo)

                } else {
                    displayNumber = operandOne
                    operandOne = Math.sqrt(operandOne)
                }

                let parentheses = display[display.length - 1].toString()
                display.pop()

                do {
                    parentheses = display[display.length - 1].toString() + ' ' + parentheses
                    display.pop()
                }
                while (display[display.length - 1] !== '(')

                parentheses = display[display.length - 1].toString() + ' ' + parentheses
                display.pop()

                display.push('√' + parentheses)

                UnaryOperation = true

            } else if (state >= 2 && UnaryOperation === true) {
                operandTwo = Math.sqrt(operandTwo)
                display[display.length - 1] = '√( ' + display[display.length - 1] + ' )'

            } else if (state >= 2 && UnaryOperation === false) {
                operandTwo = Math.sqrt(operandTwo)
                display.push('√( ' + mainDisplay.innerText + ' )')
                UnaryOperation = true

            } else if (state < 2 && UnaryOperation === true) {
                operandOne = Math.sqrt(operandOne)
                display[display.length - 1] = '√( ' + display[display.length - 1] + ' )'
                state = 0

            } else if (state < 2 && UnaryOperation === false) {
                operandOne = Math.sqrt(operandOne)
                display.push('√( ' + mainDisplay.innerText + ' )')
                UnaryOperation = true
                state = 0
            }

            lastIsClosed = false
            displayNumber = Math.sqrt(displayNumber)
            updSubDisplay()
            updMainDisplay()
            return


        case 'factorial':

            if (lastIsClosed === true) {

                if (state === 2 || state === 3) {
                    displayNumber = operandTwo
                    operandTwo = factorial(operandTwo)

                } else {
                    displayNumber = operandOne
                    operandOne = factorial(operandOne)
                }

                let parentheses = display[display.length - 1].toString()
                display.pop()

                do {
                    parentheses = display[display.length - 1].toString() + ' ' + parentheses
                    display.pop()
                }
                while (display[display.length - 1] !== '(')

                parentheses = display[display.length - 1].toString() + ' ' + parentheses
                display.pop()

                display.push(parentheses + '!')

                UnaryOperation = true

            } else if (state >= 2 && UnaryOperation === true) {
                operandTwo = factorial(operandTwo)
                display[display.length - 1] = display[display.length - 1] + '!'

            } else if (state >= 2 && UnaryOperation === false) {
                operandTwo = factorial(operandTwo)
                display.push(mainDisplay.innerText + '!')
                UnaryOperation = true

            } else if (state < 2 && UnaryOperation === true) {
                operandOne = factorial(operandOne)
                display[display.length - 1] = display[display.length - 1] + '!'

            } else if (state < 2 && UnaryOperation === false) {
                operandOne = factorial(operandOne)
                display.push(mainDisplay.innerText + '!')
                UnaryOperation = true
            }

            if (operandOne == 'Infinity' || operandTwo == 'Infinity') {
                state = 4
                mainDisplay.innerText = 'Infinity'
                updSubDisplay()
                return
            }

            lastIsClosed = false
            displayNumber = factorial(displayNumber)
            updSubDisplay()
            updMainDisplay()
            return

        case 'TenOverX':
            if (lastIsClosed === true) {

                if (state === 2 || state === 3) {
                    displayNumber = operandTwo
                    operandTwo = 10 ** operandTwo

                } else {
                    displayNumber = operandOne
                    operandOne = 10 ** operandOne
                }

                let parentheses = display[display.length - 1].toString()
                display.pop()

                do {
                    parentheses = display[display.length - 1].toString() + ' ' + parentheses
                    display.pop()
                }
                while (display[display.length - 1] !== '(')

                parentheses = display[display.length - 1].toString() + ' ' + parentheses
                display.pop()

                display.push('10 ^ ' + parentheses)

                UnaryOperation = true

            } else if (state >= 2 && UnaryOperation === true) {
                operandTwo = 10 ** operandTwo
                display[display.length - 1] = '10 ^ (' + display[display.length - 1] + ' )'

            } else if (state >= 2 && UnaryOperation === false) {
                operandTwo = 10 ** operandTwo
                display.push('10 ^ (' + mainDisplay.innerText + ' )')
                UnaryOperation = true

            } else if (state < 2 && UnaryOperation === true) {
                operandOne = 10 ** operandOne
                display[display.length - 1] = '10 ^ ( ' + display[display.length - 1] + ' )'

            } else if (state < 2 && UnaryOperation === false) {
                operandOne = 10 ** operandOne
                display.push('10 ^ ( ' + mainDisplay.innerText + ' )')
                UnaryOperation = true
            }

            if (operandOne == 'Infinity' || operandTwo == 'Infinity') {
                state = 4
                mainDisplay.innerText = 'Infinity'
                updSubDisplay()
                return
            }

            lastIsClosed = false
            displayNumber = 10 ** displayNumber
            updSubDisplay()
            updMainDisplay()
            return

        case 'log':

            if (lastIsClosed === true) {

                if (state === 2 || state === 3) {
                    displayNumber = operandTwo
                    operandTwo = Math.log10(operandTwo)

                } else {
                    displayNumber = operandOne
                    operandOne = Math.log10(operandOne)
                }

                let parentheses = display[display.length - 1].toString()
                display.pop()

                do {
                    parentheses = display[display.length - 1].toString() + ' ' + parentheses
                    display.pop()
                }
                while (display[display.length - 1] !== '(')

                parentheses = display[display.length - 1].toString() + ' ' + parentheses
                display.pop()

                display.push('log' + parentheses)

                UnaryOperation = true

            } else if (state >= 2 && UnaryOperation === true) {
                operandTwo = Math.log10(operandTwo)
                display[display.length - 1] = 'log( ' + display[display.length - 1] + ' )'

            } else if (state >= 2 && UnaryOperation === false) {
                operandTwo = Math.log10(operandTwo)
                display.push('log( ' + mainDisplay.innerText + ' )')
                UnaryOperation = true

            } else if (state < 2 && UnaryOperation === true) {
                operandOne = Math.log10(operandOne)
                display[display.length - 1] = 'log( ' + display[display.length - 1] + ' )'
                state = 0

            } else if (state < 2 && UnaryOperation === false) {
                operandOne = Math.log10(operandOne)
                display.push('log( ' + mainDisplay.innerText + ' )')
                UnaryOperation = true
                state = 0
            }
            
            if (logOpen === 2 || logOpen === 1 && mainDisplay.innerText === '-Infinity') {
                logOpen = 2
                state = 4
                mainDisplay.innerText = 'Invalid Entry'
                updSubDisplay()
                return
            } else if (operandOne == '-Infinity' || operandTwo == '-Infinity') {
                state = 4
                mainDisplay.innerText = '-Infinity'
                updSubDisplay()
                return
            } 

            lastIsClosed = false
            logOpen++
            displayNumber = Math.log10(displayNumber)
            updSubDisplay()
            updMainDisplay()
            return

        case 'logN':

            if (lastIsClosed === true) {

                if (state === 2 || state === 3) {
                    displayNumber = operandTwo
                    operandTwo = Math.log(operandTwo)

                } else {
                    displayNumber = operandOne
                    operandOne = Math.log(operandOne)
                }

                let parentheses = display[display.length - 1].toString()
                display.pop()

                do {
                    parentheses = display[display.length - 1].toString() + ' ' + parentheses
                    display.pop()
                }
                while (display[display.length - 1] !== '(')

                parentheses = display[display.length - 1].toString() + ' ' + parentheses
                display.pop()

                display.push('ln' + parentheses)

                UnaryOperation = true

            } else if (state >= 2 && UnaryOperation === true) {
                operandTwo = Math.log(operandTwo)
                display[display.length - 1] = 'ln( ' + display[display.length - 1] + ' )'

            } else if (state >= 2 && UnaryOperation === false) {
                operandTwo = Math.log(operandTwo)
                display.push('ln( ' + mainDisplay.innerText + ' )')
                UnaryOperation = true

            } else if (state < 2 && UnaryOperation === true) {
                operandOne = Math.log(operandOne)
                display[display.length - 1] = 'ln( ' + display[display.length - 1] + ' )'
                state = 0

            } else if (state < 2 && UnaryOperation === false) {
                operandOne = Math.log(operandOne)
                display.push('ln( ' + mainDisplay.innerText + ' )')
                UnaryOperation = true
                state = 0
            }
            
            if (logOpen === 2 || logOpen === 1 && mainDisplay.innerText === '-Infinity') {
                logOpen = 2
                state = 4
                mainDisplay.innerText = 'Invalid Entry'
                updSubDisplay()
                return
            } else if (operandOne == '-Infinity' || operandTwo == '-Infinity') {
                state = 4
                mainDisplay.innerText = '-Infinity'
                updSubDisplay()
                return
            }

            lastIsClosed = false
            logOpen++
            displayNumber = Math.log(displayNumber)
            updSubDisplay()
            updMainDisplay()
            return

        case 'negate':
            let op
            if (lastIsClosed === true) {    

                if (state === 2 || state === 3) {
                    displayNumber = operandTwo
                    operandTwo = -1 * operandTwo
                    op = 2

                } else {
                    displayNumber = operandOne
                    operandOne = -1 * operandTwo
                    op = 1
                }

                let parentheses = display[display.length - 1].toString()
                display.pop()

                do {
                    parentheses = display[display.length - 1].toString() + ' ' + parentheses
                    display.pop()
                }
                while (display[display.length - 1] !== '(')

                parentheses = display[display.length - 1].toString() + ' ' + parentheses
                display.pop()
                
                // console.log(parentheses[0])

                if (op === 1) {
                    if (operandOne < 0) {
                        display.push('-' + parentheses)
                    } else {
                        display.push(parentheses)
                    }
                } else {
                    if (operandTwo < 0) {
                        display.push('-' + parentheses)
                    } else {
                        display.push(parentheses)
                    }
                }

                console.log(display[display.length - 1][0])

                UnaryOperation = true

            } else if (state >= 2 && UnaryOperation === true) {
                operandTwo = -1 * operandTwo

                if (typeof display[display.length - 1] === 'string') {
                    if (display[display.length - 1][0] === '-') {
                        display[display.length - 1] = display[display.length - 1].slice(1, display[display.length - 1].length)
                    } else {
                        display[display.length - 1] = '-' + display[display.length - 1]
                    }
                } else {
                    display[display.length - 1] = -1 * mainDisplay.innerText
                    UnaryOperation = true
                }

            } else if (state >= 2 && UnaryOperation === false) {
                operandTwo = -1 * operandTwo
                display.push(-1 * mainDisplay.innerText)
                UnaryOperation = true

            } else if (state < 2 && UnaryOperation === true) {
                operandOne = -1 * operandOne

                if (typeof display[display.length - 1] === 'string') {
                    if (display[display.length - 1][0] === '-') {
                        display[display.length - 1] = display[display.length - 1].slice(1, display[display.length - 1].length)
                    } else {
                        display[display.length - 1] = '-' + display[display.length - 1]
                    }
                    console.log('b')
                } else {
                    display[display.length - 1] = -1 * mainDisplay.innerText
                    UnaryOperation = true
                    console.log('a')
                }
                state = 0

            } else if (state < 2 && UnaryOperation === false) {
                operandOne = -1 * operandOne
                display.push(-1 * mainDisplay.innerText)
                UnaryOperation = true
                state = 0
            }
            
            lastIsClosed = false
            displayNumber = -1 * displayNumber
            updSubDisplay()
            updMainDisplay()
            return

        default:  // default case is all binary operation, plus, minus, etc
            
            if (state === 3 || state === 2 && lastIsClosed === true) {
                calculate()
            }

            if (state !== 3 && UnaryOperation === false && lastIsClosed === false) {
                display.push(mainDisplay.innerText)
            }
            
            if (operation === '*') {
                display.push('×')
            } else if (operation === '/') {
                display.push('÷')
            } else if (operation === '**') {
                display.push('^')
            } else {
                display.push(operation)
            }
            
            selectedOperation = operation

            state = 2
            UnaryOperation = false
            lastIsClosed = false
            displayNumber = '0'
            updSubDisplay()
            console.log(lastIsClosed, 'state stack:', stateStack, 'state:', state, 'stack:', stack, 'display:', display, 'o1:', operandOne, 'op:', selectedOperation, 'o2:', operandTwo)
            return
    }

}

// +-----------------------+
// | operation logic - end |
// +-----------------------+



// +-----------+
// | functions |
// +-----------+

// calculate binary operations
function calculate() {
    console.log('calculated')
    
    if (UnaryOperation === false && lastIsClosed === false) {
        display.push(operandTwo)
    }

    if (selectedOperation === '+') {
        displayNumber = operandOne + operandTwo
        
    } else if (selectedOperation === '-') {
        displayNumber = operandOne - operandTwo

    } else if (selectedOperation === '*') {
        displayNumber = operandOne * operandTwo
        
    } else if (selectedOperation === '/') {
        displayNumber = operandOne / operandTwo
        
    } else {
        displayNumber = operandOne ** operandTwo

    }

    operandOne = displayNumber
    
    updSubDisplay()
    updMainDisplay()
}

function updSubDisplay() {
    subDisplay.innerText = display.join(" ");
}

function updMainDisplay() {
    mainDisplay.innerText = displayNumber

    // +--------------------------------------------+
    // | eventually add a number format for display |
    // +--------------------------------------------+
        // var format = parseFloat(displayNumber)
        // mainDisplay.innerText = format.toLocaleString('en-US')
        // //mainDisplay.innerText = format.toLocaleString("en-US", { maximumFractionDigits: 20, signDisplay: "negative" })
        // console.log(format)
}

function factorial(n) {
    if (n <= 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

// +-----------+
// | functions |
// +-----------+


// +--------------------+
// | states definitions |
// +--------------------+


// +---------+--------------------+
// | state 0 | initiate operation |
// +---------+-----+--------------+-----------------------------------------------------------+
// | open brackets | in case of being a new operation, resets the variavels them open bracket |
// +---------------++----------------------------------------+--------------------------------+
// | close brackets | avoid closing brackets without numbers |
// +--------+-------+----------------------------------------+---------------------------------------------------+
// | number | if a bracket is the last digit delete brackets operation to avoid conflict - add number to display |
// +--------+--+-------------------------------------------------------------------------------------------+-----+
// | operation | in case of being a new operation, resets the variavels - store typed number and operation |
// +--------+--+--------------------------------+----------------------------------------------------------+
// | equals | avoid trying to calculate nothing |
// +--------+-----------------------------------+

// +---------+---------------------------------------------+
// | state 1 | wait first number continuation or operation |
// +---------+-----+---------------------------------------+------------+
// | open brackets | avoid opening bracket if there is no signal before |
// +---------------++---------------------------------------+-----------+
// | close brackets | if still open brackets, close bracket |
// +--------+-------+---------------+-----------------------+
// | number | add number to display |
// +--------+--+--------------------+-------------+
// | operation | store typed number and operation |
// +-----------+------------+---------------------+
// | equals | end operation |
// +--------+---------------+

// +---------+------------------------+
// | state 2 | wait for second number |
// +---------+-----+--------------+---+
// | open brackets | open bracket |
// +---------------++-------------+-----------------------------------------+
// | close brackets | avoid closing because there is no number to calculate |
// +--------+-------+-------------------------------------------------------+------------------------------------+
// | number | if a bracket is the last digit delete brackets operation to avoid conflict - add number to display |
// +--------+--+--------------------------------------------------------------------------+----------------------+
// | operation | only if last digit is close bracket, store brackets result and operation |
// +--------+--+--------------------------------------------------------------------------+--------------------+
// | equals | if open bracket, calculate bracket operation and continue, otherwise calculate and end operation |
// +--------+--------------------------------------------------------------------------------------------------+

// +---------+----------------------------------------------+
// | state 3 | wait second number continuation or operation |
// +---------+-----+----------------------------------------+-----------+
// | open brackets | avoid opening bracket if there is no signal before |
// +---------------++---------------------------------------------------+----------------------------------------------------------+
// | close brackets | if still open brackets, calculate operation in brackets and return to the state privious to opening brackets |
// +--------+-------+----------------+---------------------------------------------------------------------------------------------+
// | number | add number to display  |
// +--------+--+---------------------+----------------------------------------------+
// | operation | calculate previous operation them store typed number and operation |
// +--------+--+--------------------------------------------------------------------+--------------------------+
// | equals | if open bracket, calculate bracket operation and continue, otherwise calculate and end operation |
// +--------+--------------------------------------------------------------------------------------------------+

// +---------+-------------------------------------------------------------------------------+
// | state 4 | invalid entry - when in this state there is no way of continue the operation  |
// +---------+-----+------------------+------------------------------------------------------+
// | open brackets | block this entry |
// +---------------++-----------------++
// | close brackets | block this entry |
// +--------+-------+------------------+--------------------------+
// | number | resets the calculator and add the number to display |
// +--------+--+------------------+-------------------------------+
// | operation | block this entry |
// +--------+--+----------------+-+
// | equals | block this entry |
// +--------+------------------+

// +--------------------------+
// | states definitions - end |
// +--------------------------+


// +-------------------------+
// | add function to buttons |
// +-------------------------+
OpenBracketBtn.addEventListener("click", () => {
    console.log(lastIsClosed, 'state stack:', stateStack, 'state:', state, 'stack:', stack, 'display:', display, 'o1:', operandOne, 'op:', selectedOperation, 'o2:', operandTwo)
    switch (state) {
        case 0:
            if (display[display.length - 1] === '=') { // || UnaryOperation === true) {
                clear()
                // return
            }

            stateStack.push(state)
            display.push('(')

            updSubDisplay()
            openBrackets++

            lastIsClosed = false
            logOpen = 0
            return
        case 1:
            return
        case 2:
            if (lastIsClosed === false) {
                display.push('(')

                stack.push(operandOne, selectedOperation)
                stateStack.push(state)
                
                updSubDisplay()
                openBrackets++

                lastIsClosed = false
                logOpen = 0
                state = 0
            }
            return
        case 3:
            return
        default:
            return
    }
})

CloseBracketBtn.addEventListener("click", () => {
    console.log(lastIsClosed, 'state stack:', stateStack, 'state:', state, 'stack:', stack, 'display:', display, 'o1:', operandOne, 'op:', selectedOperation, 'o2:', operandTwo)
    switch (state) {
        case 0:
            return
        case 1:
            if (openBrackets > 0) {
                operandOne = parseFloat(mainDisplay.innerText)
                display.push(mainDisplay.innerText, ')')

                openBrackets--
                updSubDisplay()

                lastIsClosed = true
                logOpen = 0
                displayNumber = ''
            }
            
            return
        case 2:
            return
        case 3:
            if (openBrackets > 0) {
                operandTwo = parseFloat(mainDisplay.innerText)
                calculate()

                display.push(')')
                updSubDisplay()

                lastIsClosed = true
                displayNumber = ''
                openBrackets--
                logOpen = 0

                if (stateStack[stateStack.length - 1] == 2) {
                    operandTwo = operandOne
                    stateStack.pop()
                    
                    selectedOperation = stack[stack.length - 1]
                    stack.pop()
                    operandOne = stack[stack.length - 1]
                    stack.pop()
                    
                    state = 2
                } else {
                    stateStack.pop()
                    state = 0
                }
            }
            
            return
        default:
            return
    }
})

NumButtons.forEach((button) => {
    button.addEventListener("click", () => {
        switch (state) {
            case 0:
                if (lastIsClosed === true) {
                    do {
                        display.pop()
                    }
                    while(display[display.length - 1] !== '(')
                    display.pop()

                    updSubDisplay()
                    displayNumber = ''
                    
                }

                mainDisplay.innerText = '0'
                appendNumber(button.innerText)
                state = 1
                logOpen = 0
                lastIsClosed = false
                console.log(lastIsClosed, 'state stack:', stateStack, 'state:', state, 'stack:', stack, 'display:', display, 'o1:', operandOne, 'op:', selectedOperation, 'o2:', operandTwo)
                return
            case 1:
                appendNumber(button.innerText)
                logOpen = 0
                lastIsClosed = false
                return
            case 2:
                if (lastIsClosed === true) {
                    do {
                        display.pop()
                    }
                    while(display[display.length - 1] !== '(')
                    display.pop()

                    console.log(operandOne, selectedOperation)

                    updSubDisplay()
                    displayNumber = ''
                    
                }

                lastIsClosed = false
                mainDisplay.innerText = '0'
                logOpen = 0
                state = 3
                appendNumber(button.innerText)
                return
            case 3:
                appendNumber(button.innerText)
                lastIsClosed = false
                logOpen = 0
                return
            default:
                clear()
                appendNumber(button.innerText)
                state = 1
                logOpen = 0
                return
        }
    });
});

OpButtons.forEach((button) => {
    button.addEventListener("click", () => {
        let Text = mainDisplay.innerText
        switch (state) {
            case 0:
                operandOne = parseFloat(mainDisplay.innerText)
                if (display[display.length - 1] === '='){
                    clearDisplay()
                }

                if (button.id !== 'log' && button.id !== 'logN') {
                    logOpen = 0
                }
                
                if (Text[Text.length - 1] === '.') {
                    erase()
                }

                operation(button.id)
                return
            case 1:
                operandOne = parseFloat(mainDisplay.innerText)
                if (button.id !== 'log' && button.id !== 'logN') {
                    logOpen = 0
                }

                if (Text[Text.length - 1] === '.') {
                    erase()
                }

                operation(button.id)
                return
            case 2:
                if (lastIsClosed === true || UnaryOperation === true) {
                    operation(button.id)
                }

                if (Text[Text.length - 1] === '.') {
                    erase()
                }
                
                return
            case 3:
                operandTwo = parseFloat(mainDisplay.innerText)  
                if (button.id !== 'log' && button.id !== 'logN') {
                    logOpen = 0
                }

                if (Text[Text.length - 1] === '.') {
                    erase()
                }
                
                operation(button.id) 
                return
            default:
                return
        }
    })
});

equalsBtn.addEventListener("click", () => {
    switch (state) {
        case 0:
            if (openBrackets > 0 && display[display.length - 1] !== '(') {
                if (stateStack[stateStack.length - 1] == 2) {
                    operandTwo = operandOne
                    stateStack.pop()
                    
                    selectedOperation = stack[stack.length - 1]
                    stack.pop()
                    operandOne = stack[stack.length - 1]
                    stack.pop()
                    
                    state = 2
                } else {
                    stateStack.pop()
                    state = 0
                }
                
                display.push(')')
                lastIsClosed = true
                openBrackets--
                UnaryOperation = false
                updSubDisplay()

            }
            return
        case 1:
            display.push(mainDisplay.innerText, '=')
            updSubDisplay()
            state = 0
            logOpen = 0
            return
        case 2:
            console.log(lastIsClosed, 'state stack:', stateStack, 'state:', state, 'stack:', stack, 'display:', display, 'o1:', operandOne, 'op:', selectedOperation, 'o2:', operandTwo)
            
            operandTwo = parseFloat(mainDisplay.innerText)
            calculate()

            if (openBrackets > 0) {

                if (stateStack[stateStack.length - 1] == 2) {
                    operandTwo = operandOne
                    stateStack.pop()
                    
                    selectedOperation = stack[stack.length - 1]
                    stack.pop()
                    operandOne = stack[stack.length - 1]
                    stack.pop()
                    
                    state = 2
                } else {
                    stateStack.pop()
                    state = 0
                }
                display.push(')')
                lastIsClosed = true
                openBrackets--

            } else {
                display.push('=')
                lastIsClosed = false
                state = 0
                logOpen = 0
            }

            UnaryOperation = false
            updSubDisplay()
            
            return
        case 3:
            operandTwo = parseFloat(mainDisplay.innerText)

            if (lastIsClosed === false) { // && UnaryOperation === false) {
                calculate()
            }

            console.log(operandOne, operandTwo, state)
            if (openBrackets > 0) {

                if (stateStack[stateStack.length - 1] == 2) {
                    operandTwo = operandOne
                    stateStack.pop()
                    
                    selectedOperation = stack[stack.length - 1]
                    stack.pop()
                    operandOne = stack[stack.length - 1]
                    stack.pop()
                    
                    state = 2
                } else {
                    stateStack.pop()
                    state = 0
                }

                display.push(')')
                lastIsClosed = true
                openBrackets--

            } else if (stack.length > 0) {
                if (stateStack[stateStack.length - 1] == 2) {
                    operandTwo = operandOne
                    stateStack.pop()
                    
                    selectedOperation = stack[stack.length - 1]
                    stack.pop()
                    operandOne = stack[stack.length - 1]
                    stack.pop()
                    
                    state = 2
                } else {
                    stateStack.pop()
                    state = 0
                }

            } else {
                display.push('=')
                lastIsClosed = false
                state = 0
                logOpen = 0
            }

            UnaryOperation = false
            updSubDisplay()

            return
        default:
            return
    }
});

clearBtn.addEventListener("click", () => {
    clear()
});

deleteBtn.addEventListener("click", () => {
    if (state === 4) {
        clear()
        return
    }
    erase()
});

// +-------------------------------+
// | add function to buttons - end |
// +-------------------------------+
