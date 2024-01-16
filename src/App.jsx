import { useState } from "react";
import reactLogo from "./assets/react.svg";
import aleoLogo from "./assets/aleo.svg";
import "./App.css";
import helloworld_program from "../helloworld/build/main.aleo?raw";
import { AleoWorker } from "./workers/AleoWorker.js";

const aleoWorker = AleoWorker();
function App() {
  const [count, setCount] = useState(0);
  const [account, setAccount] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [results, setResults] = useState(Array(9).fill(''));
  const [isLoading, setLoading] = useState(false);


  const generateAccount = async () => {
    const key = await aleoWorker.getPrivateKey();
    setAccount(await key.to_string());
  };

  async function execute() {
    setExecuting(true);
    const result = await aleoWorker.localProgramExecution(
      helloworld_program,
      "main",
      ["5u32", "5u32"],
    );
    setExecuting(false);

    alert(JSON.stringify(result));
  }

  async function deploy() {
    setDeploying(true);
    try {
      const result = await aleoWorker.deployProgram(helloworld_program);
      console.log("Transaction:")
      console.log("https://explorer.hamp.app/transaction?id=" + result)
      alert("Transaction ID: " + result);
    } catch (e) {
      console.log(e)
      alert("Error with deployment, please check console for details");
    }
    setDeploying(false);
  }

  const handleImageClick = async (index) => {
    const index_ = index;
    setLoading(true);
    try {
      console.log(`http://localhost:3001/run-command?index=${index_}`)
      const response = await fetch(`http://158.220.101.185:3001//run-command?index=${index_}`);
      console.log(response);
      const data = await response.json();
      console.log(data);
      let result = data.result

      // maximum valu in result array
      let max = Math.max(...result);
      // index of maximum value
      let index = result.indexOf(max);
      // sum of all values
      let sum = result.reduce((a, b) => a + b, 0);
      // probability of the maximum value
      let probability = max / sum;


      results[index_]= `Result: ${index} with probability: ${(100*probability).toFixed(3)}`
      setResults(results);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <>
      <div>
        <a href="https://aleo.org" target="_blank">
          <img src={aleoLogo} className="logo" alt="Aleo logo" />
        </a>
        {/* <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
      </div>
      <h1>Leo Neural Network MNIST Classifier</h1>
      <h4>Click the image to get classifier result from leo code.</h4>

      <div className="grid">
        {Array.from({ length: 9 }, (_, index) => (
          <div key={index} className="grid-item" onClick={() => handleImageClick(index)}>
            <img src={`/public/mnist/test_image_${index}.jpg`} alt={`Image ${index}`} />
            <p>{results[index]}</p>
          </div>
        ))}
      </div>
      {isLoading && <div className="modal">Running Classifier in Leo...</div>}
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          <button onClick={generateAccount}>
            {account
              ? `Account is ${JSON.stringify(account)}`
              : `Click to generate account`}
          </button>
        </p>
        <p>
          <button disabled={executing} onClick={execute}>
            {executing
              ? `Executing...check console for details...`
              : `Execute helloworld.aleo`}
          </button>
        </p>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div> */}

      {/* Advanced Section */}
      {/* <div className="card">
        <h2>Advanced Actions</h2>
        <p>
          Deployment on Aleo requires certain prerequisites like seeding your
          wallet with credits and retrieving a fee record. Check README for more
          details.
        </p>
        <p>
          <button disabled={deploying} onClick={deploy}>
            {deploying
              ? `Deploying...check console for details...`
              : `Deploy helloworld.aleo`}
          </button>
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Aleo and React logos to learn more
      </p> */}
    </>
  );
}

export default App;
