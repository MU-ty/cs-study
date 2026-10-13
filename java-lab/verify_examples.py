"""Run each standalone Java 17 core example and compare its expected stdout.
Requires a Java 17+ installation supporting source-file launch mode.
JDBC integration snippets and Java 21 extras are explicitly not exercised here.
"""
from pathlib import Path
import concurrent.futures
import json
import subprocess
import sys

ROOT = Path(__file__).resolve().parent

def verify(example):
    result = subprocess.run(
        ['java', str(ROOT / example['file'])],
        capture_output=True, text=True, timeout=20,
    )
    ok = result.returncode == 0 and result.stdout.strip() == example['expected'].strip()
    return example['id'], ok, result.stderr, result.stdout

if __name__ == '__main__':
    examples = json.loads((ROOT / 'examples.json').read_text(encoding='utf-8'))
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        results = list(pool.map(verify, examples))
    for name, ok, stderr, stdout in results:
        print(f'{name}: {"PASS" if ok else "FAIL"}')
        if not ok:
            print(stderr or f'Unexpected stdout: {stdout!r}')
    passed = sum(ok for _, ok, _, _ in results)
    print(f'{passed}/{len(results)} standalone examples passed')
    sys.exit(0 if passed == len(results) else 1)
