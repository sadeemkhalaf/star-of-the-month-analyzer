import React, { useState, useEffect, useCallback } from "react";
import * as _ from 'lodash';
import { IResponses, IResponsesOtherCases } from "../../main/shared/model";
import { reformatName, reformatNameString } from "../../main/shared/utils";
import { DatagridType, SubDataGrid } from "../sub-datagrid/SubDataGrid";

interface SubDatagridContainerProps {
    sheetdata: IResponses[];
}

const SubDatagridContainer = ({ sheetdata }: SubDatagridContainerProps) => {
    const [selfVotedList, setselfVotedList] = useState<IResponsesOtherCases[]>([]);
    const [votedFreqList, setVotedFreqList] = useState<IResponsesOtherCases[]>([]);

    const countDuplicates = (array: IResponsesOtherCases[], key: string) => {
        const counts = _.countBy(array, key);
        return array.reduce((row: IResponsesOtherCases[], item) => {
            if (counts[item[key]] > 0) {
                row.push({ ...item, ratingCount: counts[item[key]] });
                counts[item[key]] = 0; // Mark as processed
            }
            return row;
        }, []);
    }

    const filterSelfVoted = useCallback(() => {
        let idx = 0;
        const mappedValues: IResponsesOtherCases[] = _.map(_.mapValues(_.filter(sheetdata, (value) => {
            return reformatNameString(value.name) === reformatName(value.whom)
        }), (row: IResponses | any) => {
            idx += 1;
            return { ID: idx, name: row?.name, ratingCount: 1 }
        }), (value, key) => ({ whom: key, ...value }));

        setselfVotedList(countDuplicates(mappedValues, 'name'));
    }, [sheetdata])

    const filterVotedFrequently = useCallback(() => {
        let idx = 0;
        const filteredList: IResponsesOtherCases[] = [];
        const grouped = _.groupBy(sheetdata, 'name');
        for (const name in grouped) {
            idx += 1;
            // validate stars
            const totalReduced = grouped[name].reduce((a, b) => a + b.rating, 0);
            if (totalReduced > 5) {
                filteredList.push({ ID: idx, name: name, ratingCount: totalReduced })
            }
        }
        setVotedFreqList(filteredList);
    }, [sheetdata])

    useEffect(() => {
        filterSelfVoted();
        filterVotedFrequently();
    }, [filterSelfVoted, filterVotedFrequently])


    return (
        <div className="flex flex-row justify-between items-center gap-4 bg-white p-4 rounded-md">
            <div className="w-full">
                <label className="text-lg font-semibold">{'Voted for themselves'}</label>
                <SubDataGrid rows={selfVotedList} votingType={DatagridType.selfVoted} />
            </div>
            <div className="w-full">
                <label className="text-lg font-semibold">{'Sent over 5 stars'}</label>
                <SubDataGrid rows={votedFreqList} votingType={DatagridType.votedFrequently} />
            </div>
        </div>
    );
}

export default SubDatagridContainer;
