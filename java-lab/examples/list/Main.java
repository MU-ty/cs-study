public class Main {
    public static void main(String[] args) {
        java.util.List<Integer> list = new java.util.ArrayList<>(java.util.List.of(1, 2, 3, 4));
        list.removeIf(n -> n % 2 == 0);
        System.out.println(list);
        list.remove(Integer.valueOf(1));
        System.out.println(list);
    }
}
