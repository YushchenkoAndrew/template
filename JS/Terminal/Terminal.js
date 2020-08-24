const prevComm = "[[;#5dade2;]$]";
const outputSign = "[[;#5dade2;] >]";
const highlightFolder = (name) => `[[;#f4d03f;]${name}]`;
const commands = ["example", "cc", "help", "cat", "history", "ls", "tree", "use", "cin", "run", "func", "watch", "set", "print", "show"];
const successCommand = (comm) => `[[;#aed581;]${comm}]`;
const int = (char) => (!!Number(char) ? Number(char) : char);
const highlightCommand = (command) => command.replace(/</g, "[[;#f7dc6f;]<").replace(/>/g, ">]");
const highlightAnnotation = (str) => str.replace("(", "[[;#cb4335;](").replace(")", ")]");

var test = "hello world!!";

$("body").terminal(
  {
    example: async () => {
      let terminal = $.terminal.active();
      terminal.update(-1, `${prevComm} ${successCommand("test")}`);

      terminal.echo(`${outputSign} [[;#f4d03f;]Hello world]`);

      // Command - history
      terminal.exec("history");

      // Command - cin
      terminal.exec("cin testFunc Its_Work!");

      // Command - cat
      terminal.exec("cat app.js");
      terminal.exec("cat CirclePacking/Neko.jpg");

      // Command - help
      terminal.exec("help -l");

      // Command - ls
      terminal.exec("ls");

      // Command - tree
      terminal.exec("tree");

      // Command - print
      terminal.exec("print testFunc");
    },

    cat: (fileName) => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("cat")} ${fileName}`);

      if (fileName.includes("png") || fileName.includes("jpg")) {
        $.getJSON("FileStructure.json", (data) =>
          $.terminal.active().echo($(`<img src="${(data[fileName.split("/")[0]] ? "../" : "") + fileName}">`))
        ).fail(() => $.terminal.active().error(" > File not found!"));
        return;
      }

      if (fileName.includes(".json")) {
        $.getJSON("../" + fileName, (data) => $.terminal.active().echo($(`<p>${JSON.stringify(data)}</p>`))).fail(() =>
          $.terminal.active().error(" > File not found!")
        );
        return;
      }

      $.get("../" + fileName, (data) => $.terminal.active().echo(data)).fail(() => $.terminal.active().error(" > File not found!"));
    },

    cc: () => {
      $.terminal.active().clear();
      $.terminal.active().echo(`${outputSign} Type 'help -a' for showing commands`);
    },

    ls: () => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("ls")}`);

      $.getJSON("FileStructure.json", (data) => {
        let list = [];
        for (let i in data) list.push(data[i] ? highlightFolder(i) : i);

        $.terminal.active().echo(list);
      });
    },

    // Maybe create this function later~~
    use: (dir) => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("use")} ${dir}`);
      // $.getJSON("FileStructure.json", (data) => {
      //   if (data[dir])
      //     // console.log(dir);
      //     $.terminal.active().push(
      //       {},
      //       {
      //         prompt: `[[;#a569bd;]${dir} $ ]`,
      //       },
      //     );
      //   else $.terminal.active().echo(`${outputSign} No such directory: ${dir}`);
      // });
    },

    cin: function (funcName, input) {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("cin")} ${funcName} ${input}`);

      if (typeof window[funcName] !== "function") {
        $.terminal.active().error(` > No such Function: ${funcName}`);
        return;
      }

      window[funcName](...("" + input).split(",").map((x) => (x == "$0" ? undefined : int(x))));
    },

    run: (url) => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("run")} ${url}`);

      $.getJSON("FileStructure.json", (data) => (window.location = data[url] ? `../${url}` : url));
    },

    tree: () => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("tree")}`);

      $.getJSON("FileStructure.json", (data) => {
        for (let i in data) {
          if (!data[i]) {
            $.terminal.active().echo(`|- ${i}`);
            continue;
          }

          $.terminal.active().echo(`|- ${highlightFolder(i)}`);
          for (var j = 0; j < data[i].length - 1; j++) $.terminal.active().echo(`|\t|--- ${data[i][j]}`);
          $.terminal.active().echo(`|\t+--- ${data[i][j]}\n|`);
        }

        // $.terminal.active().echo(list);
      });
    },

    help: (flag) => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("help")} ${flag}`);

      if (flag == "-l") {
        $.terminal.active().echo(`${outputSign} [[;#85c1e9;]COMMAND]`);
        for (let i in commands) $.terminal.active().echo(commands[i]);
        return;
      }

      // Print Header
      $.terminal.active().echo(`${outputSign}\t[[;#85c1e9;]COMMAND] \t [[;#85c1e9;]DESCRIPTION]`);

      $.getJSON("Help.json", (data) => {
        for (let i of commands) {
          let { command, description } = data[i];
          $.terminal.active().echo(`${highlightCommand(command)}\n`);

          let indent = " ".repeat(command.length > 15 ? 15 : command.length);
          let formattedStr = "";
          let step = 40 - indent.length;

          for (let i = 0; i < description.length; i += step) formattedStr += [highlightAnnotation(description.slice(i, i + step)), "\n", indent].join("");

          $.terminal.active().echo(`${indent}${formattedStr}`);
        }
      });
    },

    func: () => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("func")}`);

      $.getJSON("FuncList.json", (data) => {
        $.terminal.active().echo(`${outputSign}\t[[;#85c1e9;]FUNC] \t [[;#85c1e9;]PARAMETERS] \t [[;#85c1e9;]TYPE]`);

        for (let i in data) {
          $.terminal.active().echo(`${highlightFolder(i)}`);
          let indent = " ".repeat(i.length);

          for (let j in data[i].parameters) $.terminal.active().echo(`${indent}${data[i].parameters[j]}  --  [[;#cb4335;]${data[i].type[j]}]`);
          $.terminal.active().echo();
        }
      });
    },

    watch: async (funcName) => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("watch")} ${funcName}`);
      $.terminal.active().echo(`${outputSign}`);
      $.terminal.active().pause();

      if (!window[funcName]) {
        $.terminal.active().update(-1, `[[;#cb4335;] > No such Function or Variable: ${funcName}]`);
        return;
      }

      while ($.terminal.active().paused()) {
        $.terminal.active().update(-1, `${outputSign} ${typeof window[funcName] === "function" ? window[funcName]() : window[funcName]}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    },

    set: (variable, value) => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("set")} ${variable} ${value}`);

      if (!window[variable]) {
        $.terminal.active().error(` > No such Function or Variable: ${funcName}]`);
        return;
      }

      window[variable] = int(value);
      $.terminal.active().echo(`${outputSign} ${variable} = ${window[variable]}`);
    },

    print: (variable) => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("print")} ${variable}`);

      if (!window[variable]) {
        $.terminal.active().error(` > No such Function or Variable: ${funcName}]`);
        return;
      }

      $.terminal.active().echo(`${outputSign} ${variable} = ${window[variable]}`);
    },

    show: (fileName) => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("show")} ${fileName}`);

      $.get("../" + fileName, async (data) => {
        let lines = data.split("\n");

        for (let i in lines) {
          $.terminal.active().echo(`${outputSign}`);

          let wordList = lines[i].split(" ");
          for (let j = 1; j <= wordList.length; j++) {
            $.terminal.active().update(-1, `${outputSign} ${highlightAnnotation(wordList.slice(0, j).join(" "))}`);
            await new Promise((resolve) => setTimeout(resolve, 150));
          }
        }

        // $.terminal.active().echo(data);
      }).fail(() => $.terminal.active().error(" > File not found!"));
    },

    history: () => {
      let terminal = $.terminal.active();
      let history = terminal.history().data();
      terminal.update(-1, `${prevComm} ${successCommand("history")}`);

      for (let i in history) terminal.echo(`   ${i}\t${history[i]}`);
    },
  },
  {
    height: 550,
    width: 450,
    autocompleteMenu: true,
    completion: commands,
    greetings: `${outputSign} Type 'help -a' for showing commands`,
    prompt: "[[;#a569bd;]$ ]",
    keymap: {
      "CTRL+R": () => {},
    },
  }
);

$.terminal.defaults.formatters.push(function (str) {
  let strList = str.split(/((?:\s|&nbsp;)+)/);
  strList[0] = commands.indexOf(strList[0]) != -1 ? `[[;#aed581;]${strList[0]}]` : strList[0];

  return strList.join("");
});

function testFunc(data) {
  $.terminal.active().echo(`${outputSign} ${data}`);
  console.log(data);
}
