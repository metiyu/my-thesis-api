import sys
import json

print("ARGV:", sys.argv, file=sys.stderr)
if len(sys.argv) < 2:
    print("Missing input", file=sys.stderr)
else:
    print(sys.argv[1])