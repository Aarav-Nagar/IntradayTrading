public class VipTicket extends Ticket {
    public VipTicket(String seat, String holderName) {
        super(seat, holderName);
    }

    @Override
    public double getPrice() {
        return 120.00;
    }

    @Override
    public String getPerks() {
        return "Front section, early entry, and merch voucher";
    }
}
