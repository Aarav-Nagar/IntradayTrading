import java.util.ArrayList;
import java.util.Scanner;

public class LibraryApp {
    private static final Scanner INPUT = new Scanner(System.in);

    public static void main(String[] args) {
        Library library = seedLibrary();
        boolean running = true;

        while (running) {
            System.out.println("\nLibrary");
            System.out.println("1. List all");
            System.out.println("2. Search");
            System.out.println("3. Check out");
            System.out.println("4. Return");
            System.out.println("5. Quit");
            System.out.print("Choice: ");
            String choice = INPUT.nextLine();

            if (choice.equals("1")) {
                print(library.getItems());
            } else if (choice.equals("2")) {
                search(library);
            } else if (choice.equals("3")) {
                updateCheckout(library, true);
            } else if (choice.equals("4")) {
                updateCheckout(library, false);
            } else if (choice.equals("5")) {
                running = false;
            }
        }
    }

    private static Library seedLibrary() {
        Library library = new Library();
        library.addItem(new Book("Clean Code", "Robert Martin"));
        library.addItem(new Book("Effective Java", "Joshua Bloch"));
        library.addItem(new Media("Intro to Algorithms Lecture", "Video"));
        library.addItem(new Media("Java OOP Podcast", "Audio"));
        return library;
    }

    private static void search(Library library) {
        System.out.print("Search: ");
        print(library.search(INPUT.nextLine()));
    }

    private static void updateCheckout(Library library, boolean checkOut) {
        System.out.print("Exact title: ");
        LibraryItem item = library.findByTitle(INPUT.nextLine());
        if (item == null) {
            System.out.println("Not found.");
            return;
        }

        if (checkOut) {
            if (item.isCheckedOut()) {
                System.out.println("Already checked out.");
            } else {
                item.checkOut();
                System.out.println("Checked out.");
            }
        } else {
            item.returnItem();
            System.out.println("Returned.");
        }
    }

    private static void print(ArrayList<LibraryItem> items) {
        if (items.isEmpty()) {
            System.out.println("No results.");
        }
        for (LibraryItem item : items) {
            System.out.println(item);
        }
    }
}
