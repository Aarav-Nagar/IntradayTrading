public class Polynomial {
    private TermNode head;

    public void addTerm(double coefficient, int exponent) {
        if (coefficient == 0) {
            return;
        }

        TermNode newNode = new TermNode(coefficient, exponent);
        if (head == null || exponent > head.exponent) {
            newNode.next = head;
            head = newNode;
            return;
        }

        if (head.exponent == exponent) {
            head.coefficient += coefficient;
            removeZeroHead();
            return;
        }

        TermNode current = head;
        while (current.next != null && current.next.exponent > exponent) {
            current = current.next;
        }

        if (current.next != null && current.next.exponent == exponent) {
            current.next.coefficient += coefficient;
            if (current.next.coefficient == 0) {
                current.next = current.next.next;
            }
        } else {
            newNode.next = current.next;
            current.next = newNode;
        }
    }

    public Polynomial add(Polynomial other) {
        Polynomial result = new Polynomial();
        copyTermsInto(result, this.head);
        copyTermsInto(result, other.head);
        return result;
    }

    public double evaluate(double x) {
        double total = 0.0;
        TermNode current = head;
        while (current != null) {
            total += current.coefficient * Math.pow(x, current.exponent);
            current = current.next;
        }
        return total;
    }

    private void copyTermsInto(Polynomial result, TermNode node) {
        TermNode current = node;
        while (current != null) {
            result.addTerm(current.coefficient, current.exponent);
            current = current.next;
        }
    }

    private void removeZeroHead() {
        if (head != null && head.coefficient == 0) {
            head = head.next;
        }
    }

    @Override
    public String toString() {
        if (head == null) {
            return "0";
        }

        StringBuilder builder = new StringBuilder();
        TermNode current = head;
        while (current != null) {
            if (builder.length() > 0 && current.coefficient > 0) {
                builder.append(" + ");
            } else if (current.coefficient < 0) {
                builder.append(" - ");
            }

            double absCoefficient = Math.abs(current.coefficient);
            builder.append(absCoefficient);
            if (current.exponent > 0) {
                builder.append("x^").append(current.exponent);
            }
            current = current.next;
        }
        return builder.toString().trim();
    }
}
