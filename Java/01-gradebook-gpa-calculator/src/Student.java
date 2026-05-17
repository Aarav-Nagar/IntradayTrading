import java.util.ArrayList;

public class Student {
    private final String name;
    private final ArrayList<Double> homeworkScores;
    private final ArrayList<Double> quizScores;
    private final ArrayList<Double> examScores;

    public Student(String name) {
        this.name = name;
        this.homeworkScores = new ArrayList<>();
        this.quizScores = new ArrayList<>();
        this.examScores = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public void addHomework(double score) {
        homeworkScores.add(score);
    }

    public void addQuiz(double score) {
        quizScores.add(score);
    }

    public void addExam(double score) {
        examScores.add(score);
    }

    public double calculateFinalGrade() {
        return average(homeworkScores) * 0.30
                + average(quizScores) * 0.20
                + average(examScores) * 0.50;
    }

    public String getLetterGrade() {
        double grade = calculateFinalGrade();
        if (grade >= 90) {
            return "A";
        } else if (grade >= 80) {
            return "B";
        } else if (grade >= 70) {
            return "C";
        } else if (grade >= 60) {
            return "D";
        }
        return "F";
    }

    private double average(ArrayList<Double> scores) {
        if (scores.isEmpty()) {
            return 0.0;
        }

        double total = 0.0;
        for (double score : scores) {
            total += score;
        }
        return total / scores.size();
    }
}
