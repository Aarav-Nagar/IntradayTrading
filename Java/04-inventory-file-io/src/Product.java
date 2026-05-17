public class Product {
    private final String name;
    private final double price;
    private int quantity;

    public Product(String name, double price, int quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    public String getName() {
        return name;
    }

    public void addStock(int amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Amount cannot be negative.");
        }
        quantity += amount;
    }

    public boolean sell(int amount) {
        if (amount <= 0 || amount > quantity) {
            return false;
        }
        quantity -= amount;
        return true;
    }

    public String toCsv() {
        return name + "," + price + "," + quantity;
    }

    @Override
    public String toString() {
        return name + " - $" + String.format("%.2f", price) + " - qty " + quantity;
    }
}
