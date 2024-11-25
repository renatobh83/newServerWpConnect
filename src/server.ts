import "reflect-metadata";
import __init from "./app";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
__init().then((app: any) => {
	app.start();
});
