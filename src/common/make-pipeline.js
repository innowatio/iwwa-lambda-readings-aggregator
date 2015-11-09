import {resolve} from "bluebird";
import {inspect} from "util";

function wrapStep (step) {
    return function wrapped (input) {
        console.log(`PIPELINE_STEP_START ${step.name}`);
        console.log("Input:");
        console.log(inspect(input, {depth: null}));
        console.log("Context:");
        console.log(inspect(this, {depth: null}));
        return resolve(step.call(this, input))
            .then(output => {
                console.log(`PIPELINE_STEP_SUCCESS ${step.name}`);
                console.log("Output");
                console.log(inspect(output, {depth: null}));
                console.log("Context:");
                console.log(inspect(this, {depth: null}));
                return output;
            })
            .catch(error => {
                console.log(`PIPELINE_STEP_ERROR ${step.name}`);
                console.log("Error:");
                console.log(inspect(error, {depth: null}));
                console.log("Context:");
                console.log(inspect(this, {depth: null}));
                throw error;
            });
    };
}

export default function makePipeline (...steps) {
    if (process.env.DEBUG) {
        steps = steps.map(wrapStep);
    }
    return function pipeline (input, context) {
        return steps.reduce(
            (promise, step) => promise.then(step),
            resolve(input).bind(context)
        );
    };
}
