/* exported RequestResponse */

type RequestResponse =
  | string
  | Loginstate
  | Record<string, Competence>
  | Record<string, Field>
  | Record<string, Lesson>;
