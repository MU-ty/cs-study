public class Main {
    record Student(int id, String name) {}
    enum Status { CREATED, PAID, CANCELLED }
    public static void main(String[] args) {
        Student a = new Student(42, "Mu");
        Student b = new Student(42, "Mu");
        System.out.println(a.equals(b));
        java.util.Set<Student> set = new java.util.HashSet<>();
        set.add(a); set.add(b);
        System.out.println(set.size());
        System.out.println(Status.PAID);
    }
}
