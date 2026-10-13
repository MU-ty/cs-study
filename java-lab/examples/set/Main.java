public class Main {
    public static void main(String[] args) {
        java.util.Set<Integer> set = new java.util.TreeSet<>();
        set.add(3); set.add(1); set.add(3);
        System.out.println(set);
        java.util.List<Integer> list = new java.util.ArrayList<>(java.util.List.of(5, -2, 9));
        list.sort(java.util.Comparator.reverseOrder());
        System.out.println(list);
    }
}
