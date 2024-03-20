import React, { useEffect, useState } from 'react';
import { CircularProgress, FormLabel, Switch } from '@mui/material';
import * as _lodash from 'lodash'
import { ExcelUpload } from './components/excel-upload/ExcelUpload';
import { MainDataGrid, columnsRes } from './components/data-table/DataGrid';
import { IResponses, IResponsesFinalResult, IResponsesResult } from './main/shared/model';
import SubDatagridContainer from './components/sub-datagrid-container/subDatagridContainer';

import { reformatName, reformatNameString } from './main/shared/utils';
import './App.css';

function App() {
  const [sheetData, setSheetData] = useState<IResponses[]>([]);

  const [result, setResult] = useState<IResponsesResult[]>([]);
  const [finalist, setFinalist] = useState<IResponsesFinalResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [exclude, setExclude] = useState<boolean>(false);

  const checkGivenStars = (responses: IResponses[]) => {
    const filteredList: IResponses[] = [];
    let totalStars = 0;
    const totalReduced = responses.reduce((a, b) => a + b.rating, 0);
    if (totalReduced > 5) {
      responses.forEach((row) => {
        if (row.rating + totalStars <= 5) {
          totalStars += row.rating;
          filteredList.push(row);
        } else if (totalStars < 5) {
          // truncation 
          let amountLeft = 5 - totalStars;
          filteredList.push({...row, rating: amountLeft});
        }
      })
    } else {
      filteredList.push(...filteredList);
    }
    const filtered = filteredList.map((row) => ({ ID: row.ID, whom: row.whom, rating: row.rating, feedback: !!row.feedback ? { givenBy: row.name, feedback: row.feedback } : null } as IResponsesResult))
    setResult(prev => [...prev, ...filtered]);
    return;
  }

  const analyzePulledData = () => {
    let filteredData: IResponses[] = [];
    let grouped;
    if (exclude) {
      filteredData = _lodash.filter(sheetData, (value) => {
        return reformatNameString(value.name) !== reformatName(value.whom)
      });
      grouped = _lodash.groupBy(filteredData, 'name');
    } else {
      grouped = _lodash.groupBy(sheetData, 'name');
    }
    for (const name in grouped) {
      checkGivenStars(grouped[name]);
    }
  }

  const clearResults = () => {
    setFinalist([]);
    setResult([]);
    setSheetData([]);
  }

  const excludeResults = () => {
    setExclude(!exclude);
  }

  useEffect(() => {
    if (result.length > 0) {
      setLoading(true);
      let idx = 0;
      const mappedResults = _lodash.mapValues(_lodash.groupBy(result, 'whom'), (rows) => {
        const totalRating = _lodash.sumBy(rows, 'rating');
        const concatenatedFeedback = _lodash.map(rows, item => item.feedback).filter(item => !!item);
        
        idx += 1;
        return { rating: totalRating, feedback: concatenatedFeedback, ID: idx };
      });
      const finalRes = _lodash.map(mappedResults, (value, key) => ({ whom: key, ...value }));
      
      setFinalist(finalRes);
      setTimeout(() => {
        setLoading(false)
      }, 320);
    }
  }, [result])

  return (
    <div className={`flex flex-1 flex-col px-5 xl:px-48 lg:px-32 mb-24`}>
      <div className='py-8 w-full flex justify-between items-center'>
        <div className='text-lg text-gray-800 font-semibold'>{'Star of the Month Analyzer'}</div>
        <img src={require('./assets/deloittedigital-logo.png')} alt="deloittedigital" className='w-[160px]' />
      </div>
      <div className='w-full h-full flex justify-between items-center flex-row py-4 border-b-[0.5px] border-b-black bg-white rounded-md p-3'>
        <div>
          <p className='text-xs py-2 text-gray-500'>{'import the excel sheet downloaded from responses:'}</p>
          <ExcelUpload setSheetData={setSheetData} />
        </div>
        <div>
          <span>
            <FormLabel title='exclude-stars'>{'Exclude self given stars'}</FormLabel>
            <Switch onChange={excludeResults} disabled={finalist.length > 0} color='success' />
          </span>
          <button className="bg-transparent font-semibold py-2 px-4 border text-red-600 border-none my-4" onClick={clearResults}>
            {`Clear all`}
          </button>
        </div>
      </div>

      {(sheetData.length > 0 && result.length === 0) && <div className='pt-2 flex flex-row items-center gap-3'>
        <FormLabel>{`Loaded ${sheetData.length} rows`}</FormLabel>
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded my-4 disabled:border-none disabled:text-gray-500 disabled:bg-slate-200"
          onClick={analyzePulledData} disabled={result.length > 0}>
          {`Start Analyzing data`}
        </button>
      </div>}
      <div className='my-4' />
      {loading && <div className='w-full flex justify-center pb-4'> <CircularProgress /> </div>}
      {finalist.length > 0 && <MainDataGrid rows={finalist} col={columnsRes} />}
      <div className='my-4' />
      {finalist.length > 0 && <SubDatagridContainer sheetdata={sheetData} />}
    </div>
  );
}

export default App;
