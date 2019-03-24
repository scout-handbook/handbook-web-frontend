/* exported COMPETENCES, FIELDS, LESSONS, LOGINSTATE */

var COMPETENCES: IDList<Competence>;
var FIELDS: IDList<Field>;
var LESSONS: IDList<Lesson>;
var LOGINSTATE: Loginstate | null;

function main(): void
{
	navigationSetup();
	headerSetup();
	historySetup();
	authenticationSetup();
	metadataSetup();
	lessonViewSetup();
	TOCSetup();
	if("serviceWorker" in navigator)
	{
		navigator.serviceWorker.register(CONFIG['frontend-uri'] + "/serviceworker.min.js"); // eslint-disable-line compat/compat
	}
	WebFont.load({
		google: {
			families: ["Open Sans:400,400i,700,700i"]
		}
	});
}

window.onload = main;
