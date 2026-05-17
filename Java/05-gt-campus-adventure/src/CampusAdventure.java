import java.util.Scanner;

public class CampusAdventure {
    private static final Scanner INPUT = new Scanner(System.in);

    public static void main(String[] args) {
        Room culc = new Room("CULC", "Everyone is studying and every table is taken.");
        Room studentCenter = new Room("Student Center", "Food, noise, and someone tabling for a club.");
        Room klaus = new Room("Klaus", "A quiet hallway full of CS students.");
        Room library = new Room("Library", "The final boss: focus.");

        culc.connect("east", studentCenter);
        studentCenter.connect("west", culc);
        studentCenter.connect("north", klaus);
        klaus.connect("south", studentCenter);
        klaus.connect("east", library);
        library.connect("west", klaus);

        studentCenter.addItem("coffee");
        klaus.addItem("charger");

        Player player = new Player(culc);
        System.out.println("Goal: reach the Library with coffee and charger.");

        boolean running = true;
        while (running) {
            System.out.println(player.getCurrentRoom().describe());
            System.out.print("Command (go/take/inventory/quit): ");
            String command = INPUT.nextLine().trim().toLowerCase();

            if (command.startsWith("go ")) {
                Room next = player.getCurrentRoom().getExit(command.substring(3));
                if (next == null) {
                    System.out.println("You cannot go that way.");
                } else {
                    player.moveTo(next);
                }
            } else if (command.startsWith("take ")) {
                String item = command.substring(5);
                if (player.getCurrentRoom().removeItem(item)) {
                    player.take(item);
                    System.out.println("Took " + item + ".");
                } else {
                    System.out.println("That item is not here.");
                }
            } else if (command.equals("inventory")) {
                System.out.println(player.inventoryText());
            } else if (command.equals("quit")) {
                running = false;
            }

            if (player.getCurrentRoom() == library && player.has("coffee") && player.has("charger")) {
                System.out.println("You survived finals week. Nice.");
                running = false;
            }
        }
    }
}
