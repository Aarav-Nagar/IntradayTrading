public class PolynomialApp {
    public static void main(String[] args) {
        Polynomial first = new Polynomial();
        first.addTerm(3, 3);
        first.addTerm(5, 2);
        first.addTerm(2, 0);

        Polynomial second = new Polynomial();
        second.addTerm(4, 3);
        second.addTerm(-5, 2);
        second.addTerm(7, 1);

        Polynomial sum = first.add(second);

        System.out.println("First:  " + first);
        System.out.println("Second: " + second);
        System.out.println("Sum:    " + sum);
        System.out.println("Sum at x=2: " + sum.evaluate(2));
    }
}
