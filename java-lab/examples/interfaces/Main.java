public class Main {
    interface MessageSender { void send(String text); }
    static class ConsoleSender implements MessageSender {
        @Override public void send(String text) { System.out.println(text); }
    }
    static class NotifyService {
        private final MessageSender sender;
        NotifyService(MessageSender sender) { this.sender = sender; }
        void notifyUser(String text) { sender.send(text); }
    }
    public static void main(String[] args) {
        MessageSender sender = new ConsoleSender();
        NotifyService service = new NotifyService(sender);
        service.notifyUser("hello");
    }
}
