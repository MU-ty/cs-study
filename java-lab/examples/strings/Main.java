public class Main {
    public static void main(String[] args) {
        String a = "java";
        String b = new String("java");
        System.out.println(a == b);
        System.out.println(a.equals(b));
        String c = a.toUpperCase();
        System.out.println(a + "," + c);
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < 3; i++) builder.append(i);
        System.out.println(builder);
    }
}
