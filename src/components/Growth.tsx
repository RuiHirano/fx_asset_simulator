import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Line, LineChart, Legend, ReferenceLine } from 'recharts';
import { Typography, Paper, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Link } from '@mui/material';
import moment from 'moment';
import { Result } from '../App';
import { useState } from 'react';

const columns: any = [
    { id: 'year', label: '' },
    { id: '1', label: 'Jan', format: (value: number) => (value * 100).toFixed(2) },
    { id: '2', label: 'Feb', format: (value: number) => (value * 100).toFixed(2) },
    { id: '3', label: 'Mar', format: (value: number) => (value * 100).toFixed(2) },
    { id: '4', label: 'Apr', format: (value: number) => (value * 100).toFixed(2) },
    { id: '5', label: 'May', format: (value: number) => (value * 100).toFixed(2) },
    { id: '6', label: 'Jun', format: (value: number) => (value * 100).toFixed(2) },
    { id: '7', label: 'Jul', format: (value: number) => (value * 100).toFixed(2) },
    { id: '8', label: 'Aug', format: (value: number) => (value * 100).toFixed(2) },
    { id: '9', label: 'Sep', format: (value: number) => (value * 100).toFixed(2) },
    { id: '10', label: 'Oct', format: (value: number) => (value * 100).toFixed(2) },
    { id: '11', label: 'Nov', format: (value: number) => (value * 100).toFixed(2) },
    { id: '12', label: 'Dec', format: (value: number) => (value * 100).toFixed(2) },
    { id: 'ytd', label: 'YTD', format: (value: number) => (value * 100).toFixed(2) + "%" },
];

interface Props {
    result: Result;
    //onClickPeriod: (year: string, period: string) => void;
}

const createData = (result: Result) => {
    //EX: const data = [{ index: 1, 1: 1000, 2: 2000, avg: 1500 }, { index: 2, 1: 1300, 2: 2100, avg: 1700 }]
    //EX. const tableData: any[] = [{ 'year': '2014', 1: 10, 2: 20, 3: 30, 4: 40, 5: 50, 6: 60, 7: 70, 8: 80, 9: 90, 10: 100, 11: 110, 12: 120, 'ytd': '100%' }]
    const targetDate = moment()
    let monthlyFirstBalance = result.inputData.balance
    let yearlyFirstBalance = result.inputData.balance
    const growthDict: any = Array(Math.floor((targetDate.month() + 1 + result.inputData.simulationMonthNum) / 12) + 1).fill(0)
        .map((v, i) => { return { year: moment(targetDate).add(i, 'year').format('YYYY'), data: { year: moment(targetDate).add(i, 'year').format('YYYY'), 1: "-", 2: "-", 3: "-", 4: "-", 5: "-", 6: "-", 7: "-", 8: "-", 9: "-", 10: "-", 11: "-", 12: "-", ytd: 0 } } })
        .reduce((obj, item) => ({ ...obj, [item.year]: item.data }), {})
    const data: { balance: any[], growth: any } = { balance: [], growth: [] }
    const maxIndex = result.simulations.reduce((max, d) => d.transitions.length > max ? d.transitions.length : max, 0)
    for (let i = 0; i < maxIndex; i++) {
        const oneData: any = result.simulations
            .filter((d) => d.transitions.length > i)
            .map((sim) => { return { id: sim.id, balance: sim.transitions[i].balance } })
            .reduce((obj, item) => ({ ...obj, [item.id]: item.balance }), {})
        const balanceList: number[] = Object.values(oneData)
        const avg = balanceList.reduce((a: number, b: number) => a + b, 0) / balanceList.length
        oneData.avg = avg
        oneData.index = i
        //monthlyProfit += avg
        if (i > 0 && i % result.inputData.monthlyTradeNum === 0) {
            oneData.monthIndex = Math.floor(i / result.inputData.monthlyTradeNum)
            // calc monthly growth
            const monthlyProfit = avg - monthlyFirstBalance
            const growth = (monthlyProfit / monthlyFirstBalance)
            growthDict[targetDate.year()][targetDate.month() + 1] = growth
            monthlyFirstBalance = avg
            // calc yearly growth
            if (targetDate.month() + 1 === 12 || i === maxIndex - 1) {
                const yearlyProfit = avg - yearlyFirstBalance
                const yearlyGrowth = (yearlyProfit / yearlyFirstBalance)
                growthDict[targetDate.year()].ytd = yearlyGrowth
                yearlyFirstBalance = avg
            }
            targetDate.add(1, 'month')
        }
        oneData.bankruptcyBalance = result.inputData.bankruptcyLevel * result.inputData.balance
        data.balance.push(oneData)
    }
    data.growth = Object.values(growthDict)
    return data
}
function CustomTooltip({ payload, label, active }: any) {
    console.log(payload)
    if (active) {
        const max = payload.reduce((max: number, p: any) => p.value > max ? p.value : max, 0)
        const min = payload.reduce((min: number, p: any) => p.value < min ? p.value : min, max)
        const avg = payload.reduce((avg: number, p: any) => avg + p.value, 0) / payload.length
        return (
            <div>
                <Typography>{`取引数: ${label}`}</Typography>
                <Typography>{`平均値: ${Math.floor(avg / 10000) + "万"}`}</Typography>
                <Typography>{`最大値: ${Math.floor(max / 10000) + "万"}`}</Typography>
                <Typography>{`最小値: ${Math.floor(min / 10000) + "万"}`}</Typography>
            </div>
        );
    }

    return null;
}

