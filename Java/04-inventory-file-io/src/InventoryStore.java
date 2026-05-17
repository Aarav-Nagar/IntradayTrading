import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Scanner;

public class InventoryStore {
    private final ArrayList<Product> products;

    public InventoryStore() {
        products = new ArrayList<>();
    }

    public void load(String path) throws FileNotFoundException {
        products.clear();
        File file = new File(path);
        Scanner scanner = new Scanner(file);

        while (scanner.hasNextLine()) {
            String line = scanner.nextLine().trim();
            if (!line.isEmpty()) {
                String[] parts = line.split(",");
                products.add(new Product(
                        parts[0],
                        Double.parseDouble(parts[1]),
                        Integer.parseInt(parts[2])));
            }
        }
        scanner.close();
    }

    public void save(String path) throws FileNotFoundException {
        PrintWriter writer = new PrintWriter(path);
        for (Product product : products) {
            writer.println(product.toCsv());
        }
        writer.close();
    }

    public Product find(String name) {
        for (Product product : products) {
            if (product.getName().equalsIgnoreCase(name)) {
                return product;
            }
        }
        return null;
    }

    public ArrayList<Product> getProducts() {
        return products;
    }
}
