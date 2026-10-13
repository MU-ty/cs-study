public class Main {
    public static void main(String[] args) {
        java.util.Map<String, Integer> counts = new java.util.HashMap<>();
        for (String word : new String[]{"java", "redis", "java"}) {
            counts.merge(word, 1, Integer::sum);
        }
        System.out.println(counts.get("java"));
        System.out.println(counts.containsKey("go"));
    }
}