const Growth: React.FC<Props> = ({ result }) => {
    const data: { balance: any[], growth: any } = createData(result)

    return (
        <div>
            <div style={{ marginTop: 10, marginBottom: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography style={{ fontSize: 20, fontWeight: 'bold', color: '#393f4c' }}>{'資産推移'}</Typography>
            </div>
            <div style={{
                padding: 20
            }}>
                <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            width={500}
                            height={400}
                            data={data.balance}

                            margin={{
                                top: 20,
                                right: 20,
                                left: 20,
                                bottom: 20,
                            }}
                        >
                            <Tooltip content={<CustomTooltip />} />
                            <CartesianGrid vertical={false} />
                            <ReferenceLine y={result.inputData.bankruptcyLevel * result.inputData.balance} label="Max" stroke="red" />
                            <XAxis xAxisId="0" dataKey="index" />
                            <XAxis xAxisId="1" dataKey="monthIndex" allowDuplicatedCategory={false} tickFormatter={(v, i) => i === 0 ? "" : v + "ヶ月目"} />
                            <YAxis domain={['dataMin', 'dataMax']} tickFormatter={(v) => Math.floor(v / 10000) + "万"} />
                            {result.simulations.map((sim) => {
                                return <Line key={sim.id} type="monotone" dataKey={sim.id} strokeWidth={1} stroke="#38b48b" fill="#7ebeab" dot={false} />
                            })}
                            <Line key={"avg"} dataKey={"avg"} strokeWidth={1} stroke="#ff1493" fill="#ff1493" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ marginTop: 10, marginBottom: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography style={{ fontSize: 20, fontWeight: 'bold', color: '#393f4c' }}>{'成長率'}</Typography>
                </div>
                <TableContainer sx={{}}>
                    <Table stickyHeader size="small" >
                        <TableHead>
                            <TableRow >
                                {columns.map((column: any) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, fontWeight: 'bold', color: "#455765" }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.growth
                                .map((row: any, i: number) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                                            {columns.map((column: any) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align} >
                                                        {column.id === "year" ?
                                                            <div style={{ fontSize: 15, fontWeight: 'bold' }}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </div> :
                                                            <Link onClick={() => { }} underline={'hover'} style={{ cursor: "pointer", fontSize: 15, fontWeight: 'bold', color: value === "-" ? "gray" : value >= 0 ? "#38b48b" : "#e95464" }}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </Link>
                                                        }
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default Growth;
