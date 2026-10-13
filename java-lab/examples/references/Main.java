public class Main {
    static void change(int[] p) {
        p[0] = 9;
        p = new int[]{7, 8};
        p[0] = 6;
    }
    public static void main(String[] args) {
        int[] a = {1, 2};
        change(a);
        System.out.println(a[0]);
    }
}
