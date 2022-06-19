import * as React from 'react';
import { Divider, Typography, Paper, Tooltip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import { Result } from '../App';

const ValuePanel: React.FC<{ title: string, value: string, gray: boolean, color?: string, help?: string }> = ({ title, value, gray, color, help }) => {
    return (
        <div>
            <div style={{ backgroundColor: gray ? '#f3f3f2' : '#fffffc', padding: 20 }}>
                <div style={{ display: 'flex' }}>
                    <Typography style={{ fontSize: 15, fontWeight: 'bold', color: "#455765", textAlign: 'left' }}>{title}</Typography>
                    {help && <Tooltip title={<Typography style={{ fontSize: 15 }}>{help}</Typography>} placement="top"><HelpOutline fontSize="small" color="action" style={{ margin: 2 }} /></Tooltip>}
                </div>
                <Typography style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'left', color: color }}>{value}</Typography>
            </div>
            <Divider light />
        </div>
    );
}

interface Props {
    result: Result;
}

export default function Statistics({ result }: Props) {
    return (
        <div style={{ height: '100%' }}>
            <div style={{ marginTop: 10, marginBottom: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography style={{ fontSize: 20, fontWeight: 'bold', color: '#393f4c' }}>{'統計'}</Typography>
            </div>
            <Paper elevation={1} style={{}}>
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                        <ValuePanel title={"最終残高 ( 最大 / 平均 / 最小 )"} value={`${(result.stats.finalBalance.max / 10000).toFixed(0)}万 / ${(result.stats.finalBalance.avg / 10000).toFixed(0)}万 / ${(result.stats.finalBalance.min / 10000).toFixed(0)}万`} gray={false} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <ValuePanel title={"破産回数 / 破産確率％"} value={`${result.stats.bankruptcyNum}回 / ${(result.stats.bankruptcyNum * 100 / result.inputData.simulationNum).toFixed(1)}%`} gray={true} />
                    </div>
                </div>
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                        <ValuePanel title={"最大連勝数 ( 最大 / 平均 / 最小 )"} value={`${result.stats.maxConsecutiveLosses.max.toFixed(1)}回 / ${result.stats.maxConsecutiveWins.avg.toFixed(1)}回 / ${result.stats.maxConsecutiveWins.min.toFixed(1)}回`} gray={false} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <ValuePanel title={"最大連敗数 ( 最大 / 平均 / 最小 )"} value={`${result.stats.maxConsecutiveWins.max.toFixed(1)}回 / ${result.stats.maxConsecutiveLosses.avg.toFixed(1)}回 / ${result.stats.maxConsecutiveLosses.min.toFixed(1)}回`} gray={true} color={"#e95464"} />
                    </div>
                </div>
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                        <ValuePanel title={"最大ドローダウン ( 最大 / 平均 / 最小 )"} value={`${(result.stats.maxDrawdown.max / 10000).toFixed(0)}万 / ${(result.stats.maxDrawdown.avg / 10000).toFixed(0)}万 / ${(result.stats.maxDrawdown.min / 10000).toFixed(0)}万`} gray={false} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <ValuePanel title={"最大ドローダウン％ ( 最大 / 平均 / 最小 )"} value={`${(result.stats.maxDrawdownRate.max * 100).toFixed(1)}％ / ${(result.stats.maxDrawdownRate.avg * 100).toFixed(1)}％ / ${(result.stats.maxDrawdownRate.min * 100).toFixed(1)}％`} gray={true} color={"#e95464"} />
                    </div>
                </div>
            </Paper>
        </div>
    );
}
