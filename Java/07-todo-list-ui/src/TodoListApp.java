import java.awt.BorderLayout;
import javax.swing.DefaultListModel;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

public class TodoListApp {
    private final DefaultListModel<Task> tasks = new DefaultListModel<>();
    private final JList<Task> list = new JList<>(tasks);
    private final JTextField input = new JTextField();

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new TodoListApp().show());
    }

    private void show() {
        JFrame frame = new JFrame("To-Do List");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(420, 320);

        JButton add = new JButton("Add");
        JButton complete = new JButton("Complete");
        JButton delete = new JButton("Delete");

        add.addActionListener(event -> addTask());
        complete.addActionListener(event -> completeTask());
        delete.addActionListener(event -> deleteTask());

        JPanel top = new JPanel(new BorderLayout());
        top.add(input, BorderLayout.CENTER);
        top.add(add, BorderLayout.EAST);

        JPanel bottom = new JPanel();
        bottom.add(complete);
        bottom.add(delete);

        frame.add(top, BorderLayout.NORTH);
        frame.add(list, BorderLayout.CENTER);
        frame.add(bottom, BorderLayout.SOUTH);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    private void addTask() {
        String text = input.getText().trim();
        if (!text.isEmpty()) {
            tasks.addElement(new Task(text));
            input.setText("");
        }
    }

    private void completeTask() {
        Task task = list.getSelectedValue();
        if (task != null) {
            task.markComplete();
            list.repaint();
        }
    }

    private void deleteTask() {
        int index = list.getSelectedIndex();
        if (index >= 0) {
            tasks.remove(index);
        }
    }
}
