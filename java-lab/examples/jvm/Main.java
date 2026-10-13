public class Main {
    public static void main(String[] args) {
        java.util.List<byte[]> retained = new java.util.ArrayList<>();
        retained.add(new byte[1024]);
        System.out.println(retained.size());
        retained.clear();
        System.out.println(retained.size());
    }
}
