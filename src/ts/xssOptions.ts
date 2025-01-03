/* exported xssOptions */

function xssOptions(): XSS.IFilterXSSOptions {
  return {
    onIgnoreTagAttr: (
      tag: string,
      name: string,
      value: string,
      isWhiteAttr: boolean,
    ): string => {
      if (!isWhiteAttr) {
        if (tag === "a" && name === "rel" && value === "noopener noreferrer") {
          return `${name}="${value}"`;
        }
        if (tag === "div" && name === "class" && value === "table-container") {
          return `${name}="${value}"`;
        }
        if (
          ["td", "th"].indexOf(tag) >= 0 &&
          name === "style" &&
          [
            "text-align:left;",
            "text-align:center;",
            "text-align:right;",
          ].indexOf(value) >= 0
        ) {
          return `${name}="${value}"`;
        }
      }
      return "";
    },
  };
}
