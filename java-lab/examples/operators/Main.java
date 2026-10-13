public class Main {
    public static void main(String[] args) {
        int a = 5, b = 2;
        System.out.println(a / b);
        System.out.println((double) a / b);
        String s = null;
        System.out.println(s != null && s.length() > 0);
        System.out.println("sum=" + a + b);
        System.out.println("sum=" + (a + b));
    }
}
