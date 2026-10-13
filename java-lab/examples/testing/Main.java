public class Main {
    static int max(int[] values) {
        if (values == null || values.length == 0) throw new IllegalArgumentException("empty input");
        int answer = values[0];
        for (int value : values) answer = Math.max(answer, value);
        return answer;
    }
    public static void main(String[] args) {
        System.out.println(max(new int[]{-3, -1, -7}));
        try {
            max(new int[0]);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}
