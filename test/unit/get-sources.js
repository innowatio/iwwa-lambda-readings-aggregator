import {expect} from "chai";

import getSources from "steps/get-sources";
import {getSensor} from "../utils";

describe("`getSources` function", () => {

    it("return the array with the sources without duplicated value", () => {
        const event = getSensor("2015-01-01T00:02:00.000Z");
        const ret = getSources(event.data.element);
        expect(ret).to.deep.equal(["forecast", "reading"]);
    });

});
