public class Main {
    static int parsePositive(String text) {
        int n = Integer.parseInt(text);
        if (n <= 0) throw new IllegalArgumentException("must be positive");
        return n;
    }
    public static void main(String[] args) {
        try {
            System.out.println(parsePositive("-3"));
        } catch (IllegalArgumentException e) {
            System.out.println("invalid: " + e.getMessage());
        } finally {
            System.out.println("finished");
        }
    }
}
