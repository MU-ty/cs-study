"""Black-box CLI checks; Java 17+ source-file launcher required."""
from pathlib import Path
import subprocess
import tempfile
import unittest

SOURCE = Path(__file__).resolve().parent / 'GradeManager.java'

class ProjectTests(unittest.TestCase):
    def run_cli(self, commands, cwd):
        result = subprocess.run(['java', str(SOURCE)], input=commands, capture_output=True,
                                text=True, encoding='utf-8', cwd=cwd, timeout=15)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stderr, '')
        return result.stdout

    def test_crud_and_tie_order(self):
        with tempfile.TemporaryDirectory() as d:
            out = self.run_cli('add 2 85 Li Ming\nadd 1 85 穆天宇\nlist\nupdate 2 95\ntop\navg\ndelete 2\nget 1\nquit\n', d)
            self.assertIn('1\t穆天宇\t85\n2\tLi Ming\t85', out)
            self.assertIn('2\tLi Ming\t95', out)
            self.assertIn('\n90.0\n', out)
            self.assertIn('OK deleted\n1\t穆天宇\t85', out)

    def test_invalid_commands_do_not_change_state(self):
        with tempfile.TemporaryDirectory() as d:
            out = self.run_cli('add 1 85 Mu\nadd 1 99 Changed\nupdate 1 101\nadd -1 90 Negative\nadd 2 bad Error\nget 1\nlist\nquit\n', d)
            self.assertEqual(out.count('OK added'), 1)
            self.assertIn('ERROR duplicate id', out)
            self.assertIn('ERROR score must be 0..100', out)
            self.assertIn('1\tMu\t85', out)
            self.assertNotIn('1\tChanged', out)

    def test_utf8_save_and_full_reload(self):
        with tempfile.TemporaryDirectory() as d:
            out = self.run_cli('add 2 92 Li Ming\nadd 1 85 穆天宇\nsave grades.tsv\ndelete 1\nload grades.tsv\nget 1\nquit\n', d)
            self.assertIn('OK saved', out)
            self.assertIn('OK loaded', out)
            self.assertIn('1\t穆天宇\t85', out)
            expected = 'id\tname\tscore\n1\t穆天宇\t85\n2\tLi Ming\t92\n'
            self.assertEqual((Path(d) / 'grades.tsv').read_text(encoding='utf-8'), expected)
            self.assertEqual(list(Path(d).glob('.java-grades-*')), [])

    def test_corrupt_or_duplicate_import_preserves_original(self):
        with tempfile.TemporaryDirectory() as d:
            (Path(d) / 'corrupt.tsv').write_text('id\tname\tscore\n2\tNew\t90\n3\tBad\t101\n', encoding='utf-8')
            (Path(d) / 'duplicate.tsv').write_text('id\tname\tscore\n2\tNew\t90\n2\tAgain\t80\n', encoding='utf-8')
            out = self.run_cli('add 1 85 Original\nload corrupt.tsv\nlist\nload duplicate.tsv\nlist\nquit\n', d)
            self.assertIn('ERROR line 3: score must be 0..100', out)
            self.assertIn('ERROR line 3: duplicate id', out)
            self.assertEqual(out.count('1\tOriginal\t85'), 2)
            self.assertNotIn('2\tNew\t90', out)

    def test_failed_save_and_bad_header_are_visible(self):
        with tempfile.TemporaryDirectory() as d:
            (Path(d) / 'bad.tsv').write_text('wrong header\n', encoding='utf-8')
            out = self.run_cli('add 1 85 Mu\nsave nonexistent/grades.tsv\nload bad.tsv\nget 1\nquit\n', d)
            self.assertIn('ERROR parent directory must already exist', out)
            self.assertIn('ERROR invalid TSV header', out)
            self.assertIn('1\tMu\t85', out)
            self.assertNotIn('OK saved', out)

    def test_empty_book_and_empty_file_replace(self):
        with tempfile.TemporaryDirectory() as d:
            (Path(d) / 'empty.tsv').write_text('id\tname\tscore\n', encoding='utf-8')
            out = self.run_cli('top\navg\nlist\nadd 1 85 Mu\nload empty.tsv\nlist\nquit\n', d)
            self.assertEqual(out.count('EMPTY'), 4)
            self.assertIn('OK loaded', out)

if __name__ == '__main__':
    unittest.main(verbosity=2)
