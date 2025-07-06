// Java Programming TCA Sample Questions Bank
const questionBank = [
    // Question 1 - Interface Conflict
    {
        id: 1,
        type: "single-choice",
        question: "Analyze this code and determine what happens:\n\n```java\npublic interface Alpha {\n    void display() {\n        System.out.println(\"Alpha method\");\n    }\n}\n\npublic interface Beta {\n    void display() {\n        System.out.println(\"Beta method\");\n    }\n}\n\nclass Gamma implements Alpha, Beta {\n}\n\npublic class DemoApp {\n    public static void main(String[] args) {\n        Gamma obj = new Gamma();\n        obj.display();\n    }\n}\n```\n\nWhat will happen when this code is compiled and run?",
        options: [
            "Compilation error",
            "Alpha method", 
            "Beta method",
            "Runtime exception"
        ],
        correctAnswers: [0],
        points: 1,
        explanation: "This code will cause a compilation error because class Gamma implements two interfaces with conflicting default methods. The class must override the display() method to resolve the conflict."
    },

    // Question 2 - Inheritance Syntax
    {
        id: 2,
        type: "single-choice",
        question: "Which of the following is the correct syntax to extend a class named PersonDetails in Java?",
        options: [
            "class Student extends PersonDetails",
            "class Student extends PersonDetails()",
            "class Student inherit PersonDetails",
            "class Student child PersonDetails"
        ],
        correctAnswers: [0],
        points: 1,
        explanation: "The correct syntax to extend a class in Java is 'class ChildClass extends ParentClass'. The 'extends' keyword is used for inheritance."
    },

    // Question 3 - Abstract Class
    {
        id: 3,
        type: "single-choice",
        question: "Analyze this code and determine the output:\n\n```java\nabstract class Vehicle {\n    abstract void start();\n}\n\nclass Car extends Vehicle {\n    void start() {\n        System.out.println(\"Engine starts\");\n    }\n}\n\npublic class VehicleTest {\n    public static void main(String[] args) {\n        Vehicle myCar = new Car();\n        myCar.start();\n    }\n}\n```\n\nWhat is the output?",
        options: [
            "Compilation error",
            "Engine starts",
            "Vehicle starts", 
            "Runtime exception"
        ],
        correctAnswers: [1],
        points: 1,
        explanation: "The code will output 'Engine starts'. The Car class properly implements the abstract method start() from Vehicle class, and polymorphism allows calling the overridden method."
    },

    // Question 4 - Method Overloading
    {
        id: 4,
        type: "single-choice", 
        question: "What is method overloading in Java?",
        options: [
            "Two methods with same name and same parameters",
            "Two methods with same name but different parameters",
            "A child class method overriding a parent class method",
            "Implementing an interface method"
        ],
        correctAnswers: [1],
        points: 1,
        explanation: "Method overloading occurs when two or more methods in the same class have the same name but different parameters (different number, type, or order of parameters)."
    },

    // Question 5 - Final Method Override
    {
        id: 5,
        type: "single-choice",
        question: "If a subclass overrides a method marked final in the parent class, what happens?",
        options: [
            "Code compiles and runs",
            "Compilation error",
            "Runtime exception",
            "The final method gets overridden"
        ],
        correctAnswers: [1],
        points: 1,
        explanation: "A compilation error occurs because final methods cannot be overridden by subclasses. The final keyword prevents method overriding."
    },

    // Question 6 - Final Keyword Fill-in-the-blank
    {
        id: 6,
        type: "fill-blank",
        question: "The __________ keyword in Java makes a class non-inheritable.",
        correctAnswer: "final",
        points: 1,
        explanation: "The 'final' keyword when applied to a class makes it non-inheritable, meaning no other class can extend it (like String class)."
    },

    // Question 7 - Abstraction Fill-in-the-blank
    {
        id: 7,
        type: "fill-blank",
        question: "In Java, __________ refers to simplifying reality by modeling objects while hiding internal complexity.",
        correctAnswer: "abstraction",
        points: 1,
        explanation: "Abstraction is the OOP concept that involves simplifying complex reality by modeling classes based on essential characteristics while hiding unnecessary details."
    },

    // Question 8 - Interface Default Method
    {
        id: 8,
        type: "single-choice",
        question: "Analyze this code and determine the output:\n\n```java\ninterface Drawable {\n    default void draw() {\n        System.out.println(\"Drawing shape\");\n    }\n}\n\nclass Square implements Drawable {\n    public void draw() {\n        System.out.println(\"Drawing square\");\n    }\n}\n\npublic class DrawingApp {\n    public static void main(String[] args) {\n        Drawable shape = new Square();\n        shape.draw();\n    }\n}\n```\n\nWhat is the output?",
        options: [
            "Drawing shape",
            "Drawing square",
            "Compilation error",
            "Runtime exception"
        ],
        correctAnswers: [1],
        points: 1,
        explanation: "The output is 'Drawing square' because the Square class overrides the default method from the interface, and the overridden method is called."
    },

    // Question 9 - Finally Block
    {
        id: 9,
        type: "single-choice",
        question: "Which block ensures cleanup (like closing a file) regardless of exception occurrence?",
        options: [
            "throw",
            "try",
            "catch",
            "finally"
        ],
        correctAnswers: [3],
        points: 1,
        explanation: "The 'finally' block always executes regardless of whether an exception occurs or not, making it perfect for cleanup operations."
    },

    // Question 10 - String Concatenation
    {
        id: 10,
        type: "single-choice",
        question: "Which operator is used to concatenate two strings in Java?",
        options: [
            "+",
            "&&",
            "||",
            "**"
        ],
        correctAnswers: [0],
        points: 1,
        explanation: "The '+' operator is used for string concatenation in Java. When used with strings, it concatenates them together."
    },

    // Question 11 - String Methods
    {
        id: 11,
        type: "single-choice",
        question: "Which method removes extra spaces at the start and end of a string?",
        options: [
            "split()",
            "replace()",
            "trim()",
            "substring()"
        ],
        correctAnswers: [2],
        points: 1,
        explanation: "The trim() method removes leading and trailing whitespace from a string."
    },

    // Question 12 - Exception Handling Code
    {
        id: 12,
        type: "single-choice",
        question: "Analyze this code and identify the issue:\n\n```java\nimport java.util.Scanner;\n\npublic class InputSum {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        System.out.print(\"Enter numbers: \");\n        String line = input.nextLine();\n        String[] values = line.split(\" \");\n        int total = 0;\n        for (String val : values) {\n            total += Integer.parseInt(val);\n        }\n        System.out.println(\"Total: \" + total);\n    }\n}\n```\n\nWhat is the issue and fix?",
        options: [
            "No issue",
            "Use try-catch to handle NumberFormatException",
            "Change split to comma",
            "Check for null before parsing"
        ],
        correctAnswers: [1],
        points: 1,
        explanation: "The code should use try-catch to handle NumberFormatException that can occur if non-numeric input is entered when parsing with Integer.parseInt()."
    },

    // Question 13 - Array Index Bug
    {
        id: 13,
        type: "single-choice",
        question: "Analyze this code and identify the issue:\n\n```java\nimport java.util.Arrays;\n\npublic class SortApp {\n    public static void main(String[] args) {\n        int[] nums = {8, 4, 6, 2};\n        Arrays.sort(nums);\n        for (int i = 0; i <= nums.length; i++) {\n            System.out.println(nums[i]);\n        }\n    }\n}\n```\n\nWhat is the issue and fix?",
        options: [
            "No issue",
            "Change i <= nums.length to i < nums.length",
            "Use try-catch block",
            "Sort in reverse order"
        ],
        correctAnswers: [1],
        points: 1,
        explanation: "The condition 'i <= nums.length' will cause ArrayIndexOutOfBoundsException. It should be 'i < nums.length' because array indices go from 0 to length-1."
    },

    // Question 14 - Encapsulation Example
    {
        id: 14,
        type: "single-choice",
        question: "Analyze this code and determine the output:\n\n```java\nclass Profile {\n    private String username;\n\n    public String getUsername() {\n        return username;\n    }\n\n    public void setUsername(String name) {\n        this.username = name;\n    }\n}\n\npublic class ProfileTest {\n    public static void main(String[] args) {\n        Profile p = new Profile();\n        p.setUsername(\"Alice\");\n        System.out.println(p.getUsername());\n    }\n}\n```\n\nWhat is the output?",
        options: [
            "Alice",
            "Compilation error",
            "null",
            "Runtime exception"
        ],
        correctAnswers: [0],
        points: 1,
        explanation: "The output is 'Alice' because the setter method sets the username to 'Alice' and the getter method returns it."
    },

    // Question 15 - Constructor Inheritance
    {
        id: 15,
        type: "single-choice",
        question: "Analyze this code and determine the output:\n\n```java\nclass Master {\n    Master() {\n        System.out.println(\"Master class constructor\");\n    }\n}\n\nclass Apprentice extends Master {\n    Apprentice() {\n        System.out.println(\"Apprentice class constructor\");\n    }\n}\n\npublic class InheritanceTest {\n    public static void main(String[] args) {\n        Apprentice obj = new Apprentice();\n    }\n}\n```\n\nWhat is the output?",
        options: [
            "Master class constructor\nApprentice class constructor",
            "Apprentice class constructor\nMaster class constructor",
            "Only Apprentice class constructor",
            "Only Master class constructor"
        ],
        correctAnswers: [0],
        points: 1,
        explanation: "The parent class constructor is called first (implicitly with super()), then the child class constructor. Output: Master class constructor, then Apprentice class constructor."
    },

    // Question 16 - Is-a Relationship
    {
        id: 16,
        type: "single-choice",
        question: "What does the \"is-a\" relationship represent in Java OOP?",
        options: [
            "Inheritance",
            "Polymorphism",
            "Abstraction", 
            "Encapsulation"
        ],
        correctAnswers: [0],
        points: 1,
        explanation: "The 'is-a' relationship represents inheritance. For example, 'Car is-a Vehicle' indicates that Car inherits from Vehicle."
    },

    // Question 17 - Data Types Matching
    {
        id: 17,
        type: "matching",
        question: "Match Java data types with their byte sizes:",
        prompts: ["int", "short", "double", "char"],
        answers: ["4 bytes", "2 bytes", "8 bytes", "2 bytes"],
        correctMatches: {
            "int": "4 bytes",
            "short": "2 bytes", 
            "double": "8 bytes",
            "char": "2 bytes"
        },
        points: 4,
        explanation: "int = 4 bytes, short = 2 bytes, double = 8 bytes, char = 2 bytes (Unicode characters)"
    },

    // Question 18 - Control Structures Matching
    {
        id: 18,
        type: "matching",
        question: "Match Java control structures to their usage:",
        prompts: ["if", "while", "for", "switch"],
        answers: ["Executes conditionally", "Repeats while condition is true", "Loops with known bounds", "Selects block based on value"],
        correctMatches: {
            "if": "Executes conditionally",
            "while": "Repeats while condition is true",
            "for": "Loops with known bounds",
            "switch": "Selects block based on value"
        },
        points: 4,
        explanation: "Each control structure has specific use cases: if for conditions, while for indefinite loops, for for definite loops, switch for multi-way branching."
    },

    // Question 19 - Exception Handling Matching
    {
        id: 19,
        type: "matching",
        question: "Match exception handling keywords:",
        prompts: ["try", "catch", "finally", "throw"],
        answers: ["Surrounds code that may throw", "Catches specific exceptions", "Executes cleanup code", "Manually throw an exception"],
        correctMatches: {
            "try": "Surrounds code that may throw",
            "catch": "Catches specific exceptions",
            "finally": "Executes cleanup code",
            "throw": "Manually throw an exception"
        },
        points: 4,
        explanation: "Exception handling keywords: try (contains risky code), catch (handles exceptions), finally (cleanup), throw (manually throws exceptions)."
    },

    // Question 20 - Inheritance Terms Matching
    {
        id: 20,
        type: "matching",
        question: "Match inheritance-related terms:",
        prompts: ["superclass", "subclass", "inheritance", "extends"],
        answers: ["Class being extended", "Class that extends another", "Gaining features from a class", "Keyword to inherit a class"],
        correctMatches: {
            "superclass": "Class being extended",
            "subclass": "Class that extends another",
            "inheritance": "Gaining features from a class",
            "extends": "Keyword to inherit a class"
        },
        points: 4,
        explanation: "Inheritance terminology: superclass (parent), subclass (child), inheritance (concept), extends (keyword)."
    },

    // Question 21 - Abstract Class Instantiation
    {
        id: 21,
        type: "single-choice",
        question: "Can an abstract class be instantiated?",
        options: [
            "True",
            "False"
        ],
        correctAnswers: [1],
        points: 1,
        explanation: "False. Abstract classes cannot be instantiated directly. You can only create instances of concrete subclasses."
    },

    // Question 22 - this() Constructor Call
    {
        id: 22,
        type: "single-choice",
        question: "The this() call is used only for calling another constructor in the same class.",
        options: [
            "True",
            "False"
        ],
        correctAnswers: [0],
        points: 1,
        explanation: "True. The this() call is used to invoke another constructor within the same class (constructor chaining)."
    },

    // Question 23 - Multiple Inheritance
    {
        id: 23,
        type: "single-choice",
        question: "Can a Java class extend more than one class?",
        options: [
            "True",
            "False"
        ],
        correctAnswers: [1],
        points: 1,
        explanation: "False. Java does not support multiple inheritance of classes. A class can only extend one superclass."
    },

    // Question 24 - Multiple Interface Implementation
    {
        id: 24,
        type: "single-choice",
        question: "Can a Java class implement more than one interface?",
        options: [
            "True",
            "False"
        ],
        correctAnswers: [0],
        points: 1,
        explanation: "True. A Java class can implement multiple interfaces using comma separation: class MyClass implements Interface1, Interface2."
    },

    // Question 25 - Abstract Class Interface Implementation
    {
        id: 25,
        type: "single-choice",
        question: "Can an abstract class implement multiple interfaces?",
        options: [
            "True",
            "False"
        ],
        correctAnswers: [0],
        points: 1,
        explanation: "True. An abstract class can implement multiple interfaces, and it's not required to implement all interface methods (concrete subclasses must)."
    },

    // Question 26 - Array Sum Calculation
    {
        id: 26,
        type: "single-choice",
        question: "Analyze this code and determine the output:\n\n```java\npublic class SumArray {\n    public static void main(String[] args) {\n        int[] data = {2, 4, 6, 8};\n        int total = 0;\n        for (int i = 0; i < data.length; i++) {\n            total += data[i];\n        }\n        System.out.println(total);\n    }\n}\n```\n\nWhat is the output?",
        options: [
            "10",
            "12", 
            "20",
            "24"
        ],
        correctAnswers: [2],
        points: 1,
        explanation: "The sum of array elements is: 2 + 4 + 6 + 8 = 20"
    },

    // Question 27 - String Length
    {
        id: 27,
        type: "single-choice",
        question: "Analyze this code and determine the output:\n\n```java\npublic class StringLength {\n    public static void main(String[] args) {\n        String msg = \"Java Programming\";\n        int len = msg.length();\n        System.out.println(\"Length is \" + len);\n    }\n}\n```\n\nWhat is the output?",
        options: [
            "Length is 16",
            "16",
            "Length is 17",
            "Length is 15"
        ],
        correctAnswers: [3],
        points: 1,
        explanation: "The string 'Java Programming' has 15 characters (including the space), so output is 'Length is 15'."
    },

    // Question 28 - Break Statement
    {
        id: 28,
        type: "single-choice",
        question: "Analyze this code and determine the output:\n\n```java\npublic class BreakExample {\n    public static void main(String[] args) {\n        for (int i = 0; i < 5; i++) {\n            if (i == 2) {\n                break;\n            }\n            System.out.println(i);\n        }\n    }\n}\n```\n\nWhat is the output?",
        options: [
            "0\n1",
            "0\n1\n2",
            "1\n2",
            "2\n3"
        ],
        correctAnswers: [0],
        points: 1,
        explanation: "The loop prints 0, then 1. When i becomes 2, the break statement terminates the loop before printing 2."
    },

    // Question 29 - Polymorphism Example
    {
        id: 29,
        type: "single-choice",
        question: "Analyze this code and identify the OOP concept demonstrated:\n\n```java\nabstract class ShapeBase {\n    public abstract void render();\n}\n\nclass Oval extends ShapeBase {\n    public void render() {\n        System.out.println(\"Rendering Oval\");\n    }\n}\n\nclass Hexagon extends ShapeBase {\n    public void render() {\n        System.out.println(\"Rendering Hexagon\");\n    }\n}\n```\n\nWhich OOP concept is demonstrated?",
        options: [
            "Polymorphism",
            "Inheritance",
            "Encapsulation",
            "Abstraction"
        ],
        correctAnswers: [0],
        points: 1,
        explanation: "This demonstrates polymorphism - different classes (Oval, Hexagon) providing different implementations of the same method (render())."
    },

    // Question 30 - Encapsulation Example
    {
        id: 30,
        type: "single-choice",
        question: "Analyze this code and identify the OOP principle demonstrated:\n\n```java\npublic class Wallet {\n    private double balance;\n\n    public void deposit(double amt) {\n        balance += amt;\n    }\n\n    public void withdraw(double amt) {\n        if (amt <= balance) {\n            balance -= amt;\n        }\n    }\n}\n```\n\nWhich OOP principle is emphasized?",
        options: [
            "Polymorphism",
            "Abstraction",
            "Inheritance",
            "Encapsulation"
        ],
        correctAnswers: [3],
        points: 1,
        explanation: "This demonstrates encapsulation - the balance field is private and accessed only through controlled public methods (deposit, withdraw)."
    },

    // Additional TCA Systems Design & Development Questions
    
    // Question 31 - UML Relationships Theory
    {
        id: 31,
        type: "multiple-choice",
        question: "Which of the following correctly describes UML Class Diagram relationships?",
        options: [
            "Association represents a general relationship between classes",
            "Aggregation is a 'whole-part' relationship where parts can exist independently",
            "Composition is a stronger form where parts cannot exist without the whole",
            "Inheritance represents an 'is-a' relationship between classes",
            "Association is stronger than composition"
        ],
        correctAnswers: [0, 1, 2, 3],
        points: 4,
        explanation: "Association is a general relationship, Aggregation is 'has-a' with independent parts, Composition is 'contains-a' with dependent parts, and Inheritance is 'is-a' relationship."
    },

    // Question 32 - Access Modifiers
    {
        id: 32,
        type: "matching",
        question: "Match the access modifiers with their appropriate use cases:",
        prompts: ["public static final", "protected", "private", "public"],
        answers: ["Class constant accessible anywhere", "Method only child classes should access", "Field only accessible within its own class", "Method accessible from any class"],
        correctMatches: {
            "public static final": "Class constant accessible anywhere",
            "protected": "Method only child classes should access", 
            "private": "Field only accessible within its own class",
            "public": "Method accessible from any class"
        },
        points: 4,
        explanation: "Access modifiers control visibility: public (everywhere), protected (subclasses), private (same class only), public static final (constants)."
    },

    // Question 33 - Constructor Output
    {
        id: 33,
        type: "single-choice",
        question: "Analyze this code and determine the output:\n\n```java\npublic class MyClass {\n    int x;\n    public MyClass() {\n        x = 5;\n    }\n}\n\npublic class Test {\n    public static void main(String[] args) {\n        MyClass obj = new MyClass();\n        System.out.println(obj.x);\n    }\n}\n```\n\nWhat is the output?",
        options: [
            "Compilation error",
            "5",
            "0", 
            "Runtime error"
        ],
        correctAnswers: [1],
        points: 1,
        explanation: "The constructor sets x to 5, so when obj.x is printed, it outputs 5."
    },

    // Question 34 - Getter Method
    {
        id: 34,
        type: "single-choice",
        question: "Analyze this code and determine what the getModel() method returns:\n\n```java\npublic class Car {\n    private String make;\n    private String model;\n    \n    public Car(String make, String model) {\n        this.make = make;\n        this.model = model;\n    }\n    \n    public String getModel() {\n        return model;\n    }\n}\n```\n\nWhat does the getModel() method return?",
        options: [
            "The make of the car",
            "Both the make and model of the car", 
            "The model of the car",
            "Nothing, it's a constructor"
        ],
        correctAnswers: [2],
        points: 1,
        explanation: "The getModel() method returns the value of the private model field."
    },

    // Question 35 - OOP Process Definition
    {
        id: 35,
        type: "single-choice",
        question: "In Java, the process of creating a new class by reusing the properties and behaviors of an existing class is known as:",
        options: [
            "inheritance",
            "polymorphism",
            "encapsulation",
            "abstraction"
        ],
        correctAnswers: [0],
        points: 1,
        explanation: "Inheritance is the OOP concept that allows creating new classes by reusing properties and behaviors from existing classes."
    },

    // Question 36 - Super Keyword Purpose
    {
        id: 36,
        type: "single-choice",
        question: "In Java, what is the primary purpose of the super keyword?",
        options: [
            "To declare a variable",
            "To create a new instance of a class",
            "To call the superclass constructor or methods",
            "To access a static method"
        ],
        correctAnswers: [2],
        points: 1,
        explanation: "The super keyword is primarily used to call superclass constructors or methods, and to access superclass members."
    },

    // Question 37 - Object Passing
    {
        id: 37,
        type: "single-choice",
        question: "In Java, all objects are passed by reference to methods, allowing the modification of the original object.",
        options: [
            "True",
            "False"
        ],
        correctAnswers: [1],
        points: 1,
        explanation: "False. Java passes object references by value. While you can modify the object through the reference, you cannot change what the original reference points to."
    },

    // Question 38 - Conditional Construct
    {
        id: 38,
        type: "single-choice",
        question: "You need to ensure that a specific block of code is executed only if a certain condition is met. Which Java construct should you use?",
        options: [
            "switch case",
            "for loop",
            "if statement",
            "while loop"
        ],
        correctAnswers: [2],
        points: 1,
        explanation: "An if statement is used to execute code conditionally based on whether a condition is true or false."
    },

    // Question 39 - Multiple Inheritance
    {
        id: 39,
        type: "single-choice",
        question: "Java supports multiple inheritance, allowing a class to inherit from multiple classes.",
        options: [
            "True",
            "False"
        ],
        correctAnswers: [1],
        points: 1,
        explanation: "False. Java does not support multiple inheritance of classes. A class can only extend one superclass, though it can implement multiple interfaces."
    },

    // Question 40 - Encapsulation Access
    {
        id: 40,
        type: "fill-blank",
        question: "A class's private members are typically accessed through public methods known as __________.",
        correctAnswer: "getters and setters",
        points: 1,
        explanation: "Getters and setters (also called accessors and mutators) are public methods used to access and modify private class members while maintaining encapsulation."
    },

    // Question 41 - Loop for Factorial
    {
        id: 41,
        type: "single-choice", 
        question: "You need to implement a method that calculates the factorial of a given positive integer. Which loop structure would be most appropriate for this task?",
        options: [
            "for loop",
            "do-while loop",
            "switch statement",
            "while loop"
        ],
        correctAnswers: [0],
        points: 1,
        explanation: "A for loop is most appropriate for factorial calculation because you know the exact number of iterations needed (from 1 to n)."
    },

    // Question 42 - Abstract Class vs Interface
    {
        id: 42,
        type: "multiple-choice",
        question: "What are the key differences between abstract classes and interfaces in Java?",
        options: [
            "Abstract classes can have constructors, interfaces cannot",
            "Abstract classes can have concrete methods, interfaces can only have abstract methods (pre-Java 8)",
            "A class can extend only one abstract class but implement multiple interfaces",
            "Abstract classes can have instance variables, interfaces can only have constants",
            "Interfaces support multiple inheritance, abstract classes do not"
        ],
        correctAnswers: [0, 1, 2, 3, 4],
        points: 5,
        explanation: "Abstract classes are more flexible with constructors, concrete methods, and instance variables, while interfaces focus on contracts and support multiple inheritance."
    },

    // Question 43 - Polymorphism Example
    {
        id: 43,
        type: "single-choice",
        question: "Analyze this code and determine the output:\n\n```java\npublic class Parent {\n    public void display() {\n        System.out.println(\"Parent display\");\n    }\n}\n\nclass Child extends Parent {\n    @Override\n    public void display() {\n        System.out.println(\"Child display\");\n    }\n    \n    public void show() {\n        super.display();\n        this.display();\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Child c = new Child();\n        c.show();\n    }\n}\n```\n\nWhat is the output?",
        options: [
            "Parent display\nChild display",
            "Child display\nParent display",
            "Parent display\nParent display",
            "Child display\nChild display"
        ],
        correctAnswers: [0],
        points: 2,
        explanation: "The show() method first calls super.display() which prints 'Parent display', then this.display() which prints 'Child display'."
    },

    // Question 44 - Encapsulation Benefits
    {
        id: 44,
        type: "multiple-choice",
        question: "What are the benefits of encapsulation in Object-Oriented Programming?",
        options: [
            "Data hiding and security",
            "Controlled access to class members",
            "Code maintainability and flexibility",
            "Reduced complexity and better organization",
            "Improved performance"
        ],
        correctAnswers: [0, 1, 2, 3],
        points: 4,
        explanation: "Encapsulation provides data hiding, controlled access, maintainability, and better organization. Performance improvement is not a direct benefit."
    },

    // Question 45 - UML Class Diagram Design
    {
        id: 45,
        type: "single-choice",
        question: "In a university enrollment system, a Student can enroll in multiple Courses, and each Course can have multiple Students. What type of relationship should be shown in the UML class diagram?",
        options: [
            "One-to-One Association",
            "Many-to-Many Association", 
            "Composition",
            "Inheritance"
        ],
        correctAnswers: [1],
        points: 2,
        explanation: "Since students can enroll in multiple courses and courses can have multiple students, this represents a Many-to-Many Association relationship."
    },

    // Question 46 - Vehicle Hierarchy Implementation
    {
        id: 46,
        type: "single-choice",
        question: "Given this Vehicle hierarchy, determine the maximum speed:\n\n```java\npublic abstract class Vehicle {\n    public void drive() {\n        System.out.println(\"The vehicle is driving\");\n    }\n}\n\npublic class Car extends Vehicle {\n    private int horsepower;\n    \n    public Car(int horsepower) {\n        this.horsepower = horsepower;\n    }\n    \n    public int maxSpeed() {\n        return horsepower * 2;\n    }\n}\n```\n\nIf you create a Car with 150 horsepower, what would be its maximum speed?",
        options: [
            "150 mph",
            "300 mph",
            "75 mph", 
            "200 mph"
        ],
        correctAnswers: [1],
        points: 1,
        explanation: "The maxSpeed() method returns horsepower * 2, so 150 * 2 = 300 mph."
    },

    // Question 47 - ArrayList Employee Management
    {
        id: 47,
        type: "single-choice",
        question: "Consider this Employee class and ArrayList usage:\n\n```java\nclass Employee {\n    private String name;\n    private double salary;\n    \n    public Employee(String name, double salary) {\n        this.name = name;\n        this.salary = salary;\n    }\n    \n    public double getSalary() {\n        return salary;\n    }\n}\n```\n\nIf you add employees with salaries: $45000, $55000, $60000, $48000, $65000 to an ArrayList and calculate the total, what would be the result?",
        options: [
            "$263000",
            "$273000",
            "$253000",
            "$283000"
        ],
        correctAnswers: [1],
        points: 2,
        explanation: "Total salary = 45000 + 55000 + 60000 + 48000 + 65000 = $273000"
    },

    // Question 48 - Software Development Lifecycle
    {
        id: 48,
        type: "multiple-choice",
        question: "Which of the following are key phases in the Software Development Life Cycle (SDLC)?",
        options: [
            "Requirements gathering and analysis",
            "System design and architecture",
            "Implementation and coding",
            "Testing and debugging",
            "Deployment and maintenance",
            "Hardware selection"
        ],
        correctAnswers: [0, 1, 2, 3, 4],
        points: 5,
        explanation: "The main SDLC phases include requirements gathering, design, implementation, testing, deployment, and maintenance. Hardware selection is not a core SDLC phase."
    },

    // Question 49 - Waterfall vs Agile
    {
        id: 49,
        type: "single-choice",
        question: "What is the main difference between Waterfall and Agile development methodologies?",
        options: [
            "Waterfall allows changes during development, Agile doesn't",
            "Waterfall is iterative, Agile is sequential",
            "Waterfall is sequential with phases, Agile is iterative with sprints",
            "There is no significant difference"
        ],
        correctAnswers: [2],
        points: 2,
        explanation: "Waterfall follows a sequential approach with distinct phases, while Agile uses iterative development with short sprints allowing for continuous feedback and adaptation."
    },

    // Question 50 - UML Diagram Types
    {
        id: 50,
        type: "multiple-choice",
        question: "Which of the following are types of UML diagrams used in systems design?",
        options: [
            "Class diagrams",
            "Use case diagrams",
            "Sequence diagrams",
            "Entity relationship diagrams",
            "Activity diagrams",
            "State machine diagrams"
        ],
        correctAnswers: [0, 1, 2, 4, 5],
        points: 5,
        explanation: "Class, use case, sequence, activity, and state machine diagrams are all UML diagram types. Entity relationship diagrams are used in database design but are not UML diagrams."
    },

    // Question 51 - System Design Principles
    {
        id: 51,
        type: "multiple-choice",
        question: "Which are important principles of good system design?",
        options: [
            "High cohesion within modules",
            "Low coupling between modules",
            "Separation of concerns",
            "Single responsibility principle",
            "High complexity",
            "Code reusability"
        ],
        correctAnswers: [0, 1, 2, 3, 5],
        points: 5,
        explanation: "Good system design emphasizes high cohesion, low coupling, separation of concerns, single responsibility, and reusability. High complexity should be avoided."
    },

    // Question 52 - Java Garbage Collection
    {
        id: 52,
        type: "single-choice",
        question: "What is the primary purpose of Java's garbage collection mechanism?",
        options: [
            "To delete source code files",
            "To automatically manage memory by freeing unused objects",
            "To compile Java code",
            "To optimize method calls"
        ],
        correctAnswers: [1],
        points: 2,
        explanation: "Java's garbage collection automatically manages memory by identifying and freeing objects that are no longer referenced, preventing memory leaks."
    },

    // Question 53 - Method Overloading vs Overriding
    {
        id: 53,
        type: "matching",
        question: "Match the concept with its correct description:",
        prompts: [
            "Method Overloading",
            "Method Overriding",
            "Compile-time polymorphism",
            "Runtime polymorphism"
        ],
        answers: [
            "Multiple methods with same name but different parameters",
            "Child class provides specific implementation of parent method",
            "Also known as method overloading",
            "Also known as method overriding"
        ],
        correctMatches: {
            "Method Overloading": "Multiple methods with same name but different parameters",
            "Method Overriding": "Child class provides specific implementation of parent method",
            "Compile-time polymorphism": "Also known as method overloading",
            "Runtime polymorphism": "Also known as method overriding"
        },
        points: 4,
        explanation: "Method overloading provides multiple methods with the same name but different parameters (compile-time polymorphism), while method overriding allows child classes to provide specific implementations of parent methods (runtime polymorphism)."
    },

    // Question 54 - Testing Types
    {
        id: 54,
        type: "multiple-choice",
        question: "Which of the following are common types of software testing?",
        options: [
            "Unit testing",
            "Integration testing",
            "System testing",
            "Acceptance testing",
            "Compilation testing",
            "Performance testing"
        ],
        correctAnswers: [0, 1, 2, 3, 5],
        points: 5,
        explanation: "Unit, integration, system, acceptance, and performance testing are all common testing types. Compilation testing is not a standard testing category."
    },

    // Question 55 - Java Package System
    {
        id: 55,
        type: "single-choice",
        question: "Analyze this code and determine the purpose of the package declaration:\n\n```java\npackage com.company.project;\nimport java.util.ArrayList;\n\npublic class DataManager {\n    private ArrayList<String> data;\n    \n    public DataManager() {\n        data = new ArrayList<>();\n    }\n}\n```\n\nWhat is the purpose of the package declaration in this code?",
        options: [
            "To import external libraries",
            "To organize classes into namespaces and prevent naming conflicts",
            "To define the class constructor",
            "To specify the class access level"
        ],
        correctAnswers: [1],
        points: 2,
        explanation: "The package declaration organizes classes into logical namespaces, preventing naming conflicts and providing a hierarchical structure for code organization."
    },

    // Question 56 - Design Patterns Introduction
    {
        id: 56,
        type: "single-choice",
        question: "What are design patterns in software development?",
        options: [
            "Visual layouts for user interfaces",
            "Reusable solutions to common software design problems",
            "Specific coding syntax rules",
            "Database table structures"
        ],
        correctAnswers: [1],
        points: 2,
        explanation: "Design patterns are reusable solutions to commonly occurring problems in software design, providing templates for how to solve problems in specific situations."
    },

    // Question 57 - Java Array vs ArrayList
    {
        id: 57,
        type: "multiple-choice",
        question: "What are the key differences between arrays and ArrayList in Java?",
        options: [
            "Arrays have fixed size, ArrayList is dynamic",
            "Arrays can store primitives, ArrayList stores objects",
            "ArrayList provides built-in methods like add(), remove()",
            "Arrays have better performance for accessing elements",
            "ArrayList requires import statement",
            "Arrays are objects, ArrayList are primitives"
        ],
        correctAnswers: [0, 1, 2, 3, 4],
        points: 5,
        explanation: "Arrays have fixed size while ArrayList is dynamic, arrays can store primitives directly while ArrayList stores objects, ArrayList provides utility methods, arrays have better access performance, and ArrayList requires import. The last option is incorrect - both are objects."
    },

    // Question 58 - System Architecture Layers
    {
        id: 58,
        type: "single-choice",
        question: "In a typical 3-tier architecture, what are the three main layers?",
        options: [
            "Input, Process, Output",
            "Client, Server, Database",
            "Presentation, Business Logic, Data Access",
            "Frontend, Backend, Storage"
        ],
        correctAnswers: [2],
        points: 2,
        explanation: "The 3-tier architecture consists of Presentation layer (user interface), Business Logic layer (application processing), and Data Access layer (database interaction)."
    },

    // Question 59 - Version Control Concepts
    {
        id: 59,
        type: "multiple-choice",
        question: "Which are important concepts in version control systems?",
        options: [
            "Repository (repo)",
            "Commit",
            "Branch",
            "Merge",
            "Rollback",
            "Compilation"
        ],
        correctAnswers: [0, 1, 2, 3, 4],
        points: 5,
        explanation: "Repository, commit, branch, merge, and rollback are all fundamental version control concepts. Compilation is related to building software, not version control."
    },

    // Question 60 - Java Static Keyword
    {
        id: 60,
        type: "single-choice",
        question: "Analyze this code and determine how to call the add method:\n\n```java\npublic class MathUtils {\n    public static final double PI = 3.14159;\n    \n    public static int add(int a, int b) {\n        return a + b;\n    }\n}\n```\n\nHow would you call the add method?",
        options: [
            "MathUtils obj = new MathUtils(); obj.add(5, 3);",
            "MathUtils.add(5, 3);",
            "add(5, 3);",
            "new MathUtils().add(5, 3);"
        ],
        correctAnswers: [1],
        points: 2,
        explanation: "Static methods belong to the class rather than instances, so they are called using the class name directly: MathUtils.add(5, 3)."
    },

    // Question 61 - Array Bounds Error Debug
    {
        id: 61,
        type: "single-choice",
        question: "Analyze this code and identify the issue:\n\n```java\nimport java.util.Arrays;\n\npublic class SortApp {\n    public static void main(String[] args) {\n        int[] nums = {8, 4, 6, 2};\n        Arrays.sort(nums);\n        for (int i = 0; i <= nums.length; i++) {\n            System.out.println(nums[i]);\n        }\n    }\n}\n```\n\nWhat is the issue and how to fix it?",
        options: [
            "Loop condition should be i < nums.length instead of i <= nums.length",
            "Arrays.sort() method doesn't exist",
            "Missing import statement for System class",
            "Array declaration syntax is incorrect"
        ],
        correctAnswers: [0],
        points: 3,
        explanation: "The issue is ArrayIndexOutOfBoundsException. The loop condition 'i <= nums.length' tries to access index 4 in an array of length 4 (valid indices 0-3). Fix: change to 'i < nums.length'."
    }
];

// Shuffle array function
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get random questions for exam
function getRandomQuestions(count = 20) {
    return shuffleArray(questionBank).slice(0, count);
}
