// DOM Elements
const previousOperandEl = document.getElementById('previous-operand');
const currentOperandEl = document.getElementById('current-operand');
const buttons = document.querySelectorAll('.btn');

// Calculator State
let currentOperand = '0';
let previousOperand = '';
let operation = null;
let shouldResetScreen = false;

// Update Display
function updateDisplay() {
    currentOperandEl.textContent = currentOperand;
    if (operation != null) {
        previousOperandEl.textContent = `${previousOperand} ${getOperationSymbol(operation)}`;
    } else {
        previousOperandEl.textContent = previousOperand;
    }
}

// Get operation symbol for display
function getOperationSymbol(op) {
    switch (op) {
        case 'add': return '+';
        case 'subtract': return '−';
        case 'multiply': return '×';
        case 'divide': return '÷';
        default: return '';
    }
}

// Reset calculator
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
    updateDisplay();
}

// Delete last character
function deleteNumber() {
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

// Append number to current operand
function appendNumber(number) {
    if (currentOperand === '0' || shouldResetScreen) {
        currentOperand = number;
        shouldResetScreen = false;
    } else {
        // Prevent multiple decimal points
        if (number === '.' && currentOperand.includes('.')) return;
        currentOperand += number;
    }
    updateDisplay();
}

// Choose operation
function chooseOperation(op) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        compute();
    }
    
    operation = op;
    previousOperand = currentOperand;
    shouldResetScreen = true;
    updateDisplay();
}

// Perform calculation
function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case 'add':
            computation = prev + current;
            break;
        case 'subtract':
            computation = prev - current;
            break;
        case 'multiply':
            computation = prev * current;
            break;
        case 'divide':
            if (current === 0) {
                alert("Cannot divide by zero!");
                clear();
                return;
            }
            computation = prev / current;
            break;
        case 'percentage':
            computation = prev * (current / 100);
            break;
        default:
            return;
    }
    
    // Round to avoid floating point precision issues
    currentOperand = Math.round((computation + Number.EPSILON) * 100000000) / 100000000;
    currentOperand = currentOperand.toString();
    operation = null;
    previousOperand = '';
    shouldResetScreen = true;
    updateDisplay();
}

// Handle button clicks
buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Number buttons
        if (button.classList.contains('number')) {
            const number = button.getAttribute('data-number');
            appendNumber(number);
        }
        
        // Operator buttons
        if (button.classList.contains('operator')) {
            const action = button.getAttribute('data-action');
            
            switch (action) {
                case 'clear':
                    clear();
                    break;
                case 'delete':
                    deleteNumber();
                    break;
                case 'equals':
                    compute();
                    break;
                case 'percentage':
                    if (previousOperand === '') {
                        // If no previous operand, percentage of current number
                        currentOperand = (parseFloat(currentOperand) / 100).toString();
                        updateDisplay();
                    } else {
                        chooseOperation('percentage');
                    }
                    break;
                default:
                    chooseOperation(action);
            }
        }
        
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    });
});

// Keyboard Support
document.addEventListener('keydown', (event) => {
    // Prevent default behavior for calculator keys
    if (
        event.key >= '0' && event.key <= '9' ||
        event.key === '.' ||
        event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/' ||
        event.key === 'Enter' || event.key === 'Escape' || event.key === 'Backspace' ||
        event.key === '%'
    ) {
        event.preventDefault();
    }
    
    // Number keys
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    }
    
    // Decimal point
    if (event.key === '.') {
        appendNumber('.');
    }
    
    // Operations
    if (event.key === '+') {
        chooseOperation('add');
    }
    
    if (event.key === '-') {
        chooseOperation('subtract');
    }
    
    if (event.key === '*') {
        chooseOperation('multiply');
    }
    
    if (event.key === '/') {
        chooseOperation('divide');
    }
    
    // Percentage
    if (event.key === '%') {
        if (previousOperand === '') {
            currentOperand = (parseFloat(currentOperand) / 100).toString();
            updateDisplay();
        } else {
            chooseOperation('percentage');
        }
    }
    
    // Equals/Enter
    if (event.key === '=' || event.key === 'Enter') {
        compute();
    }
    
    // Clear/Escape
    if (event.key === 'Escape') {
        clear();
    }
    
    // Delete/Backspace
    if (event.key === 'Backspace') {
        deleteNumber();
    }
    
    // Visual feedback for keyboard input
    const key = event.key;
    let buttonToHighlight = null;
    
    // Find the corresponding button
    buttons.forEach(button => {
        if (
            (button.classList.contains('number') && button.getAttribute('data-number') === key) ||
            (key === 'Enter' && button.getAttribute('data-action') === 'equals') ||
            (key === 'Escape' && button.getAttribute('data-action') === 'clear') ||
            (key === 'Backspace' && button.getAttribute('data-action') === 'delete') ||
            (key === '+' && button.getAttribute('data-action') === 'add') ||
            (key === '-' && button.getAttribute('data-action') === 'subtract') ||
            (key === '*' && button.getAttribute('data-action') === 'multiply') ||
            (key === '/' && button.getAttribute('data-action') === 'divide') ||
            (key === '%' && button.getAttribute('data-action') === 'percentage')
        ) {
            buttonToHighlight = button;
        }
    });
    
    // Add highlight effect
    if (buttonToHighlight) {
        buttonToHighlight.style.backgroundColor = '#ffcc80';
        setTimeout(() => {
            buttonToHighlight.style.backgroundColor = '';
        }, 150);
    }
});

// Initialize calculator
updateDisplay();

// Add CSS for button active state
const style = document.createElement('style');
style.textContent = `
    .btn:active {
        transform: scale(0.95);
        transition: transform 0.1s;
    }
`;
document.head.appendChild(style);
