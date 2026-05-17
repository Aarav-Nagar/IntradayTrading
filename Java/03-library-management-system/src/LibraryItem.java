public abstract class LibraryItem {
    private final String title;
    private boolean checkedOut;

    public LibraryItem(String title) {
        this.title = title;
        this.checkedOut = false;
    }

    public String getTitle() {
        return title;
    }

    public boolean isCheckedOut() {
        return checkedOut;
    }

    public void checkOut() {
        checkedOut = true;
    }

    public void returnItem() {
        checkedOut = false;
    }

    public abstract boolean matches(String search);

    public String status() {
        return checkedOut ? "checked out" : "available";
    }
}
