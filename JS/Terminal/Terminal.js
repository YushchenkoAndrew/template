const prevComm = "[[;#5dade2;]$]";
const outputSign = "[[;#5dade2;] >]";
const highlightFolder = (name) => `[[;#f4d03f;]${name}]`;
const commands = ["test", "cc", "help", "cat", "history", "ls", "tree", "use", "cin", "run"];
const successCommand = (comm) => `[[;#aed581;]${comm}]`;
const int = (char) => (!!Number(char) ? Number(char) : char);

$("body").terminal(
  {
    test: () => {
      let terminal = $.terminal.active();
      terminal.update(-1, `${prevComm} ${successCommand("test")}`);

      terminal.echo(`${outputSign} It works!!`);
      terminal.echo(`${outputSign} [[;#f4d03f;]test]`);
      terminal.echo(`${outputSign} [[;#d32f2f;]test]`);

      terminal.echo(undefined);

      $.getJSON("FileStructure.json", (data) => {
        console.log(data.CodeRain);
      });

      const img = $('<img src="../CirclePacking/Neko.jpg">');
      terminal.echo(img);

      // terminal.scroll_to_bottom();
      // terminal.scroll(terminal.scrollBottomOffset);
    },

    cat: (fileName) => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("cat")} ${fileName}`);

      if (fileName.includes("png") || fileName.includes("jpg")) {
        $.terminal.active().echo($(`<img src="../${fileName}">`));
        return;
      }

      $.get("../" + fileName, (data, err) => $.terminal.active().echo(data)).fail(() => $.terminal.active().error(" > File not found!"));
    },

    cc: () => {
      $.terminal.active().clear();
      $.terminal.active().echo(`${outputSign} Type 'help' for printing all commands`);
    },

    ls: () => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("ls")}`);

      $.getJSON("FileStructure.json", (data) => {
        let list = [];
        for (let i in data) list.push(data[i] ? highlightFolder(i) : i);

        $.terminal.active().echo(list);
      });
    },

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
          // console.log();
        }

        // $.terminal.active().echo(list);
      });
    },

    help: () => {
      let terminal = $.terminal.active();
      terminal.update(-1, `${prevComm} ${successCommand("help")}`);

      terminal.echo(`${outputSign} Printing...\n${commands}`);
    },

    history: () => {
      let terminal = $.terminal.active();
      let history = terminal.history().data();
      terminal.update(-1, `${prevComm} ${successCommand("history")}`);

      for (let i in history) terminal.echo(`   ${i}\t${history[i]}`);
    },
  },
  {
    // height: 200,
    // width: window.innerWidth / 2,
    autocompleteMenu: true,
    completion: commands,
    greetings: `${outputSign} Type 'help' for printing all commands`,
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

function test(data) {
  $.terminal.active().echo(`${outputSign} ${data}`);
  console.log(data);
}
