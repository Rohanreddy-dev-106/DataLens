/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  BrainCircuit,
  Cpu,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  LayoutDashboard,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function DeepAnalyticPage() {
  const navigate = useNavigate();

  // --- Core States ---
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [parsingLogs, setParsingLogs] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const [detectedMode, setDetectedMode] = useState("Analyzing...");

  // Automated LangChain Model Performance Metrics
  const [metrics, setMetrics] = useState({
    tokensProcessed: "0",
    latency: "0 ms",
    anomalyRate: "0.00%",
    accuracy: "0.00%",
  });

  // --- Trigger LangChain ML Analysis Automatically on Mount ---
  useEffect(() => {
    runLangChainPipeline();
  }, []);

  const runLangChainPipeline = async () => {
    setIsLoading(true);
    try {
      // Express Gateway proxy routing directly to the Flask LangChain memory thread
      const response = await axios.post(
        "http://localhost:5000/api/analytics/deep-analyze",
        {},
        { withCredentials: true },
      );

      if (response.data && response.data.success) {
        const payload = response.data.data;

        // Parse metrics cleanly out of the structured AI payload response
        setMetrics({
          tokensProcessed: payload.metrics?.tokens_processed || "0",
          latency: `${payload.metrics?.latency_ms || 0} ms`,
          anomalyRate: `${payload.metrics?.anomaly_rate || 0}%`,
          accuracy: `${payload.metrics?.global_accuracy || 0}%`,
        });

        // Map and normalize the timeline array cleanly for robust area transitions
        const normalizedData = (payload.timeline_data || []).map((item) => ({
          label: item.label,
          // If value exists, use it. If it's a prediction step, fall back to the prediction variable
          displayValue: item.value !== null ? item.value : item.prediction,
          isPrediction: item.value === null,
        }));

        // Dynamic sub-header text depending on what strategy LangChain autonomously executed
        const hasTimeTrace = (payload.logs || []).some((log) =>
          log.context.toLowerCase().includes("time"),
        );
        setDetectedMode(
          hasTimeTrace
            ? "Time-Series Regression Model"
            : "Continuous Feature Target Regression",
        );

        setChartData(normalizedData);
        setParsingLogs(payload.logs || []);
        setHasRun(true);
      }
    } catch (err) {
      console.error("LangChain DataFrame sequence failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 text-slate-800 font-sans'>
      {/* Top Header Navigation */}
      <header className='bg-white border-b border-blue-100 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm'>
        <div>
          <div className='flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider'>
            <BrainCircuit size={14} />
            <span>DataLens Intelligence Layer</span>
          </div>
          <h1 className='text-2xl font-bold text-slate-900 mt-0.5'>
            Deep Predictive Analytics
          </h1>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => navigate("/analytics")}
            className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm cursor-pointer'>
            <LayoutDashboard size={16} className='text-slate-500' />
            <span>Back to Workspace</span>
          </button>

          <button className='bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2 cursor-pointer'>
            <span>Export Report</span>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <main className='p-6 max-w-[1600px] mx-auto space-y-6'>
        {/* Status System Action Bar */}
        <div className='bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <span className={`relative flex h-2.5 w-2.5`}>
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLoading ? "bg-amber-400" : "bg-emerald-400"} opacity-75`}></span>
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLoading ? "bg-amber-500" : "bg-emerald-500"}`}></span>
            </span>
            <p className='text-sm font-semibold text-slate-700'>
              {isLoading
                ? "LangChain Agent executing local Python AST routines against active memory pool..."
                : `Active Pipeline: Autonomous ${detectedMode}`}
            </p>
          </div>

          <button
            onClick={runLangChainPipeline}
            disabled={isLoading}
            className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer shadow-sm'>
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            <span>Re-Run Pipeline Matrix</span>
          </button>
        </div>

        {/* Global Evaluation Metrics Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          <div className='bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:border-blue-300 transition-all group'>
            <div className='flex justify-between items-start'>
              <p className='text-sm font-medium text-slate-500'>
                LLM Tokens Ingested
              </p>
              <div className='p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'>
                <Cpu size={20} />
              </div>
            </div>
            <p className='text-2xl font-bold text-slate-900 mt-2'>
              {metrics.tokensProcessed}
            </p>
          </div>

          <div className='bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:border-blue-300 transition-all group'>
            <div className='flex justify-between items-start'>
              <p className='text-sm font-medium text-slate-500'>
                LangChain Execution Latency
              </p>
              <div className='p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'>
                <RefreshCw size={20} />
              </div>
            </div>
            <p className='text-2xl font-bold text-slate-900 mt-2'>
              {metrics.latency}
            </p>
          </div>

          <div className='bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:border-blue-300 transition-all group'>
            <div className='flex justify-between items-start'>
              <p className='text-sm font-medium text-slate-500'>
                Calculated Anomaly Rate
              </p>
              <div className='p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'>
                <AlertTriangle size={20} />
              </div>
            </div>
            <p className='text-2xl font-bold text-slate-900 mt-2'>
              {metrics.anomalyRate}
            </p>
          </div>

          <div className='bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:border-blue-300 transition-all group'>
            <div className='flex justify-between items-start'>
              <p className='text-sm font-medium text-slate-500'>
                Composite Accuracy Score (R²)
              </p>
              <div className='p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'>
                <CheckCircle size={20} />
              </div>
            </div>
            <p className='text-2xl font-bold text-slate-900 mt-2'>
              {metrics.accuracy}
            </p>
          </div>
        </div>

        {/* Charts & Cross-Model Breakdown */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='bg-white p-6 rounded-xl border border-blue-100 shadow-sm lg:col-span-2 flex flex-col justify-between'>
            <div>
              <h3 className='text-lg font-bold text-slate-900 flex items-center gap-2'>
                <TrendingUp size={18} className='text-indigo-600' />
                Extrapolated Predictive Sequencer
              </h3>
              <p className='text-xs text-slate-500 mb-4'>
                Dynamic prediction horizon rendered from backend model output
                matrix bounds
              </p>
            </div>

            <div className='h-80 w-full bg-slate-50/50 rounded-xl p-2 border border-slate-100'>
              {chartData.length > 0 && !isLoading ? (
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient
                        id='colorDisplay'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'>
                        <stop
                          offset='5%'
                          stopColor='#4f46e5'
                          stopOpacity={0.2}
                        />
                        <stop
                          offset='95%'
                          stopColor='#4f46e5'
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f1f5f9' />
                    <XAxis
                      dataKey='label'
                      stroke='#94a3b8'
                      style={{ fontSize: "10px", fontFamily: "monospace" }}
                    />
                    <YAxis
                      stroke='#94a3b8'
                      style={{ fontSize: "10px", fontFamily: "monospace" }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className='bg-white p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1'>
                              <p className='font-mono text-slate-400'>
                                {data.label}
                              </p>
                              <p className='font-bold text-slate-800'>
                                Value:{" "}
                                <span className='text-indigo-600'>
                                  {payload[0].value}
                                </span>
                              </p>
                              <p className='text-[10px] font-bold uppercase tracking-wider'>
                                {data.isPrediction ? (
                                  <span className='text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded'>
                                    AI Forecast Interval
                                  </span>
                                ) : (
                                  <span className='text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded'>
                                    Historical Base
                                  </span>
                                )}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }}
                    />
                    <Area
                      type='monotone'
                      dataKey='displayValue'
                      stroke='#4f46e5'
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill='url(#colorDisplay)'
                      name='Unified Feature Matrix Metric'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className='w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2'>
                  <RefreshCw
                    size={26}
                    className='animate-spin text-indigo-500'
                  />
                  <p className='font-semibold text-slate-600'>
                    Compiling model distributions and calculating statistical
                    weights...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Model Weights Variance */}
          <div className='bg-white p-6 rounded-xl border border-blue-100 shadow-sm flex flex-col justify-between'>
            <div>
              <h3 className='text-lg font-bold text-slate-900'>
                Agentic Confidence Allocation
              </h3>
              <p className='text-xs text-slate-500 mb-4'>
                LangChain token pipeline routine selector certainty weights
              </p>

              <div className='space-y-4 pt-2'>
                {[
                  {
                    name: "Time-Series Agent Execution",
                    value: "94%",
                    color: "bg-indigo-600",
                  },
                  {
                    name: "Scikit-Learn Regression Ensemble",
                    value: "87%",
                    color: "bg-blue-500",
                  },
                  {
                    name: "NumPy Statistical Bounds",
                    value: "81%",
                    color: "bg-sky-400",
                  },
                ].map((item, i) => (
                  <div key={i} className='space-y-1'>
                    <div className='flex justify-between text-xs font-semibold'>
                      <span className='text-slate-600'>{item.name}</span>
                      <span className='text-slate-900'>{item.value}</span>
                    </div>
                    <div className='w-full bg-slate-100 h-2 rounded-full overflow-hidden'>
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: hasRun ? item.value : "0%" }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-6 pt-4 border-t border-slate-100 bg-blue-50/40 p-3 rounded-xl text-xs text-blue-800 flex items-start gap-2'>
              <Sparkles size={16} className='text-blue-600 shrink-0 mt-0.5' />
              <p>
                <strong>Engine Insight:</strong> LangChain reads dataframe
                dimensions natively, avoiding token overflow limits while
                evaluating algorithmic models dynamically via Python AST
                compilers.
              </p>
            </div>
          </div>
        </div>

        {/* Pipeline Verification Logs Table */}
        <div className='bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden'>
          <div className='px-6 py-4 border-b border-slate-100'>
            <h3 className='text-lg font-bold text-slate-900'>
              LangChain Agent Execution Trace
            </h3>
            <p className='text-xs text-slate-500'>
              Real-time multi-agent processing sequences run by the Flask core
              framework
            </p>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse text-sm'>
              <thead>
                <tr className='bg-slate-50 text-slate-500 uppercase font-bold text-xs tracking-wider border-b border-slate-100'>
                  <th className='px-6 py-3'>Trace Step ID</th>
                  <th className='px-6 py-3'>Agent / Tool Layer Context</th>
                  <th className='px-6 py-3'>Mathematical Metric Outcome</th>
                  <th className='px-6 py-3 text-right'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 text-slate-700 font-medium'>
                {parsingLogs.length > 0 && !isLoading ? (
                  parsingLogs.map((log, index) => (
                    <tr
                      key={index}
                      className='hover:bg-blue-50/20 transition-colors animate-fade-in'>
                      <td className='px-6 py-3.5 font-mono text-xs font-bold text-indigo-600'>
                        {log.step_id}
                      </td>
                      <td className='px-6 py-3.5 text-slate-900'>
                        {log.context}
                      </td>
                      <td className='px-6 py-3.5 font-mono text-xs text-slate-500'>
                        {log.metric}
                      </td>
                      <td className='px-6 py-3.5 text-right'>
                        <span className='px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200'>
                          Success
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className='px-6 py-12 text-center text-xs text-slate-400 font-medium'>
                      <RefreshCw
                        size={16}
                        className='animate-spin text-slate-300 mx-auto mb-2'
                      />
                      Awaiting response stream patterns from the Flask engine
                      layer...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
