public class Seat {
    private final String label;
    private Ticket ticket;

    public Seat(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public boolean isAvailable() {
        return ticket == null;
    }

    public void book(Ticket ticket) {
        if (!isAvailable()) {
            throw new IllegalStateException("Seat is already booked.");
        }
        this.ticket = ticket;
    }

    public String display() {
        return isAvailable() ? label + " [open]" : label + " [booked]";
    }

    public Ticket getTicket() {
        return ticket;
    }
}
