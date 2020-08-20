const prevComm = "[[;#5dade2;]$]";
const outputSign = "[[;#5dade2;] >]";
const commands = ["test", "cc", "help", "cat", "history"];
const successCommand = (comm) => `[[;#aed581;]${comm}]`;

$("body").terminal(
  {
    test: () => {
      let terminal = $.terminal.active();
      terminal.update(-1, `${prevComm} ${successCommand("test")}`);

      terminal.echo(`${outputSign} It works!!`);
      terminal.echo(`${outputSign} [[;#f4d03f;]test]`);

      terminal.error("> Error message");
      terminal.echo(undefined);

      terminal.echo(terminal.history());

      // console.log(terminal.get_command());

      // terminal.scroll_to_bottom();
      // terminal.scroll(terminal.scrollBottomOffset);
    },

    cat: (fileName) => {
      $.terminal.active().update(-1, `${prevComm} ${successCommand("cat")} ${fileName}`);
      $.get("../" + fileName, (data, err) => $.terminal.active().echo(data)).fail(() => $.terminal.active().error("> File not found!"));
    },

    cc: () => {
      $.terminal.active().clear();
      $.terminal.active().echo("Type 'help' for printing all commands");
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
    greetings: "Type 'help' for printing all commands",
    prompt: "[[;#a569bd;]$ ]",
    keymap: {
      "CTRL+R": () => {},
    },
  },
);

$.terminal.defaults.formatters.push(function (str) {
  let strList = str.split(/((?:\s|&nbsp;)+)/);
  strList[0] = commands.indexOf(strList[0]) != -1 ? `[[;#aed581;]${strList[0]}]` : strList[0];
  // ??
  // `[[;#d32f2f;]${strList[0]}]`;

  return strList.join("");
});
