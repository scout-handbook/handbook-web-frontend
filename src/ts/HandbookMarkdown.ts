function getArgumentString(lines: Array<string>, current: number, commandName: string): [string, number]
{
	var line = lines[current].trim();
	var next = current;
	var argumentString = "";
	var start = line.indexOf("[", commandName.length + 1)
	if(start !== -1)
	{
		var stop = line.indexOf("]", start + 1);
		if(stop !== -1)
		{
			argumentString = line.substring(start + 1, stop);
		}
		else
		{
			argumentString = line.substring(start + 1);
			for(var i = current + 1; i < lines.length; i++)
			{
				stop = lines[i].indexOf("]");
				if(stop !== -1)
				{
					argumentString += lines[i].substring(0, stop);
					next = i;
					break;
				}
				else
				{
					argumentString += lines[i];
				}
			}
		}
	}
	argumentString = argumentString.replace(/ /g, "");
	return [argumentString, next];
}

function parseArgumentString(argumentString: string): Arguments
{
	var output: Arguments = {};
	var list: Array<string> = argumentString.split(",");
	for(var i = 0; i < list.length; ++i)
	{
		if(list[i] === "")
		{
			continue;
		}
		var tuple: Array<string> = list[i].split("=");
		if(tuple.length !== 2)
		{
			output[tuple[0]] = true;
		}
		else
		{
			output[tuple[0]] = tuple[1];
		}
	}
	return output;
}

// Generic command processing functions
function filterCommand(text: string, commandName: string, command: (args: Arguments) => string): string
{
	var lines = text.split("\n")
	var ret = "";
	for(var i = 0; i < lines.length; i++)
	{
		if(lines[i].trim().substring(0, commandName.length + 1) === "!" + commandName)
		{
			var arr = getArgumentString(lines, i, commandName);
			i = arr[1];
			ret += command(parseArgumentString(arr[0])) + "\n";
		}
		else
		{
			ret += lines[i] + "\n";
		}
	}
	return ret;
}

// Specific commands
function notesCommand(): string
{
	//return "<textarea class=\"notes\" placeholder=\"Tvoje poznámky\"></textarea>";
	return "";
}

function pagebreakCommand(): string
{
	return "";
}

// Showdown extensions definitions
var HandbookMarkdown = function(): Array<object>
{
	var responsiveTablesBegin = {
		type: "output",
		regex: "<table>",
		replace: "<div class=\"tableContainer\"><table>"
	};
	var responsiveTablesEnd = {
		type: "output",
		regex: "</table>",
		replace: "</table></div>"
	};
	var fullLinks = {
		type: "output",
		regex: "<a href=\"(?!http://|https://)",
		replace: "<a href=\"http://"
	};
	var blankLinks = {
		type: "output",
		regex: "<a href",
		replace: "<a target=\"_blank\" rel=\"noopener noreferrer\" href"
	};
	var notes = {
		type: "lang",
		filter: function(text: string): string {return filterCommand(text, "linky", notesCommand);}
	};
	var pagebreak = {
		type: "lang",
		filter: function(text: string): string {return filterCommand(text, "novastrana", pagebreakCommand);}
	};
	return [responsiveTablesBegin, responsiveTablesEnd, fullLinks, blankLinks, notes, pagebreak];
}

//Register extensions
showdown.extension("HandbookMarkdown", HandbookMarkdown);
