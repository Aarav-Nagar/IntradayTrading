public class GeneralAdmissionTicket extends Ticket {
    public GeneralAdmissionTicket(String seat, String holderName) {
        super(seat, holderName);
    }

    @Override
    public double getPrice() {
        return 45.00;
    }
}
