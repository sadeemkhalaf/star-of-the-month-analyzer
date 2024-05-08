import React, { FC, useState } from "react";
import { read, utils } from 'xlsx';
import moment from 'moment';
import { DateRange } from "react-day-picker";
import { Button, CircularProgress } from "@mui/material";
import { IResponses } from "../../main/shared/model";

interface ExcelUploadProps {
    sheetData?: IResponses[];
    setSheetData: React.Dispatch<any[]>;
    analyzePulledData: (sheetdata: IResponses[]) => void, loading: boolean;
    dateRange?: DateRange
}

export const ExcelUpload: FC<ExcelUploadProps> = ({ setSheetData, analyzePulledData, loading, sheetData, dateRange }) => {
    const [file, setFile] = useState(null);
    const handleFileChange = (event: any) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const convertExcelDate = (date: number) => (date - 25569) * 86400 * 1000

    const filterByDateRange = (jsonData: any[], dateRange: DateRange) => {
        return jsonData.filter((data) => moment(moment(convertExcelDate(data.completionTime)).format('YYYY-MM-DD HH:mm:ss')).isBetween(moment(dateRange.from), moment(dateRange.to), undefined, '[]'));
    }

    const handleFileUpload = () => {
        const fileReader = new FileReader();
        fileReader.onload = (e: ProgressEvent<FileReader> | any) => {
            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json<any>(sheet);
            const filtered = dateRange ? filterByDateRange(jsonData, dateRange).filter((data) => !!data.whom) : jsonData;

            setSheetData(filtered);
            analyzePulledData(filtered);
        };
        fileReader.readAsArrayBuffer(file as unknown as Blob);
    };

    return (
        <div className="flex flex-row text-center gap-1 items-center cursor-pointer">
            <input id="file-upload" accept=".xlsx" type="file" onChange={handleFileChange} className="flex h-10 w-2/3 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium" />
            <Button disabled={!file || (!!sheetData?.length && sheetData?.length > 0)} variant="contained" onClick={handleFileUpload}>{'Upload Now'}</Button>
            {loading && <div className='pb-4'> <CircularProgress size={'xs'} /> </div>}
        </div>
    );
}