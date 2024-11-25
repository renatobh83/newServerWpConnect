import "reflect-metadata";
import __init from "./app";

__init().then((app: any) => {
	app.start();
});
