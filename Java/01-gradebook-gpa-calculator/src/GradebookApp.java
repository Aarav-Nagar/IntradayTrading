import java.util.ArrayList;
import java.util.Scanner;

public class GradebookApp {
    private static final Scanner INPUT = new Scanner(System.in);

    public static void main(String[] args) {
        ArrayList<Student> students = new ArrayList<>();
        boolean running = true;

        while (running) {
            printMenu();
            String choice = INPUT.nextLine().trim();

            if (choice.equals("1")) {
                addStudent(students);
            } else if (choice.equals("2")) {
                addScore(students);
            } else if (choice.equals("3")) {
                printReport(students);
            } else if (choice.equals("4")) {
                running = false;
            } else {
                System.out.println("Please choose a valid option.");
            }
        }
    }

    private static void printMenu() {
        System.out.println("\nGradebook");
        System.out.println("1. Add student");
        System.out.println("2. Add score");
        System.out.println("3. Print grade report");
        System.out.println("4. Quit");
        System.out.print("Choice: ");
    }

    private static void addStudent(ArrayList<Student> students) {
        System.out.print("Student name: ");
        String name = INPUT.nextLine().trim();
        students.add(new Student(name));
        System.out.println("Added " + name + ".");
    }

    private static void addScore(ArrayList<Student> students) {
        Student student = chooseStudent(students);
        if (student == null) {
            return;
        }

        System.out.print("Category (homework/quiz/exam): ");
        String category = INPUT.nextLine().trim().toLowerCase();
        System.out.print("Score: ");
        double score = Double.parseDouble(INPUT.nextLine());

        if (category.equals("homework")) {
            student.addHomework(score);
        } else if (category.equals("quiz")) {
            student.addQuiz(score);
        } else if (category.equals("exam")) {
            student.addExam(score);
        } else {
            System.out.println("Unknown category.");
            return;
        }

        System.out.println("Score saved.");
    }

    private static Student chooseStudent(ArrayList<Student> students) {
        if (students.isEmpty()) {
            System.out.println("No students yet.");
            return null;
        }

        for (int i = 0; i < students.size(); i++) {
            System.out.println((i + 1) + ". " + students.get(i).getName());
        }

        System.out.print("Student number: ");
        int index = Integer.parseInt(INPUT.nextLine()) - 1;
        if (index < 0 || index >= students.size()) {
            System.out.println("Invalid student.");
            return null;
        }
        return students.get(index);
    }

    private static void printReport(ArrayList<Student> students) {
        System.out.println("\nGrade Report");
        for (Student student : students) {
            System.out.printf("%-20s %.2f%% %s%n",
                    student.getName(),
                    student.calculateFinalGrade(),
                    student.getLetterGrade());
        }
    }
}
