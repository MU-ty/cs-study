public class Main {
    public static void main(String[] args) throws Exception {
        
        java.nio.file.Path file = java.nio.file.Files.createTempFile("java-lab-", ".txt");
        try {
            java.nio.file.Files.writeString(file, "你好 Java", java.nio.charset.StandardCharsets.UTF_8);
            String text = java.nio.file.Files.readString(file, java.nio.charset.StandardCharsets.UTF_8);
            System.out.println(text);
        } finally {
            java.nio.file.Files.deleteIfExists(file);
        }
    }
}
