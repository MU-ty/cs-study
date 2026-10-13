public class Main {
    public static void main(String[] args) {
        int[] values = {3, 1, 4};
        int sum = 0;
        for (int i = 0; i < values.length; i++) {
            sum += values[i];
        }
        System.out.println(sum);
        int[][] grid = {{1, 2}, {3}};
        System.out.println(grid[1].length);
    }
}
