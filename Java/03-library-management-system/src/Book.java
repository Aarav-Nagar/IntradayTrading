public class Book extends LibraryItem {
    private final String author;

    public Book(String title, String author) {
        super(title);
        this.author = author;
    }

    @Override
    public boolean matches(String search) {
        String text = (getTitle() + " " + author).toLowerCase();
        return text.contains(search.toLowerCase());
    }

    @Override
    public String toString() {
        return "Book: " + getTitle() + " by " + author + " (" + status() + ")";
    }
}
