import os

def print_tree(start_path, prefix=""):
    # Sort folders first, then files
    entries = sorted(os.listdir(start_path), key=lambda x: (not os.path.isdir(os.path.join(start_path, x)), x.lower()))
    for i, entry in enumerate(entries):
        path = os.path.join(start_path, entry)
        connector = "└── " if i == len(entries) - 1 else "├── "
        print(prefix + connector + entry)
        if os.path.isdir(path):
            new_prefix = prefix + ("    " if i == len(entries) - 1 else "│   ")
            print_tree(path, new_prefix)

if __name__ == "__main__":
    base_dir = "."  # current directory
    print(f"Directory tree for: {os.path.abspath(base_dir)}\n")
    print_tree(base_dir)

