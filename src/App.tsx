import React, { useCallback, useEffect, useState } from 'react';
import { CircularProgress, FormLabel, Switch } from '@mui/material';
import * as _lodash from 'lodash'
import { DateRange } from 'react-day-picker';
import { ExcelUpload } from './components/excel-upload/ExcelUpload';
import { MainDataGrid, columnsRes } from './components/data-table/DataGrid';
import { IResponses, IResponsesFinalResult, IResponsesResult } from './main/shared/model';
import SubDatagridContainer from './components/sub-datagrid-container/subDatagridContainer';

import { reformatNameString, validateNameFormat } from './main/shared/utils';
import { DatePickerWithRange } from './components/ui/dateRangePicker/DateRangePicker'

import './App.css';


function App() {
  const [sheetData, setSheetData] = useState<IResponses[]>([]);

  const [result, setResult] = useState<IResponsesResult[]>([]);
  const [finalist, setFinalist] = useState<IResponsesFinalResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [exclude, setExclude] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const checkGivenStars = (responses: IResponses[]) => {
    const filteredList: IResponses[] = [];
    let totalStars = 0;
    const totalReduced = responses.reduce((a, b) => a + b.rating, 0);
    if (totalReduced > 5) {
      responses.forEach((row) => {
        if (row.rating + totalStars <= 5) {
          totalStars += row.rating;
          filteredList.push(row);
        } else if (totalStars < 5 && (row.rating + totalStars > 5)) {
          // truncation 
          let amountLeft = 5 - totalStars;
          filteredList.push({ ...row, rating: amountLeft });
        }
      })
    } else {
      responses.forEach((row) => filteredList.push(row))
    }
    const filtered = filteredList.map((row) => ({ ID: row.ID, whom: validateNameFormat(row.whom), rating: row.rating, feedback: { givenBy: row.name, feedback: !!row.feedback ? row.feedback : '', category: row.category } } as IResponsesResult))
    setResult(prev => [...prev, ...filtered]);
    return;
  }

  const analyzePulledData = useCallback((sheetdata: IResponses[]) => {
    let filteredData: IResponses[] = [];
    let grouped;
    if (exclude) {
      filteredData = _lodash.filter(sheetdata, (value) => {
        return reformatNameString(value.name) !== reformatNameString(validateNameFormat(value.whom))
      });
      grouped = _lodash.groupBy(filteredData, 'name');
    } else {
      grouped = _lodash.groupBy(sheetdata, 'name');
    }

    for (const name in grouped) {
      checkGivenStars(grouped[name]);
    }
  }, [exclude])

  const clearResults = () => {
    setFinalist([]);
    setResult([]);
  }

  const excludeResults = () => {
    setExclude(!exclude);
  }

  const getTotalOfStars = () => {
    return exclude ? finalist.reduce((a, b) => a + b.rating, 0) : sheetData.reduce((a, b) => a + b.rating, 0);
  }

  const getTotalOfPeopleVoted = () => {
    return _lodash.uniqBy(sheetData, 'name').length;
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

  useEffect(() => {
    clearResults();
    analyzePulledData(sheetData);
  }, [analyzePulledData, exclude, sheetData])

return (
  <div className={`flex flex-1 flex-col px-5 xl:px-48 lg:px-32 mb-24`}>
    <div className='py-8 w-full flex justify-between items-center'>
      <div>
        <div className='text-3xl text-gray-800 font-normal'>{'Star of the Month'}</div>
        <div className='text-lg text-gray-800 font-bold'>{'Analyzer'}</div>
      </div>

      <img src={require('./assets/deloittedigital-logo.png')} alt="deloittedigital" className='w-[160px]' />
    </div>

    <div className='w-full h-full flex justify-between items-start flex-row py-4 border-b-[0.5px] border-b-black bg-white rounded-md p-3'>

      <div className='flex-col'>
        <div className='pb-4'>
          <p className='text-xs py-2 text-gray-500'>{'import the excel sheet downloaded from responses:'}</p>
          <ExcelUpload setSheetData={setSheetData} analyzePulledData={analyzePulledData} loading={false} sheetData={sheetData} dateRange={dateRange} />
        </div>
        <div>
          <p className='text-xs py-2 text-gray-500'>{'Please select a date range:'}</p>
          <DatePickerWithRange setDateRange={setDateRange} />
        </div>
      </div>

      <div>
        <span>
          <FormLabel title='exclude-stars'>{'Exclude self given stars'}</FormLabel>
          <Switch onChange={excludeResults} color='success' />
        </span>
        <button className="bg-transparent font-semibold py-2 px-4 border text-red-600 border-none my-4" onClick={() => { clearResults(); setSheetData([]) }}>
          {`Clear all`}
        </button>
      </div>
    </div>
    {sheetData.length > 0 &&
      <div className='w-full h-full flex justify-around items-center flex-row py-4 border-b-[0.5px] border-b-black bg-white rounded-md p-3 my-3'>
        <div className='text-sm'>Total stars: <span className='text-lg font-bold'>{`${getTotalOfStars()}/`}</span><span className='text-sm font-normal'>{`${getTotalOfPeopleVoted() * 5}`}</span></div>
        <div className='text-sm'>Total people voted:  <span className='text-lg font-bold'>{`${getTotalOfPeopleVoted()}`}</span></div>
      </div>
    }

    <div className='my-4' />
    {loading && <div className='w-full flex justify-center pb-4'> <CircularProgress /> </div>}
    {finalist.length > 0 && <MainDataGrid rows={finalist} col={columnsRes} />}
    <div className='my-4' />
    {finalist.length > 0 && <SubDatagridContainer sheetdata={sheetData} />}
  </div>
);
}

export default App;
