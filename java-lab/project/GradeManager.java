import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.OptionalDouble;
import java.util.Scanner;

/** Java 17, single-threaded CLI. Persistence is UTF-8 TSV, not a database. */
public class GradeManager {
    private static final int MAX_RECORDS = 10_000;
    record Student(long id, String name, int score) {
        Student {
            if (id <= 0) throw new IllegalArgumentException("id must be positive");
            if (name == null || name.isBlank() || name.length() > 100 ||
                    name.indexOf('\t') >= 0 || name.indexOf('\r') >= 0 || name.indexOf('\n') >= 0)
                throw new IllegalArgumentException("name must be 1..100 characters without tabs/newlines");
            if (score < 0 || score > 100) throw new IllegalArgumentException("score must be 0..100");
        }
    }

    static class GradeBook {
        private final Map<Long, Student> students = new HashMap<>();
        void add(Student student) {
            if (students.containsKey(student.id())) throw new IllegalArgumentException("duplicate id");
            if (students.size() >= MAX_RECORDS) throw new IllegalArgumentException("too many records");
            students.put(student.id(), student);
        }
        Student get(long id) {
            Student student = students.get(id);
            if (student == null) throw new IllegalArgumentException("id not found");
            return student;
        }
        void update(long id, int score) {
            Student old = get(id);
            Student updated = new Student(id, old.name(), score); // validate before mutation
            students.put(id, updated);
        }
        void delete(long id) {
            get(id); // absent ID is an error, not a successful deletion
            students.remove(id);
        }
        List<Student> ranked() {
            return students.values().stream()
                    .sorted(Comparator.comparingInt(Student::score).reversed()
                            .thenComparingLong(Student::id)) // same score: lower ID first
                    .toList();
        }
        List<Student> byId() {
            return students.values().stream().sorted(Comparator.comparingLong(Student::id)).toList();
        }
        OptionalDouble average() {
            return students.values().stream().mapToInt(Student::score).average();
        }
        void save(Path requested) throws IOException {
            Path target = requested.toAbsolutePath().normalize();
            Path parent = target.getParent();
            if (parent == null || !Files.isDirectory(parent))
                throw new IOException("parent directory must already exist");
            Path temporary = Files.createTempFile(parent, ".java-grades-", ".tmp");
            try {
                try (BufferedWriter writer = Files.newBufferedWriter(temporary, StandardCharsets.UTF_8)) {
                    writer.write("id\tname\tscore\n");
                    for (Student student : byId()) {
                        writer.write(student.id() + "\t" + student.name() + "\t" + student.score());
                        writer.newLine();
                    }
                }
                try {
                    Files.move(temporary, target, StandardCopyOption.ATOMIC_MOVE,
                            StandardCopyOption.REPLACE_EXISTING);
                } catch (AtomicMoveNotSupportedException e) {
                    Files.move(temporary, target, StandardCopyOption.REPLACE_EXISTING);
                }
            } finally {
                Files.deleteIfExists(temporary);
            }
        }
        void load(Path file) throws IOException {
            Map<Long, Student> candidate = new HashMap<>(); // do not mutate live book until fully validated
            try (BufferedReader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {
                if (!"id\tname\tscore".equals(reader.readLine())) throw new IOException("invalid TSV header");
                int lineNumber = 1;
                String line;
                while ((line = reader.readLine()) != null) {
                    lineNumber++;
                    try {
                        String[] columns = line.split("\t", -1);
                        if (columns.length != 3) throw new IllegalArgumentException("expected 3 columns");
                        Student student = new Student(Long.parseLong(columns[0]), columns[1],
                                Integer.parseInt(columns[2]));
                        if (candidate.putIfAbsent(student.id(), student) != null)
                            throw new IllegalArgumentException("duplicate id");
                        if (candidate.size() > MAX_RECORDS) throw new IllegalArgumentException("too many records");
                    } catch (IllegalArgumentException e) {
                        throw new IOException("line " + lineNumber + ": " + e.getMessage(), e);
                    }
                }
            }
            students.clear();
            students.putAll(candidate);
        }
    }

    private static void print(Student student) {
        System.out.println(student.id() + "\t" + student.name() + "\t" + student.score());
    }
    private static void requireCount(String[] parts, int count) {
        if (parts.length != count) throw new IllegalArgumentException("wrong number of arguments; use help");
    }
    static void execute(GradeBook book, String line) throws IOException {
        String[] parts = line.strip().split("\\s+", 4);
        switch (parts[0]) {
            case "help" -> System.out.println("add <id> <score> <name...> | get <id> | update <id> <score> | " +
                    "delete <id> | list | top | avg | save <path> | load <path> | quit");
            case "add" -> { requireCount(parts, 4); book.add(new Student(Long.parseLong(parts[1]),
                    parts[3], Integer.parseInt(parts[2]))); System.out.println("OK added"); }
            case "get" -> { requireCount(parts, 2); print(book.get(Long.parseLong(parts[1]))); }
            case "update" -> { requireCount(parts, 3); book.update(Long.parseLong(parts[1]),
                    Integer.parseInt(parts[2])); System.out.println("OK updated"); }
            case "delete" -> { requireCount(parts, 2); book.delete(Long.parseLong(parts[1]));
                    System.out.println("OK deleted"); }
            case "list" -> { requireCount(parts, 1); List<Student> rows = book.ranked();
                    if (rows.isEmpty()) System.out.println("EMPTY"); else rows.forEach(GradeManager::print); }
            case "top" -> { requireCount(parts, 1); List<Student> rows = book.ranked();
                    if (rows.isEmpty()) System.out.println("EMPTY"); else print(rows.get(0)); }
            case "avg" -> { requireCount(parts, 1); OptionalDouble value = book.average();
                    System.out.println(value.isPresent() ? Double.toString(value.getAsDouble()) : "EMPTY"); }
            case "save", "load" -> {
                String path = line.strip().substring(parts[0].length()).strip();
                if (path.isEmpty()) throw new IllegalArgumentException("path required");
                if (parts[0].equals("save")) { book.save(Path.of(path)); System.out.println("OK saved"); }
                else { book.load(Path.of(path)); System.out.println("OK loaded"); }
            }
            default -> throw new IllegalArgumentException("unknown command; use help");
        }
    }
    public static void main(String[] args) {
        GradeBook book = new GradeBook();
        System.out.println("Java Grade Manager (Java 17). Type help; quit exits.");
        try (Scanner scanner = new Scanner(System.in, StandardCharsets.UTF_8)) {
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine().strip();
                if (line.isEmpty()) continue;
                if (line.equals("quit")) break;
                try { execute(book, line); }
                catch (IllegalArgumentException | IOException e) {
                    System.out.println("ERROR " + e.getMessage());
                }
            }
        }
    }
}
