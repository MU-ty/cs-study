public class Main {
    static class Box<T> {
        private final T value;
        Box(T value) { this.value = value; }
        T get() { return value; }
    }
    static double sum(java.util.List<? extends Number> list) {
        double total = 0;
        for (Number n : list) total += n.doubleValue();
        return total;
    }
    public static void main(String[] args) {
        Box<String> box = new Box<>("java");
        String value = box.get();
        System.out.println(value);
        java.util.List<Integer> numbers = java.util.List.of(1, 2, 3);
        System.out.println(sum(numbers));
    }
}
