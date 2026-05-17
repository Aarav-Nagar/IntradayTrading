import java.util.ArrayList;

public class Library {
    private final ArrayList<LibraryItem> items;

    public Library() {
        items = new ArrayList<>();
    }

    public void addItem(LibraryItem item) {
        items.add(item);
    }

    public ArrayList<LibraryItem> search(String query) {
        ArrayList<LibraryItem> results = new ArrayList<>();
        for (LibraryItem item : items) {
            if (item.matches(query)) {
                results.add(item);
            }
        }
        return results;
    }

    public LibraryItem findByTitle(String title) {
        for (LibraryItem item : items) {
            if (item.getTitle().equalsIgnoreCase(title)) {
                return item;
            }
        }
        return null;
    }

    public ArrayList<LibraryItem> getItems() {
        return items;
    }
}
