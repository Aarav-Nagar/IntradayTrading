public class Media extends LibraryItem {
    private final String format;

    public Media(String title, String format) {
        super(title);
        this.format = format;
    }

    @Override
    public boolean matches(String search) {
        String text = (getTitle() + " " + format).toLowerCase();
        return text.contains(search.toLowerCase());
    }

    @Override
    public String toString() {
        return "Media: " + getTitle() + " [" + format + "] (" + status() + ")";
    }
}
