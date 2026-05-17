import java.util.ArrayList;
import java.util.HashMap;

public class Room {
    private final String name;
    private final String description;
    private final HashMap<String, Room> exits;
    private final ArrayList<String> items;

    public Room(String name, String description) {
        this.name = name;
        this.description = description;
        this.exits = new HashMap<>();
        this.items = new ArrayList<>();
    }

    public void connect(String direction, Room room) {
        exits.put(direction, room);
    }

    public Room getExit(String direction) {
        return exits.get(direction);
    }

    public void addItem(String item) {
        items.add(item);
    }

    public boolean removeItem(String item) {
        return items.remove(item);
    }

    public String describe() {
        return "\n" + name + "\n" + description + "\nItems: " + items + "\nExits: " + exits.keySet();
    }
}
