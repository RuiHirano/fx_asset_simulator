import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import { Paper, Typography } from '@mui/material';
import Title from './components/Title';
import Form from './components/Form';
import ResultBoard from './components/ResultBoard';

export interface Simulation {
  id: number
  bankrupt: boolean
  transitions: { index: number, balance: number }[]
}

export interface Statistics {
  bankruptcyNum: number
  finalBalance: {
    min: number
    max: number
    avg: number
  },
  maxBalance: number
  minBalance: number
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
    minBalance: 0
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
      transitions: [
        { index: 0, balance: balance }
      ]
    }
    for (let i = 1; i < data.simulationMonthNum * data.monthlyTradeNum + 1; i++) {
      if (Math.random() <= data.winRate) {
        if (data.type === 'fixed') {
          balance += data.balance * data.reward;
        } else {
          balance += balance * data.reward;
        }
      } else {
        if (data.type === 'fixed') {
          balance -= data.balance * data.risk;
        } else {
          balance -= balance * data.risk;
        }
      }
      if (balance <= data.balance * data.bankruptcyLevel) {
        simulation.bankrupt = true;
        break;
      }
      simulation.transitions.push({ index: i, balance: Math.floor(balance) });
    }
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
      minBalance: 0
    }
    stats.bankruptcyNum = simulations.filter(simulation => simulation.bankrupt).length;
    const finalBalanceList = simulations.map(simulation => simulation.transitions[simulation.transitions.length - 1].balance);
    stats.finalBalance.min = Math.min(...finalBalanceList);
    stats.finalBalance.max = Math.max(...finalBalanceList);
    stats.finalBalance.avg = finalBalanceList.reduce((a, b) => a + b, 0) / finalBalanceList.length;
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
        minBalance: 0
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
      <div style={{ paddingLeft: 100, paddingRight: 100, paddingBottom: 100 }}>
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
      </div>
    </div>
  );
}

export default App;
