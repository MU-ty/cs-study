public class Main {
    static class Student {
        private final String name;
        private int score;
        Student(String name, int score) {
            this.name = name;
            this.score = score;
        }
        void addScore(int delta) { score += delta; }
    }
    public static void main(String[] args) {
        Student a = new Student("Mu", 80);
        Student b = new Student("Li", 90);
        a.addScore(5);
        System.out.println(a.name + ":" + a.score);
        System.out.println(b.name + ":" + b.score);
    }
}
