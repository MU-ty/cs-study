public class Main {
    public static void main(String[] args) {
        java.math.BigDecimal price = new java.math.BigDecimal("0.1");
        java.math.BigDecimal total = price.add(new java.math.BigDecimal("0.2"));
        System.out.println(total);
        java.time.LocalDate date = java.time.LocalDate.of(2026, 10, 13);
        System.out.println(date.plusDays(1));
        System.out.println(java.time.Duration.ofMinutes(5).getSeconds());
    }
}
