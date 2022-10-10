import { getDemoCircuits, TuringCircuitTestCase } from "./demoCircuits";
import { parseTuringCompleteFile, base64ToUint8, uint8ToBase64 } from "../format/import/turingcomplete";

export function runTests(){
    let demoCircuits = getDemoCircuits();
    let results = {}

    let testCount = 1;
    let totalTests = testCount * demoCircuits.length;
    let testsPassed = 0;
    
    for (let i=0;i<demoCircuits.length;i++){
        let testCase = demoCircuits[i];
        results[testCase.name] = runTest(testCase);
        testsPassed += results[testCase.name].length;
    }

    alert(testsPassed + "/" + totalTests + " tests passed!");

    return results;
}

function runTest(testCase: TuringCircuitTestCase): string[] {
    let results: string[] = []
    let assertTest = (testName: string, passed: boolean) => {
        if (passed) {
            results.push(testName);
        } else {
            console.log(testCase.name + " failed: " + testName);
        }
    }

    let binary = base64ToUint8(testCase.circuitData);
    let base64 = uint8ToBase64(binary);
    assertTest("base64 encode/decode", base64 == testCase.circuitData)

    let circuit = parseTuringCompleteFile(binary);

    return results;
}