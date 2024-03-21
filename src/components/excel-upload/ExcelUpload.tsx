import React, { FC, useState } from "react";
import { read, utils } from 'xlsx';
import { Button } from "@mui/material";

export const ExcelUpload: FC<{ sheetData?: any[], setSheetData: React.Dispatch<any[]> }> = ({ setSheetData }) => {
    const [file, setFile] = useState(null);
    const handleFileChange = (event: any) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleFileUpload = () => {
        const fileReader = new FileReader();
        fileReader.onload = (e: ProgressEvent<FileReader> | any) => {
            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json<any>(sheet);
            setSheetData(jsonData);            
        };
        fileReader.readAsArrayBuffer(file as unknown as Blob);
    };

    return (
        <div className="flex flex-row text-center gap-1 items-center cursor-pointer">
            <input id="file-upload" accept=".xlsx" type="file" onChange={handleFileChange} className="flex h-10 w-2/3 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium" />
            <Button disabled={!file} variant="contained" onClick={handleFileUpload}>{'Upload Now'}</Button>
        </div>
    );
}