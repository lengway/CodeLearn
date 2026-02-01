-- Seed data for CodeLearn Platform

-- Insert admin user (password: admin123)
-- Password hash generated with bcrypt (12 rounds)
INSERT INTO users (id, email, username, password_hash, role, xp) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'admin@codelearn.com',
    'admin',
    '$2a$12$yMmJqVOu9z4ECYZeVVAY.eCctbWLsYjPdO4LhPS5rQBVg4gtPV5Se',
    'admin',
    0
);

-- Insert sample courses
INSERT INTO courses (id, title, description, language, difficulty, image_url) VALUES
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Python Basics',
    'Learn Python programming from scratch. Master variables, loops, functions and more.',
    'python',
    'beginner',
    '/images/python.png'
),
(
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'JavaScript Fundamentals',
    'Start your journey into web development with JavaScript basics.',
    'javascript',
    'beginner',
    '/images/javascript.png'
),
(
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'C++ Introduction',
    'Learn the fundamentals of C++ programming language.',
    'cpp',
    'intermediate',
    '/images/cpp.png'
);

-- Python course levels
INSERT INTO levels (id, course_id, order_index, title, theory_content, xp_reward) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    1,
    'Hello World',
    '# Your First Python Program

In Python, printing text to the screen is simple. We use the `print()` function.

```python
print("Hello, World!")
```

The `print()` function outputs whatever is inside the parentheses to the console.',
    10
),
(
    '11111111-1111-1111-1111-111111111112',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    2,
    'Variables',
    '# Variables in Python

Variables are containers for storing data values. In Python, you don''t need to declare the type.

```python
name = "Alice"
age = 25
height = 1.75
```

Variable names should be descriptive and follow snake_case convention.',
    15
),
(
    '11111111-1111-1111-1111-111111111113',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    3,
    'Basic Math',
    '# Math Operations

Python supports all basic math operations:
- Addition: `+`
- Subtraction: `-`
- Multiplication: `*`
- Division: `/`
- Integer Division: `//`
- Modulus: `%`
- Power: `**`',
    15
),
(
    '11111111-1111-1111-1111-111111111114',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    4,
    'Conditionals',
    '# If Statements

Conditional statements allow your program to make decisions.

```python
age = 18
if age >= 18:
    print("Adult")
else:
    print("Minor")
```

Use `if`, `elif`, and `else` to create branches in your code.',
    20
),
(
    '11111111-1111-1111-1111-111111111115',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    5,
    'Loops',
    '# For and While Loops

Loops let you repeat code multiple times.

**For Loop:**
```python
for i in range(5):
    print(i)
```

**While Loop:**
```python
count = 0
while count < 5:
    print(count)
    count += 1
```',
    25
);

-- JavaScript course levels
INSERT INTO levels (id, course_id, order_index, title, theory_content, xp_reward) VALUES
(
    '22222222-2222-2222-2222-222222222221',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    1,
    'Hello World',
    '# Your First JavaScript Program

In JavaScript, we use `console.log()` to output text.

```javascript
console.log("Hello, World!");
```

This will print the message to the console.',
    10
),
(
    '22222222-2222-2222-2222-222222222222',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    2,
    'Variables',
    '# Variables in JavaScript

JavaScript has three ways to declare variables:
- `let` - for variables that can change
- `const` - for constants
- `var` - older style (avoid)

```javascript
let name = "Bob";
const PI = 3.14159;
```',
    15
),
(
    '22222222-2222-2222-2222-222222222223',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    3,
    'Functions',
    '# Functions

Functions are reusable blocks of code.

```javascript
function greet(name) {
    return "Hello, " + name + "!";
}

console.log(greet("Alice"));
```

Arrow functions provide a shorter syntax:
```javascript
const greet = (name) => "Hello, " + name + "!";
```',
    20
);

-- C++ course levels
INSERT INTO levels (id, course_id, order_index, title, theory_content, xp_reward) VALUES
(
    '33333333-3333-3333-3333-333333333331',
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    1,
    'Hello World',
    '# Your First C++ Program

C++ programs start with including headers and the main function.

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
```',
    10
),
(
    '33333333-3333-3333-3333-333333333332',
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    2,
    'Variables & Types',
    '# C++ Variables

C++ is a statically typed language - you must declare variable types.

```cpp
int age = 25;
double price = 19.99;
char grade = ''A'';
string name = "Alice";
bool isValid = true;
```',
    15
);

-- Challenges for Python course
INSERT INTO challenges (level_id, description, starter_code, language_id, expected_output, test_input, time_limit, memory_limit) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Write a program that prints "Hello, World!" to the console.',
    E'# Write your code below\n',
    71,
    'Hello, World!',
    NULL,
    2.0,
    128000
),
(
    '11111111-1111-1111-1111-111111111112',
    'Create a variable called `message` with the value "Python is awesome!" and print it.',
    E'# Create a variable and print it\n',
    71,
    'Python is awesome!',
    NULL,
    2.0,
    128000
),
(
    '11111111-1111-1111-1111-111111111113',
    'Calculate and print the result of 15 multiplied by 7.',
    E'# Calculate 15 * 7 and print the result\n',
    71,
    '105',
    NULL,
    2.0,
    128000
),
(
    '11111111-1111-1111-1111-111111111114',
    'Write a program that checks if a number is positive, negative, or zero. The number is stored in variable `num`. Print "positive", "negative", or "zero".',
    E'num = 42\n# Write your condition below\n',
    71,
    'positive',
    NULL,
    2.0,
    128000
),
(
    '11111111-1111-1111-1111-111111111115',
    'Use a for loop to print numbers from 1 to 5, each on a new line.',
    E'# Use a for loop to print 1 to 5\n',
    71,
    E'1\n2\n3\n4\n5',
    NULL,
    2.0,
    128000
);

-- Challenges for JavaScript course
INSERT INTO challenges (level_id, description, starter_code, language_id, expected_output, test_input, time_limit, memory_limit) VALUES
(
    '22222222-2222-2222-2222-222222222221',
    'Write a program that prints "Hello, World!" to the console.',
    E'// Write your code below\n',
    63,
    'Hello, World!',
    NULL,
    2.0,
    128000
),
(
    '22222222-2222-2222-2222-222222222222',
    'Create a variable called `language` with the value "JavaScript" and print it.',
    E'// Create a variable and print it\n',
    63,
    'JavaScript',
    NULL,
    2.0,
    128000
),
(
    '22222222-2222-2222-2222-222222222223',
    'Create a function called `add` that takes two numbers and returns their sum. Then print the result of add(5, 3).',
    E'// Create the add function and call it\n',
    63,
    '8',
    NULL,
    2.0,
    128000
);

-- Challenges for C++ course
INSERT INTO challenges (level_id, description, starter_code, language_id, expected_output, test_input, time_limit, memory_limit) VALUES
(
    '33333333-3333-3333-3333-333333333331',
    'Write a C++ program that prints "Hello, World!" to the console.',
    E'#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}',
    54,
    'Hello, World!',
    NULL,
    2.0,
    128000
),
(
    '33333333-3333-3333-3333-333333333332',
    'Declare an integer variable `x` with value 10 and a double variable `y` with value 3.14. Print them on separate lines.',
    E'#include <iostream>\nusing namespace std;\n\nint main() {\n    // Declare variables and print them\n    return 0;\n}',
    54,
    E'10\n3.14',
    NULL,
    2.0,
    128000
);
