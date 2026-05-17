# Polynomial Math Calculator

This project represents a polynomial as a custom linked list. Each node stores one term: a coefficient and an exponent.

Example:

```text
3x^3 + 5x^2 + 2
```

The list stays sorted by exponent from largest to smallest. Adding polynomials means walking through the lists and combining matching exponents.

## Concepts

- custom linked list
- nodes
- traversal
- sorted insertion
- combining like terms

## Run

```bash
javac -d out src/*.java
java -cp out PolynomialApp
```
