public class Main {
    static class Animal {
        String label = "animal";
        String voice() { return "unknown"; }
    }
    static class Dog extends Animal {
        String label = "dog";
        @Override String voice() { return "woof"; }
    }
    public static void main(String[] args) {
        Animal animal = new Dog();
        System.out.println(animal.voice());
        System.out.println(animal.label);
    }
}
