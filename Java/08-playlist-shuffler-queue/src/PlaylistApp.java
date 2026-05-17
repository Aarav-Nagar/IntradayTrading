import java.util.Scanner;

public class PlaylistApp {
    private static final Scanner INPUT = new Scanner(System.in);

    public static void main(String[] args) {
        Playlist playlist = new Playlist();
        playlist.addSong(new Song("Golden Hour", "JVKE"));
        playlist.addSong(new Song("Viva La Vida", "Coldplay"));
        playlist.addSong(new Song("Sicko Mode", "Travis Scott"));

        boolean running = true;
        while (running) {
            System.out.println("\nPlaylist");
            System.out.println("1. Add song");
            System.out.println("2. Remove song");
            System.out.println("3. Shuffle");
            System.out.println("4. Next song");
            System.out.println("5. List songs");
            System.out.println("6. Quit");
            System.out.print("Choice: ");
            String choice = INPUT.nextLine();

            if (choice.equals("1")) {
                addSong(playlist);
            } else if (choice.equals("2")) {
                removeSong(playlist);
            } else if (choice.equals("3")) {
                playlist.shuffle();
                System.out.println("Shuffled.");
            } else if (choice.equals("4")) {
                System.out.println("Playing: " + playlist.nextSong());
            } else if (choice.equals("5")) {
                playlist.getSongs().forEach(System.out::println);
            } else if (choice.equals("6")) {
                running = false;
            }
        }
    }

    private static void addSong(Playlist playlist) {
        System.out.print("Title: ");
        String title = INPUT.nextLine();
        System.out.print("Artist: ");
        String artist = INPUT.nextLine();
        playlist.addSong(new Song(title, artist));
    }

    private static void removeSong(Playlist playlist) {
        System.out.print("Title to remove: ");
        if (playlist.removeByTitle(INPUT.nextLine())) {
            System.out.println("Removed.");
        } else {
            System.out.println("Song not found.");
        }
    }
}
