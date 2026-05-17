public abstract class Ticket {
    private final String seat;
    private final String holderName;

    public Ticket(String seat, String holderName) {
        this.seat = seat;
        this.holderName = holderName;
    }

    public String getSeat() {
        return seat;
    }

    public String getHolderName() {
        return holderName;
    }

    public abstract double getPrice();

    public String getPerks() {
        return "Entry to the concert";
    }

    @Override
    public String toString() {
        return seat + " - " + holderName + " - $" + String.format("%.2f", getPrice())
                + " - " + getPerks();
    }
}
