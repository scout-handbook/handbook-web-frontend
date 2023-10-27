/* exported headerSetup */

function fontResize(delta: number): void {
  const content = document.getElementById("content")!;
  const current = parseInt(
    window
      .getComputedStyle(content, null)
      .getPropertyValue("font-size")
      .replace("px", ""),
    10,
  );
  content.style.fontSize = (current + delta).toString() + "px";
  content.style.lineHeight = "160%";
  reflowCompetenceBubbles();
}

function headerSetup(): void {
  document.getElementById("lessonsButton")!.onclick = toggleNavigation;
  document.getElementById("font-increase")!.onclick = (): void => {
    fontResize(2);
  };
  document.getElementById("font-decrease")!.onclick = (): void => {
    fontResize(-2);
  };
  document.getElementById("cacheOffline")!.onclick = toggleLessonOffline;
}
