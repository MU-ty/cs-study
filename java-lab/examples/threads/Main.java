public class Main {
    public static void main(String[] args) throws Exception {
        
        Thread worker = new Thread(() -> System.out.println("worker"));
        worker.start();
        worker.join();
        System.out.println("done");
    }
}
