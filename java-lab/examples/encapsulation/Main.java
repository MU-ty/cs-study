public class Main {
    static class Account {
        private int cents;
        Account(int cents) {
            if (cents < 0) throw new IllegalArgumentException("negative balance");
            this.cents = cents;
        }
        void withdraw(int amount) {
            if (amount <= 0 || amount > cents) throw new IllegalArgumentException("invalid withdrawal");
            cents -= amount;
        }
        int balance() { return cents; }
    }
    public static void main(String[] args) {
        Account a = new Account(100);
        a.withdraw(30);
        System.out.println(a.balance());
    }
}
