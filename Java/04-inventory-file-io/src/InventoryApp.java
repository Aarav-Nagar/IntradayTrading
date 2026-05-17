import java.io.FileNotFoundException;
import java.util.Scanner;

public class InventoryApp {
    private static final String FILE_PATH = "inventory.csv";
    private static final Scanner INPUT = new Scanner(System.in);

    public static void main(String[] args) {
        InventoryStore store = new InventoryStore();
        try {
            store.load(FILE_PATH);
        } catch (FileNotFoundException e) {
            System.out.println("Could not find " + FILE_PATH + ". Starting empty.");
        }

        boolean running = true;
        while (running) {
            System.out.println("\nInventory");
            System.out.println("1. List products");
            System.out.println("2. Add stock");
            System.out.println("3. Sell item");
            System.out.println("4. Save and quit");
            System.out.print("Choice: ");
            String choice = INPUT.nextLine();

            if (choice.equals("1")) {
                store.getProducts().forEach(System.out::println);
            } else if (choice.equals("2")) {
                adjust(store, true);
            } else if (choice.equals("3")) {
                adjust(store, false);
            } else if (choice.equals("4")) {
                save(store);
                running = false;
            }
        }
    }

    private static void adjust(InventoryStore store, boolean add) {
        System.out.print("Product name: ");
        Product product = store.find(INPUT.nextLine());
        if (product == null) {
            System.out.println("Product not found.");
            return;
        }

        System.out.print("Amount: ");
        int amount = Integer.parseInt(INPUT.nextLine());
        if (add) {
            product.addStock(amount);
            System.out.println("Stock updated.");
        } else if (product.sell(amount)) {
            System.out.println("Sale recorded.");
        } else {
            System.out.println("Not enough stock.");
        }
    }

    private static void save(InventoryStore store) {
        try {
            store.save(FILE_PATH);
            System.out.println("Saved.");
        } catch (FileNotFoundException e) {
            System.out.println("Could not save file.");
        }
    }
}
