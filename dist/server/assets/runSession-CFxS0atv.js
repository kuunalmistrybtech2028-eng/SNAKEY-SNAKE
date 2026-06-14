//#region src/lib/snake/runSession.ts
var SESSION_KEY = "snakey:lastSession:v1";
function saveLastSession(session) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(SESSION_KEY, JSON.stringify(session));
	} catch {}
}
function getLastSession() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(SESSION_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
//#endregion
export { saveLastSession as n, getLastSession as t };
