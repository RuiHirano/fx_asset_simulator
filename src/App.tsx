import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import { Box, Paper, Typography } from '@mui/material';
import Title from './components/Title';
import Form from './components/Form';
import ResultBoard from './components/ResultBoard';

export interface Simulation {
  id: number
  bankrupt: boolean
  stats: {
    grossProfit: number
    grossLoss: number
    maxConsecutiveWins: number
    maxConsecutiveLosses: number
    maxDrawdown: number
    maxDrawdownRate: number
  }
  transitions: { index: number, balance: number }[]
}

export interface Statistics {
  bankruptcyNum: number //破産回数
  finalBalance: {
    min: number
    max: number
    avg: number
  }
  maxBalance: number
  minBalance: number
  maxConsecutiveWins: {
    min: number
    max: number
    avg: number
  }
  maxConsecutiveLosses: {
    min: number
    max: number
    avg: number
  }
  maxDrawdown: {
    min: number
    max: number
    avg: number
  }
  maxDrawdownRate: {
    min: number
    max: number
    avg: number
  }
}

export interface Result {
  inputData: InputData
  simulations: Simulation[]
  stats: Statistics
}

export interface InputData {
  balance: number
  type: 'fixed' | 'variable'
  risk: number
  reward: number
  winRate: number
  bankruptcyLevel: number
  monthlyTradeNum: number
  simulationMonthNum: number
  simulationNum: number
}

export const defaultInputData: InputData = {
  balance: 1000000,
  type: 'fixed',
  risk: 0.01,
  reward: 0.02,
  winRate: 0.5,
  bankruptcyLevel: 0.5,
  monthlyTradeNum: 10,
  simulationMonthNum: 6,
  simulationNum: 10
}

export const defaultResult: Result = {
  inputData: defaultInputData,
  simulations: [],
  stats: {
    bankruptcyNum: 0,
    finalBalance: {
      min: 0,
      max: 0,
      avg: 0
    },
    maxBalance: 0,
    minBalance: 0,
    maxConsecutiveWins: {
      min: 0,
      max: 0,
      avg: 0
    },
    maxConsecutiveLosses: {
      min: 0,
      max: 0,
      avg: 0
    },
    maxDrawdown: {
      min: 0,
      max: 0,
      avg: 0
    },
    maxDrawdownRate: {
      min: 0,
      max: 0,
      avg: 0
    },
  }
}

class Simulator {
  constructor() {

  }

  simulateOne(id: number, data: InputData): Simulation {
    let balance = data.balance;
    const simulation: Simulation = {
      id: id,
      bankrupt: false,
      stats: {
        grossProfit: 0,
        grossLoss: 0,
        maxConsecutiveWins: 0,
        maxConsecutiveLosses: 0,
        maxDrawdown: 0,
        maxDrawdownRate: 0,
      },
      transitions: [
        { index: 0, balance: balance }
      ]
    }
    let consecutiveWins = 0;
    let consecutiveLosses = 0;
    let maxBalance = data.balance;
    let maxDrawdown = 0;
    let maxDrawdownRate = 0;
    for (let i = 1; i < data.simulationMonthNum * data.monthlyTradeNum + 1; i++) {
      if (Math.random() <= data.winRate) {
        if (data.type === 'fixed') {
          balance += data.balance * data.reward;
          simulation.stats.grossProfit += data.balance * data.reward
        } else {
          balance += balance * data.reward;
          simulation.stats.grossProfit += balance * data.reward
        }
        consecutiveWins++;
        consecutiveLosses = 0;
        if (simulation.stats.maxConsecutiveWins < consecutiveWins) {
          simulation.stats.maxConsecutiveWins = consecutiveWins;
        }
        if (balance > maxBalance) {
          maxBalance = balance;
        }
      } else {
        if (data.type === 'fixed') {
          balance -= data.balance * data.risk;
          simulation.stats.grossLoss -= data.balance * data.risk
        } else {
          balance -= balance * data.risk;
          simulation.stats.grossLoss -= balance * data.risk
        }
        consecutiveLosses++;
        consecutiveWins = 0;
        if (simulation.stats.maxConsecutiveLosses < consecutiveLosses) {
          simulation.stats.maxConsecutiveLosses = consecutiveLosses;
        }
        if (balance < maxBalance) {
          maxDrawdown = maxBalance - balance;
          if (simulation.stats.maxDrawdown < maxDrawdown) {
            simulation.stats.maxDrawdown = Math.floor(maxDrawdown);
          }
          maxDrawdownRate = maxDrawdown / maxBalance;
          if (simulation.stats.maxDrawdownRate < maxDrawdownRate) {
            simulation.stats.maxDrawdownRate = maxDrawdownRate;
          }
        }
      }
      if (balance <= data.balance * data.bankruptcyLevel) {
        simulation.bankrupt = true;
        break;
      }
      simulation.transitions.push({ index: i, balance: Math.floor(balance) });
    }
    simulation.stats.grossProfit = simulation.transitions[simulation.transitions.length - 1].balance - data.balance;
    return simulation
  }

