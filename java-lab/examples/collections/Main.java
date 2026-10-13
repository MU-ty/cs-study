public class Main {
    public static void main(String[] args) {
        java.util.List<String> names = new java.util.ArrayList<>();
        names.add("Mu"); names.add("Mu");
        java.util.Set<String> unique = new java.util.HashSet<>(names);
        java.util.Map<String, Integer> scores = new java.util.HashMap<>();
        scores.put("Mu", 90);
        java.util.Deque<String> queue = new java.util.ArrayDeque<>();
        queue.addLast("A"); queue.addLast("B");
        System.out.println(names.size() + "," + unique.size());
        System.out.println(scores.get("Mu"));
        System.out.println(queue.removeFirst());
    }
}
