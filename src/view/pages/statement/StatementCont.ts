import { Statement, NavObject, Screen } from "delib-npm";
import { showNavElements } from "./components/nav/top/statementTopNavCont";
import { navArray } from "./components/nav/top/StatementTopNavModel";

export function availableScreen(
    statement: Statement | undefined,
    screenLink: Screen | undefined,
): Screen | undefined {
    try {
        if (!statement) return screenLink;
        if (!screenLink) throw new Error("urlSubPage is undefined");
        if (statement.subScreens === undefined)
            throw new Error("statement.subScreens is undefined");
        if (statement.subScreens.length === 0)
            throw new Error("statement.subScreens is empty");

        const subScreens: NavObject[] = showNavElements(statement, navArray);

        const subScreensLinks: Screen[] = subScreens.map(
            (navObj: NavObject) => navObj.link,
        );
        if (!subScreensLinks) throw new Error("subScreensLinks is undefined");

        let returnedLink: Screen = Screen.CHAT;
        if (subScreensLinks.includes(screenLink)) {
            returnedLink = screenLink;
        } else {
            returnedLink = subScreensLinks[0];
        }

        return returnedLink;
    } catch (error) {
        console.error(error);

        return screenLink;
    }
}
