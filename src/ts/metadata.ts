/* global COMPETENCES:true FIELDS:true LESSONS:true LOGINSTATE:true */
/* exported COMPETENCES, FIELDS, LESSONS, LOGINSTATE, metadataSetup */

const metadataEvent = new AfterLoadEvent(1);
const loginstateEvent = new AfterLoadEvent(1);

function competenceComparator(first: Competence, second: Competence): number {
  return first.number - second.number;
}

function lessonComparator(first: Lesson, second: Lesson): number {
  if (first.competences.length === 0) {
    if (second.competences.length === 0) {
      return 0;
    }
    return 1;
  }
  if (second.competences.length === 0) {
    return -1;
  }
  return competenceComparator(
    COMPETENCES.get(first.competences[0])!,
    COMPETENCES.get(second.competences[0])!,
  );
}

function fieldComparator(first: Field, second: Field): number {
  if (first.lessons.length === 0) {
    if (second.lessons.length === 0) {
      return 0;
    }
    return 1;
  }
  if (second.lessons.length === 0) {
    return -1;
  }
  return lessonComparator(
    LESSONS.get(first.lessons[0])!,
    LESSONS.get(second.lessons[0])!,
  );
}

function metadataSetup(): void {
  const metadataSortEvent = new AfterLoadEvent(3);
  metadataSortEvent.addCallback(function (): void {
    COMPETENCES.sort(competenceComparator);
    LESSONS.map(function (value: Lesson): Lesson {
      value.competences.sort(function (first: string, second: string): number {
        return competenceComparator(
          COMPETENCES.get(first)!,
          COMPETENCES.get(second)!,
        );
      });
      return value;
    });
    LESSONS.sort(lessonComparator);
    FIELDS.map(function (value: Field): Field {
      value.lessons.sort(function (first: string, second: string): number {
        return lessonComparator(LESSONS.get(first)!, LESSONS.get(second)!);
      });
      return value;
    });
    FIELDS.sort(fieldComparator);
    metadataEvent.trigger();
  });
  cacheThenNetworkRequest(
    CONFIG["api-uri"] + "/v1.0/field",
    "",
    function (response, second): void {
      FIELDS = new IDList<Field>(response as Record<string, Field>);
      if (second) {
        metadataSortEvent.retrigger();
      } else {
        metadataSortEvent.trigger();
      }
    },
  );
  cacheThenNetworkRequest(
    CONFIG["api-uri"] + "/v1.0/lesson",
    "",
    function (response, second): void {
      LESSONS = new IDList<Lesson>(response as Record<string, Lesson>);
      if (second) {
        metadataSortEvent.retrigger();
      } else {
        metadataSortEvent.trigger();
      }
    },
  );
  cacheThenNetworkRequest(
    CONFIG["api-uri"] + "/v1.0/competence",
    "",
    function (response, second): void {
      COMPETENCES = new IDList<Competence>(
        response as Record<string, Competence>,
      );
      if (second) {
        metadataSortEvent.retrigger();
      } else {
        metadataSortEvent.trigger();
      }
    },
  );
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function (): void {
    if (this.readyState === 4) {
      if (!this.responseText) {
        return;
      }
      const response = JSON.parse(this.responseText) as APIResponse;
      if (response.status === 200) {
        LOGINSTATE = response.response! as Loginstate;
        loginstateEvent.trigger();
      } else if (response.status === 401) {
        LOGINSTATE = null;
        loginstateEvent.trigger();
      }
    }
  };
  xhttp.open("GET", CONFIG["api-uri"] + "/v1.0/account", true);
  xhttp.send();
}