  calcStats(data: InputData, simulations: Simulation[]): Statistics {
    const stats: Statistics = {
      bankruptcyNum: 0,
      finalBalance: {
        min: 0,
        max: 0,
        avg: 0
      },
      maxBalance: 0,
      minBalance: 0,
      maxConsecutiveWins: {
        min: 0,
        max: 0,
        avg: 0
      },
      maxConsecutiveLosses: {
        min: 0,
        max: 0,
        avg: 0
      },
      maxDrawdown: {
        min: 0,
        max: 0,
        avg: 0
      },
      maxDrawdownRate: {
        min: 0,
        max: 0,
        avg: 0
      },
    }
    stats.bankruptcyNum = simulations.filter(simulation => simulation.bankrupt).length;
    const finalBalanceList = simulations.map(simulation => simulation.transitions[simulation.transitions.length - 1].balance);
    stats.finalBalance.min = Math.min(...finalBalanceList);
    stats.finalBalance.max = Math.max(...finalBalanceList);
    stats.finalBalance.avg = finalBalanceList.reduce((a, b) => a + b, 0) / finalBalanceList.length;
    stats.maxConsecutiveWins.max = simulations.map(simulation => simulation.stats.maxConsecutiveWins).reduce((a, b) => Math.max(a, b), 0);
    stats.maxConsecutiveWins.min = simulations.map(simulation => simulation.stats.maxConsecutiveWins).reduce((a, b) => Math.min(a, b), stats.maxConsecutiveWins.max);
    stats.maxConsecutiveWins.avg = simulations.map(simulation => simulation.stats.maxConsecutiveWins).reduce((a, b) => a + b, 0) / simulations.length;
    stats.maxConsecutiveLosses.max = simulations.map(simulation => simulation.stats.maxConsecutiveLosses).reduce((a, b) => Math.max(a, b), 0);
    stats.maxConsecutiveLosses.min = simulations.map(simulation => simulation.stats.maxConsecutiveLosses).reduce((a, b) => Math.min(a, b), stats.maxConsecutiveLosses.max);
    stats.maxConsecutiveLosses.avg = simulations.map(simulation => simulation.stats.maxConsecutiveLosses).reduce((a, b) => a + b, 0) / simulations.length;
    stats.maxDrawdown.max = simulations.map(simulation => simulation.stats.maxDrawdown).reduce((a, b) => Math.max(a, b), 0);
    stats.maxDrawdown.min = simulations.map(simulation => simulation.stats.maxDrawdown).reduce((a, b) => Math.min(a, b), stats.maxDrawdown.max);
    stats.maxDrawdown.avg = simulations.map(simulation => simulation.stats.maxDrawdown).reduce((a, b) => a + b, 0) / simulations.length;
    stats.maxDrawdownRate.max = simulations.map(simulation => simulation.stats.maxDrawdownRate).reduce((a, b) => Math.max(a, b), 0);
    stats.maxDrawdownRate.min = simulations.map(simulation => simulation.stats.maxDrawdownRate).reduce((a, b) => Math.min(a, b), stats.maxDrawdownRate.max);
    stats.maxDrawdownRate.avg = simulations.map(simulation => simulation.stats.maxDrawdownRate).reduce((a, b) => a + b, 0) / simulations.length;
    return stats
  }

  simulate(data: InputData): Result {
    const result: Result = {
      inputData: data,
      simulations: [],
      stats: {
        bankruptcyNum: 0,
        finalBalance: {
          min: 0,
          max: 0,
          avg: 0
        },
        maxBalance: 0,
        minBalance: 0,
        maxConsecutiveWins: {
          min: 0,
          max: 0,
          avg: 0
        },
        maxConsecutiveLosses: {
          min: 0,
          max: 0,
          avg: 0
        },
        maxDrawdown: {
          min: 0,
          max: 0,
          avg: 0
        },
        maxDrawdownRate: {
          min: 0,
          max: 0,
          avg: 0
        },
      }
    }
    for (let i = 0; i < data.simulationNum; i++) {
      const simulation = this.simulateOne(i, data);
      result.simulations.push(simulation);
    }

    const stats = this.calcStats(data, result.simulations)
    result.stats = stats;
    return result
  }
}

function App() {
  const [result, setResult] = useState<Result | null>(null)

  const handleSimulate = (data: InputData) => {
    const simulator = new Simulator()
    const result = simulator.simulate(data)
    console.log(result)
    setResult(result)
  }
  return (
    <div style={{ backgroundColor: '#f8f8ff' }}>
      <Header title="FX、CFD用資産シミュレーション" />
      <Box sx={{ paddingLeft: { lg: 40, md: 10, sm: 5, xs: 3 }, paddingRight: { lg: 40, md: 10, sm: 5, xs: 3 } }} style={{ paddingBottom: 100 }}>
        <div style={{ marginTop: 40 }}>
          <Title title="FX、CFD用資産シミュレーション" description='FX、CFDにおける取引開始時の口座資産、想定する損失額や損益比率、勝率等を入力すると、口座資産の変化をシミュレーションすることができます。 1回のトレードでどの程度のリスクをとり、どの程度のリターンを狙っていけばよいのか、そしてどの程度の勝率があれば資産が増えていくのかをイメージすることができます。 投資戦略を考える上での参考データとしてご活用ください。' />
        </div>
        <div style={{ marginTop: 40 }}>
          <Form onSubmit={handleSimulate} />
        </div>
        {result &&
          <div style={{ marginTop: 40 }}>
            <ResultBoard result={result} />
          </div>
        }
      </Box>
    </div>
  );
}

export default App;
