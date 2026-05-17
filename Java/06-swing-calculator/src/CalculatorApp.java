import java.awt.BorderLayout;
import java.awt.GridLayout;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

public class CalculatorApp {
    private double storedValue = 0.0;
    private String pendingOperation = "";
    private boolean startNewNumber = true;
    private final JTextField display = new JTextField("0");

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new CalculatorApp().show());
    }

    private void show() {
        JFrame frame = new JFrame("Calculator");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(320, 420);

        display.setEditable(false);
        display.setHorizontalAlignment(JTextField.RIGHT);
        frame.add(display, BorderLayout.NORTH);

        JPanel buttons = new JPanel(new GridLayout(4, 4, 6, 6));
        String[] labels = {
                "7", "8", "9", "/",
                "4", "5", "6", "*",
                "1", "2", "3", "-",
                "C", "0", "=", "+"
        };

        for (String label : labels) {
            JButton button = new JButton(label);
            button.addActionListener(event -> handle(label));
            buttons.add(button);
        }

        frame.add(buttons, BorderLayout.CENTER);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    private void handle(String label) {
        if (label.matches("\\d")) {
            typeDigit(label);
        } else if (label.equals("C")) {
            clear();
        } else if (label.equals("=")) {
            calculate();
            pendingOperation = "";
        } else {
            storedValue = Double.parseDouble(display.getText());
            pendingOperation = label;
            startNewNumber = true;
        }
    }

    private void typeDigit(String digit) {
        if (startNewNumber || display.getText().equals("0")) {
            display.setText(digit);
            startNewNumber = false;
        } else {
            display.setText(display.getText() + digit);
        }
    }

    private void calculate() {
        double current = Double.parseDouble(display.getText());
        double result = current;
        if (pendingOperation.equals("+")) {
            result = storedValue + current;
        } else if (pendingOperation.equals("-")) {
            result = storedValue - current;
        } else if (pendingOperation.equals("*")) {
            result = storedValue * current;
        } else if (pendingOperation.equals("/") && current != 0) {
            result = storedValue / current;
        }
        display.setText(String.valueOf(result));
        startNewNumber = true;
    }

    private void clear() {
        storedValue = 0.0;
        pendingOperation = "";
        startNewNumber = true;
        display.setText("0");
    }
}
