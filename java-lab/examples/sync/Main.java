public class Main {
    public static void main(String[] args) throws Exception {
        
        java.util.concurrent.atomic.AtomicInteger count = new java.util.concurrent.atomic.AtomicInteger();
        Thread a = new Thread(() -> { for (int i = 0; i < 1000; i++) count.incrementAndGet(); });
        Thread b = new Thread(() -> { for (int i = 0; i < 1000; i++) count.incrementAndGet(); });
        a.start(); b.start();
        a.join(); b.join();
        System.out.println(count.get());
    }
}
