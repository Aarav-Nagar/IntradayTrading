# Java Practice Projects

This folder is my CS 1331-style Java practice set. The goal is to cover the main ideas from intro object-oriented programming without copying course prompts or solutions.

The projects start with console basics and move toward bigger OOP designs, file I/O, collections, GUI event handling, and a small linked-list data structure project.

## Projects

1. `01-gradebook-gpa-calculator`  
   Console grade calculator using classes, arrays/lists, loops, and conditionals.

2. `02-concert-ticket-booking`  
   Ticket booking system using inheritance and method overriding.

3. `03-library-management-system`  
   Library search, checkout, and return system using composition and collections.

4. `04-inventory-file-io`  
   Inventory manager that reads and writes CSV files.

5. `05-gt-campus-adventure`  
   Text adventure game with rooms, items, and player state.

6. `06-swing-calculator`  
   GUI calculator using Swing layouts and button events.

7. `07-todo-list-ui`  
   GUI task manager using Swing lists, buttons, and state updates.

8. `08-playlist-shuffler-queue`  
   Playlist manager using `ArrayList`, queue-style playback, and shuffle logic.

9. `09-polynomial-linked-list`  
   Polynomial calculator using a custom linked list.

## How to Compile

Each project has its own `src` folder. From a project folder:

```bash
javac -d out src/*.java
java -cp out MainClassName
```

For example:

```bash
cd Java/01-gradebook-gpa-calculator
javac -d out src/*.java
java -cp out GradebookApp
```

## What I Practiced

- variables, strings, input, and conditionals
- loops and methods
- arrays and `ArrayList`
- classes, constructors, fields, and methods
- encapsulation with private fields and public methods
- inheritance, overriding, and polymorphism
- exceptions and file input/output
- object composition
- GUI event handling
- custom linked-list traversal and insertion

These are practice projects, not official course solutions.
