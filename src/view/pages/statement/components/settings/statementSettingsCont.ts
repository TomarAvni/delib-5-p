import {
    Statement,
    NavObject,
    Screen,
    Vote,
    Evaluation,
    StatementType,
} from "delib-npm";

// Helpers
import { getVoters } from "../../../../../functions/db/vote/getVotes";
import { getEvaluations } from "../../../../../functions/db/evaluation/getEvaluation";
import {
    navigateToStatementTab,
    parseScreensCheckBoxes,
} from "../../../../../functions/general/helpers";
import {
    createStatement,
    setStatmentToDB,
    updateStatement,
} from "../../../../../functions/db/statements/setStatments";


// Get users that voted on options in this statement
export async function handleGetVoters(
    parentId: string | undefined,
    setVoters: React.Dispatch<React.SetStateAction<Vote[]>>,
    setClicked: React.Dispatch<React.SetStateAction<boolean>>,
) {
    if (!parentId) return;
    const voters = await getVoters(parentId);
    setVoters(voters);
    setClicked(true);
}

// Get users that evaluated on options in this statement
export async function handleGetEvaluators(
    parentId: string | undefined,
    setEvaluators: React.Dispatch<React.SetStateAction<Evaluation[]>>,
    setClicked: React.Dispatch<React.SetStateAction<boolean>>,
) {
    if (!parentId) return;
    const evaluators = await getEvaluations(parentId);
    setEvaluators(evaluators);
    setClicked(true);
}

// Check if subpage is checked in stored sttatement
export function isSubPageChecked(
    statement: Statement | undefined,
    navObj: NavObject,
): boolean {
    try {
        //in case of a new statement
        if (!statement) {
            if (navObj.default === false) return false;
            else return true;
        }

        //in case of an existing statement
        const subScreens = statement.subScreens as Screen[];
        if (subScreens === undefined) return true;
        if (subScreens?.includes(navObj.link)) return true;

        return false;
    } catch (error) {
        console.error(error);

        return true;
    }
}



export async function handleSetStatment(
    ev: any,
    navigate: any,
    statementId: string | undefined,
    statement: Statement | undefined,
) {
    try {
        console.log("handleSetStatment....");
        ev.preventDefault();

        const data = new FormData(ev.currentTarget);
     

        let title: any = data.get("statement");

        if (!title || title.length < 2) return;

        // const resultsBy = data.get("resultsBy") as ResultsBy;
        // const numberOfResults: number = Number(data.get("numberOfResults"));
        const description = data.get("description");

        //add to title * at the beggining
        if (title && !title.startsWith("*")) title = "*" + title;

        const _statement = `${title}\n${description}`;
        if (!_statement) return;

        const dataObj: any = Object.fromEntries(data.entries());
        const screens = parseScreensCheckBoxes(dataObj);
   
        const {
            resultsBy,
            numberOfResults,
            hasChildren,
            enableAddEvaluationOption,
            enableAddVotingOption,
            enhancedEvaluation,
            showEvaluation,
        } = dataObj;

       

        // If no statementId, user is on AddStatement page
        if (!statementId) {
            const newStatement = createStatement({
                text: _statement,
                screens,
                statementType: StatementType.question,
                parentStatement: "top",
                resultsBy,
                numberOfResults,
                hasChildren,
                enableAddEvaluationOption,
                enableAddVotingOption,
                enhancedEvaluation,
                showEvaluation
            });
            if (!newStatement)
                throw new Error("newStatement had error in creating");
            console.log(statement, "statement")

            await setStatmentToDB({
                parentStatement: "top",
                statement: newStatement,
                addSubscription: true,
            });
            navigateToStatementTab(newStatement, navigate);

            return;
        }

        // If statementId, user is on Settings tab in statement page
        else {
            //update statement
            if (!statement) throw new Error("statement is undefined");

            const newStatement = updateStatement({
                statement,
                text: _statement,
                screens,
                statementType: StatementType.question,
                resultsBy,
                numberOfResults,
                hasChildren,
                enableAddEvaluationOption,
                enableAddVotingOption,
                enhancedEvaluation,
                showEvaluation
            });
            if (!newStatement)
                throw new Error("newStatement had not been updated");

            await setStatmentToDB({
                parentStatement: statement,
                statement: newStatement,
                addSubscription: true,
            });
            navigateToStatementTab(newStatement, navigate);

            return;
        }
    } catch (error) {
        console.error(error);
    }
}
