/* exported RequestResponse */

type RequestResponse =
  | Loginstate
  | Record<string, Competence>
  | Record<string, Field>
  | Record<string, Lesson>
  | string;
