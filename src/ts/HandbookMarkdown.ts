function getArgumentString(
  lines: Array<string>,
  current: number,
  commandName: string
): [string, number] {
  const line = lines[current].trim();
  let next = current;
  let argumentString = "";
  const start = line.indexOf("[", commandName.length + 1);
  if (start !== -1) {
    let stop = line.indexOf("]", start + 1);
    if (stop !== -1) {
      argumentString = line.substring(start + 1, stop);
    } else {
      argumentString = line.substring(start + 1);
      for (let i = current + 1; i < lines.length; i++) {
        stop = lines[i].indexOf("]");
        if (stop !== -1) {
          argumentString += lines[i].substring(0, stop);
          next = i;
          break;
        } else {
          argumentString += lines[i];
        }
      }
    }
  }
  argumentString = argumentString.replace(/ /g, "");
  return [argumentString, next];
}

function parseArgumentString(
  argumentString: string
): Record<string, boolean | string> {
  const output: Record<string, boolean | string> = {};
  for (const argument of argumentString.split(",")) {
    if (argument === "") {
      continue;
    }
    const tuple: Array<string> = argument.split("=");
    if (tuple.length !== 2) {
      output[tuple[0]] = true;
    } else {
      output[tuple[0]] = tuple[1];
    }
  }
  return output;
}

// Generic command processing functions
function filterCommand(
  text: string,
  commandName: string,
  command: (args: Record<string, boolean | string>) => string
): string {
  const lines = text.split("\n");
  let ret = "";
  for (let i = 0; i < lines.length; i++) {
    if (
      lines[i].trim().substring(0, commandName.length + 1) ===
      "!" + commandName
    ) {
      const arr = getArgumentString(lines, i, commandName);
      i = arr[1];
      ret += command(parseArgumentString(arr[0])) + "\n";
    } else {
      ret += lines[i] + "\n";
    }
  }
  return ret;
}

// Specific commands
function notesCommand(): string {
  //return "<textarea class=\"notes\" placeholder=\"Tvoje poznámky\"></textarea>";
  return "";
}

function pagebreakCommand(): string {
  return "";
}

// Showdown extensions definitions
const HandbookMarkdown = function (): Array<showdown.ShowdownExtension> {
  const responsiveTablesBegin = {
    type: "output",
    regex: "<table>",
    replace: '<div class="table-container"><table>',
  };
  const responsiveTablesEnd = {
    type: "output",
    regex: "</table>",
    replace: "</table></div>",
  };
  const fullLinks = {
    type: "output",
    regex: '<a href="(?!http://|https://)',
    replace: '<a href="http://',
  };
  const blankLinks = {
    type: "output",
    regex: "<a href",
    replace: '<a target="_blank" rel="noopener noreferrer" href',
  };
  const notes = {
    type: "lang",
    filter: function (text: string): string {
      return filterCommand(text, "linky", notesCommand);
    },
  };
  const pagebreak = {
    type: "lang",
    filter: function (text: string): string {
      return filterCommand(text, "novastrana", pagebreakCommand);
    },
  };
  return [
    responsiveTablesBegin,
    responsiveTablesEnd,
    fullLinks,
    blankLinks,
    notes,
    pagebreak,
  ];
};

//Register extensions
showdown.extension("HandbookMarkdown", HandbookMarkdown);
