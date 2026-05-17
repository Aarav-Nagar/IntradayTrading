import java.util.ArrayList;

public class Player {
    private Room currentRoom;
    private final ArrayList<String> inventory;

    public Player(Room start) {
        this.currentRoom = start;
        this.inventory = new ArrayList<>();
    }

    public Room getCurrentRoom() {
        return currentRoom;
    }

    public void moveTo(Room room) {
        currentRoom = room;
    }

    public void take(String item) {
        inventory.add(item);
    }

    public boolean has(String item) {
        return inventory.contains(item);
    }

    public String inventoryText() {
        return inventory.toString();
    }
}
