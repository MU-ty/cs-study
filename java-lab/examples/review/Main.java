public class Main {
    public static void main(String[] args) {
        int[] x = {1};
        int[] y = x;
        y[0]++;
        System.out.println(x[0]);
        System.out.println(java.util.Objects.equals("java", new String("java")));
    }
}
