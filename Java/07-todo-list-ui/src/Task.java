public class Task {
    private final String text;
    private boolean complete;

    public Task(String text) {
        this.text = text;
    }

    public void markComplete() {
        complete = true;
    }

    @Override
    public String toString() {
        return (complete ? "[done] " : "[todo] ") + text;
    }
}
