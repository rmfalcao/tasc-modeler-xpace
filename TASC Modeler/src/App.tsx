import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { ContextualElement } from './models/Matrix';
import Diagram from './views/Diagram';
import Form from './views/UploadFiles/Form';
import { csvToArray } from './utils/Utils';
import axios from 'axios';
import configData from "./processor-settings.json";
import Logos from './views/Logos';



function App() {
  const [dataJSONDiagram, setJSONDiagram] = useState<any>(undefined);
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState<any>(false);
  const [dataTOProcess, setDataTOProcess] = useState<any>(undefined);
  const [contextualElements, setContextualElements] = useState<ContextualElement[]>([]);

  const validData = dataJSONDiagram && contextualElements.length > 0;

  const generateDiagram = (description: string, dataSet: File, metadata: File) => {
    setDataTOProcess({ description, dataSet, metadata })

    // read csv dataset file
    const reader = new FileReader();
    reader.onload = function (event) {
      const csvdata = event.target?.result as string;
      const data = csvToArray(csvdata);
      setContextualElements(data.map(contextualElemet => { return { id: contextualElemet.id, is_intrinsic: (contextualElemet.is_intrinsic === 'true') } }))
    };
    reader.readAsText(metadata);
  }

  const getData = useCallback(async ({ description, dataSet, metadata }) => {
    const data = new FormData();
    data.append("dataset", dataSet);
    data.append("metadata", metadata);
    setIsGeneratingDiagram(true);
    // send description and csv files
    await axios.post(`${configData.SERVER_URL}?taskDescription=${description}`, data).then(response => {
      setJSONDiagram(response.data)
      setIsGeneratingDiagram(false);
    });

  }, [])


  useEffect(() => {
    if (dataTOProcess) {
      getData(dataTOProcess);
    }
  }, [dataTOProcess, getData])

  return (
    <div style={{ height: '100vh' }}>
      <Logos/>
      {!validData && !isGeneratingDiagram && <Form generateDiagram={generateDiagram} />}
      {isGeneratingDiagram && <div className="loader"></div>}
      {validData ? <Diagram data={{ dataJSONDiagram: dataJSONDiagram, contextual_element: contextualElements }} /> : <></>}
    </div>
  );
}

export default App;
