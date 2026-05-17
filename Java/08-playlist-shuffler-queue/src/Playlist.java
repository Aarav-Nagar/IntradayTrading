import java.util.ArrayList;
import java.util.Random;

public class Playlist {
    private final ArrayList<Song> songs = new ArrayList<>();
    private int currentIndex = 0;

    public void addSong(Song song) {
        songs.add(song);
    }

    public boolean removeByTitle(String title) {
        for (int i = 0; i < songs.size(); i++) {
            if (songs.get(i).getTitle().equalsIgnoreCase(title)) {
                songs.remove(i);
                if (currentIndex >= songs.size()) {
                    currentIndex = 0;
                }
                return true;
            }
        }
        return false;
    }

    public Song nextSong() {
        if (songs.isEmpty()) {
            return null;
        }
        Song song = songs.get(currentIndex);
        currentIndex = (currentIndex + 1) % songs.size();
        return song;
    }

    public void shuffle() {
        Random random = new Random();
        for (int i = songs.size() - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            Song temp = songs.get(i);
            songs.set(i, songs.get(j));
            songs.set(j, temp);
        }
        currentIndex = 0;
    }

    public ArrayList<Song> getSongs() {
        return songs;
    }
}
