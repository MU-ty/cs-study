public class Main {
    public static void main(String[] args) {
        java.util.List<Integer> scores = java.util.List.of(50, 80, 90, 80);
        java.util.List<Integer> result = scores.stream()
            .filter(x -> x >= 60)
            .map(x -> x + 5)
            .distinct()
            .sorted()
            .toList();
        System.out.println(result);
        System.out.println(scores);
    }
}
