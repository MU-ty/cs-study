public class Main {
    static int add(int a, int b) { return a + b; }
    static long factorial(int n) {
        if (n < 0 || n > 20) throw new IllegalArgumentException("n must be 0..20");
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
    public static void main(String[] args) {
        System.out.println(add(2, 3));
        System.out.println(factorial(4));
    }
}
