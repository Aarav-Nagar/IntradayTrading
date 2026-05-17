import java.util.Scanner;

public class TicketBookingApp {
    private static final Scanner INPUT = new Scanner(System.in);

    public static void main(String[] args) {
        Seat[] seats = createSeats();
        boolean running = true;

        while (running) {
            System.out.println("\nConcert Tickets");
            System.out.println("1. View seats");
            System.out.println("2. Book ticket");
            System.out.println("3. View booked tickets");
            System.out.println("4. Quit");
            System.out.print("Choice: ");
            String choice = INPUT.nextLine();

            if (choice.equals("1")) {
                printSeats(seats);
            } else if (choice.equals("2")) {
                bookTicket(seats);
            } else if (choice.equals("3")) {
                printBookings(seats);
            } else if (choice.equals("4")) {
                running = false;
            }
        }
    }

    private static Seat[] createSeats() {
        Seat[] seats = new Seat[12];
        for (int i = 0; i < seats.length; i++) {
            char row = (char) ('A' + i / 4);
            int number = i % 4 + 1;
            seats[i] = new Seat(row + String.valueOf(number));
        }
        return seats;
    }

    private static void printSeats(Seat[] seats) {
        for (Seat seat : seats) {
            System.out.println(seat.display());
        }
    }

    private static void bookTicket(Seat[] seats) {
        printSeats(seats);
        System.out.print("Seat label: ");
        String label = INPUT.nextLine().trim().toUpperCase();
        Seat seat = findSeat(seats, label);
        if (seat == null || !seat.isAvailable()) {
            System.out.println("That seat is not available.");
            return;
        }

        System.out.print("Your name: ");
        String name = INPUT.nextLine().trim();
        System.out.print("Ticket type (general/vip): ");
        String type = INPUT.nextLine().trim().toLowerCase();

        Ticket ticket = type.equals("vip")
                ? new VipTicket(label, name)
                : new GeneralAdmissionTicket(label, name);
        seat.book(ticket);
        System.out.println("Booked: " + ticket);
    }

    private static Seat findSeat(Seat[] seats, String label) {
        for (Seat seat : seats) {
            if (seat.getLabel().equals(label)) {
                return seat;
            }
        }
        return null;
    }

    private static void printBookings(Seat[] seats) {
        for (Seat seat : seats) {
            if (!seat.isAvailable()) {
                System.out.println(seat.getTicket());
            }
        }
    }
}
