public class Main {
    public static void main(String[] args) {
        int n = 5;
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        System.out.println(sum);
        int score = 85;
        if (score >= 90) System.out.println("A");
        else if (score >= 60) System.out.println("pass");
        else System.out.println("fail");
    }
}
