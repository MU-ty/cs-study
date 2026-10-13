public class Main {
    public static void main(String[] args) throws Exception {
        
        java.util.concurrent.ExecutorService pool = java.util.concurrent.Executors.newFixedThreadPool(2);
        try {
            java.util.concurrent.Future<Integer> answer = pool.submit(() -> 6 * 7);
            System.out.println(answer.get(1, java.util.concurrent.TimeUnit.SECONDS));
        } finally {
            pool.shutdown();
        }
    }
}
