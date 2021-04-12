/* exported FULLFIELDS, FIELDS, COMPETENCES, LOGINSTATE */

let FULLFIELDS: Array<FullField>;
let FIELDS: Array<Field>;
let COMPETENCES: Array<Competence>;
let LOGINSTATE: Loginstate | null;

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
		void navigator.serviceWorker.register(CONFIG['frontend-uri'] + "/serviceworker.min.js"); // eslint-disable-line compat/compat
	}
	WebFont.load({
		google: {
			families: ["Open Sans:400,400i,700,700i"]
		}
	});
}

window.onload = main;
