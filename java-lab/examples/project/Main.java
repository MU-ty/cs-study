public class Main {
    record Student(long id, String name, int score) {
        Student {
            if (id <= 0 || name == null || name.isBlank() || score < 0 || score > 100)
                throw new IllegalArgumentException("invalid student");
        }
    }
    static class GradeBook {
        private final java.util.Map<Long, Student> students = new java.util.HashMap<>();
        void add(Student s) {
            if (students.putIfAbsent(s.id(), s) != null)
                throw new IllegalArgumentException("duplicate id");
        }
        Student top() {
            return students.values().stream()
                .max(java.util.Comparator.comparingInt(Student::score)
                     .thenComparingLong(Student::id))
                .orElseThrow(() -> new IllegalStateException("empty gradebook"));
        }
        double average() {
            return students.values().stream().mapToInt(Student::score)
                .average().orElseThrow(() -> new IllegalStateException("empty gradebook"));
        }
    }
    public static void main(String[] args) {
        GradeBook book = new GradeBook();
        book.add(new Student(1, "Mu", 85));
        book.add(new Student(2, "Li", 92));
        System.out.println(book.top().name());
        System.out.println(book.average());
    }
}
