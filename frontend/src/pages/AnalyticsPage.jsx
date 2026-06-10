/** @format */

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  BarChart3,
  LayoutDashboard,
  Database,
  Settings,
  LogOut,
  Home,
  Sparkles,
  RefreshCw,
  Upload,
  AlertCircle,
  Trash2,
  FileSpreadsheet,
  Menu,
  ChevronLeft,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
  ReferenceArea,
  Label,
} from "recharts";

export default function AnalyticsPage({ user, onLogout }) {
  const location = useLocation();

  // Helper function to dynamically highlight active router nodes
  const isActive = (path) => location.pathname === path;

  // Layout states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // File Upload & Analysis states
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState("numeric");
  const [visualTab, setVisualTab] = useState("nulls");
  const [selectedNumCol, setSelectedNumCol] = useState("");
  const [selectedCatCol, setSelectedCatCol] = useState("");
  const [savedFileName, setSavedFileName] = useState("");

  // ── Rehydrate from localStorage on first mount ──
  useEffect(() => {
    try {
      const cached = localStorage.getItem("datalens_analysis");
      if (cached) {
        const { result, numCol, catCol, fileName } = JSON.parse(cached);
        if (result) {
          setAnalysisResult(result);
          if (numCol) setSelectedNumCol(numCol);
          if (catCol) setSelectedCatCol(catCol);
          if (fileName) setSavedFileName(fileName);
        }
      }
    } catch (e) {
      console.warn("Failed to restore analysis from localStorage:", e);
    }
  }, []);

  // Interactive frontend-only chart feature states
  const [distChartType, setDistChartType] = useState("area");
  const [showMeanLine, setShowMeanLine] = useState(true);
  const [showMedianLine, setShowMedianLine] = useState(true);
  const [rowSliceStart, setRowSliceStart] = useState(0);
  const [rowSliceEnd, setRowSliceEnd] = useState(80);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
        handleFileUpload(droppedFile);
      } else {
        setError("Please upload a valid CSV file.");
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
        handleFileUpload(selectedFile);
      } else {
        setError("Please upload a valid CSV file.");
      }
    }
  };

  const handleFileUpload = async (selectedFile) => {
    setUploading(true);
    setError("");
    setAnalysisResult(null);
    setSavedFileName("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/analysis",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data && response.data.success) {
        const resultData = response.data.data;
        const numCols = resultData.filtered_map?.numeric || [];
        const catCols = resultData.filtered_map?.categorical || [];
        const firstNum = numCols.length > 0 ? numCols[0] : "";
        const firstCat = catCols.length > 0 ? catCols[0] : "";
        const fName = selectedFile?.name || "";

        setAnalysisResult(resultData);
        if (firstNum) setSelectedNumCol(firstNum);
        if (firstCat) setSelectedCatCol(firstCat);
        setSavedFileName(fName);

        // ── Persist to localStorage ──
        try {
          localStorage.setItem(
            "datalens_analysis",
            JSON.stringify({ result: resultData, numCol: firstNum, catCol: firstCat, fileName: fName })
          );
        } catch (e) {
          console.warn("localStorage save failed:", e);
        }
      } else {
        setError(response.data.message || "Failed to analyze the file.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message || err.message || "An error occurred during upload."
      );
    } finally {
      setUploading(false);
    }
  };

  const clearAnalysis = () => {
    setFile(null);
    setAnalysisResult(null);
    setError("");
    setSelectedNumCol("");
    setSelectedCatCol("");
    setSavedFileName("");
    localStorage.removeItem("datalens_analysis");
  };

  const getColType = (colName) => {
    for (const [type, cols] of Object.entries(analysisResult?.filtered_map || {})) {
      if (cols.includes(colName)) return type;
    }
    return "unknown";
  };

  // Prepare data for Recharts
  const missingChartData = Object.entries(analysisResult?.missing_summary || {}).map(
    ([colName, metrics]) => ({ name: colName, "Missing %": metrics.missing_percent, "Missing Count": metrics.missing_count })
  );

  const numericCols = analysisResult?.filtered_map?.numeric || [];
  const catCols = analysisResult?.filtered_map?.categorical || [];

  const distributionChartData = (analysisResult?.data || []).slice(0, 80).map(
    (row, index) => ({ index: index + 1, value: parseFloat(row[selectedNumCol]) || 0 })
  );

  const colSummary = selectedNumCol && analysisResult?.numeric_summary?.[selectedNumCol];
  const meanVal = colSummary?.mean !== undefined && colSummary?.mean !== null ? colSummary.mean : null;
  const medianVal = colSummary?.median !== undefined && colSummary?.median !== null ? colSummary.median : null;

  // Numeric comparison: mean/median/std across all numeric columns
  const numCompareData = Object.entries(analysisResult?.numeric_summary || {}).map(
    ([col, s]) => ({
      name: col,
      Mean: s.mean !== null && s.mean !== undefined ? +(s.mean.toFixed(2)) : null,
      Median: s.median !== null && s.median !== undefined ? +(s.median.toFixed(2)) : null,
      StdDev: s.std !== null && s.std !== undefined ? +(s.std.toFixed(2)) : null
    })
  );

  // Radar chart: normalized numeric stats for selected column
  const radarData = selectedNumCol && analysisResult?.numeric_summary?.[selectedNumCol]
    ? (() => {
        const s = analysisResult.numeric_summary[selectedNumCol];
        const meanVal = s.mean !== null && s.mean !== undefined ? s.mean : 0;
        const medianVal = s.median !== null && s.median !== undefined ? s.median : 0;
        const stdVal = s.std !== null && s.std !== undefined ? s.std : 0;
        const minVal = s.min !== null && s.min !== undefined ? s.min : 0;
        const maxVal = s.max !== null && s.max !== undefined ? s.max : 0;
        const mx = Math.max(Math.abs(meanVal), Math.abs(maxVal), Math.abs(stdVal), 1);
        return [
          { metric: "Mean", value: +((meanVal / mx) * 100).toFixed(1) },
          { metric: "Median", value: +((medianVal / mx) * 100).toFixed(1) },
          { metric: "Std Dev", value: +((stdVal / mx) * 100).toFixed(1) },
          { metric: "Min", value: +((minVal / mx) * 100).toFixed(1) },
          { metric: "Max", value: +((maxVal / mx) * 100).toFixed(1) },
        ];
      })()
    : [];

  // Categorical frequency: value_counts for selected categorical column
  const catFreqData = selectedCatCol && analysisResult?.data
    ? (() => { const counts = {}; analysisResult.data.forEach(r => { const v = r[selectedCatCol]; if (v != null) counts[v] = (counts[v]||0)+1; }); return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,v])=>({ name: k, count: v })); })()
    : [];

  // Data composition pie: numeric vs categorical vs datetime column counts
  const COLORS = ["#6366f1", "#8b5cf6", "#f59e0b", "#10b981"];
  const compositionData = Object.entries(analysisResult?.filtered_map || {}).map(
    ([type, cols]) => ({ name: type, value: cols.length })
  );

  return (
    <div className='relative min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans'>
      {/* ─── GLOBAL DECORATIVE GLOW BACKGROUND ─── */}
      <div
        className='absolute inset-0 z-0 pointer-events-none'
        aria-hidden='true'>
        {/* SVG Grid Lines */}
        <svg className='absolute inset-0 h-full w-full stroke-slate-200/80 [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]'>
          <defs>
            <pattern
              id='analytics-grid'
              width='40'
              height='40'
              patternUnits='userSpaceOnUse'
              x='50%'>
              <path d='M.5 40V.5H40' fill='none' />
            </pattern>
          </defs>
          <rect
            width='100%'
            height='100%'
            strokeWidth='0'
            fill='url(#analytics-grid)'
          />
        </svg>

        {/* Ambient Glows */}
        <div className='absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-100/40 blur-3xl' />
        <div className='absolute bottom-10 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-100/30 blur-3xl' />
      </div>

      {/* ─── SIDEBAR NAVIGATION ─── */}
      <aside className={`relative z-20 border-r border-slate-200/80 bg-white/80 backdrop-blur-md flex flex-col justify-between transition-all duration-300 ease-in-out overflow-hidden ${
        isSidebarCollapsed ? "w-0 border-r-0" : "w-64"
      }`}>
        <div className={`flex flex-col justify-between h-full p-6 transition-all duration-300 ${
          isSidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`} style={{ minWidth: '256px' }}>
          <div className='space-y-8'>
            {/* Logo and Collapse Toggle */}
            <div className='flex items-center justify-between'>
              <div className='text-2xl font-black tracking-tight text-slate-900 select-none'>
                DataLens<span className='text-indigo-600'>.</span>
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className='p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer'
                title="Collapse Sidebar"
              >
                <ChevronLeft className='w-4.5 h-4.5' />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className='space-y-1'>
              <Link
                to='/'
                className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all'>
                <Home className='w-4 h-4' />
                Landing Page
              </Link>

              <Link
                to='/analytics'
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive("/analytics")
                    ? "font-semibold bg-indigo-50 border border-indigo-100 text-indigo-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}>
                <LayoutDashboard className='w-4 h-4' />
                Workspace
              </Link>

              {/* UNLOCKED: Deep Analytics Link Layer */}
              <Link
                to='/analytics/deep'
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  isActive("/analytics/deep")
                    ? "font-semibold bg-indigo-50 border-indigo-100 text-indigo-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent"
                }`}>
                <BarChart3 className='w-4 h-4' />
                <span>Deep Analytics</span>
              </Link>

              {/* Kept placeholders intact but clean for future features */}
              <div className='opacity-50 cursor-not-allowed flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-400'>
                <span className='flex items-center gap-3'>
                  <Database className='w-4 h-4' />
                  Data Manager
                </span>
                <span className='text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded'>
                  Soon
                </span>
              </div>

              <div className='opacity-50 cursor-not-allowed flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-400'>
                <span className='flex items-center gap-3'>
                  <Settings className='w-4 h-4' />
                  Settings
                </span>
              </div>
            </nav>
          </div>

          {/* User Info & Logout */}
          <div className='space-y-4 pt-6 border-t border-slate-100'>
            {user && (
              <div className='px-2'>
                <p className='text-[10px] text-slate-400 font-mono tracking-wider'>
                  AUTHENTICATED NODE
                </p>
                <p className='text-sm font-bold text-slate-800 truncate'>
                  {user.name}
                </p>
                <p className='text-xs text-slate-500 truncate'>{user.email}</p>
              </div>
            )}
            <button
              onClick={onLogout}
              className='w-full flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-xs font-semibold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100/60 hover:text-red-700 transition-all cursor-pointer'>
              <LogOut className='w-3.5 h-3.5' />
              Disconnect Node
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN WORKSPACE CONTENT ─── */}
      <main className='relative z-10 flex-1 flex flex-col overflow-y-auto'>
        {/* Top Header */}
        <header className='h-16 border-b border-slate-200/60 bg-white/40 backdrop-blur-md flex items-center justify-between px-8 shrink-0'>
          <div className='flex items-center gap-3'>
            {isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className='p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer'
                title="Expand Sidebar"
              >
                <Menu className='w-4.5 h-4.5' />
              </button>
            )}
            <div className='flex items-center gap-2'>
              <span className='w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse' />
              <span className='text-[11px] text-slate-500 font-mono tracking-wider'>
                LIVE NODE SYSTEM STREAM
              </span>
            </div>
          </div>
          <Link
            to='/'
            className='flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors'>
            <Home className='w-3.5 h-3.5' />
            Back to Home
          </Link>
        </header>

        {/* Dashboard Content Container */}
        <div className={`flex-1 p-8 flex flex-col ${analysisResult ? 'justify-start items-stretch' : 'justify-center items-center'} max-w-[1600px] mx-auto w-full transition-all duration-300`}>
          {!analysisResult ? (
            /* Main Presentation Card */
            <div className='w-full max-w-2xl text-center space-y-8 p-8 md:p-12 rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-lg shadow-xl shadow-slate-200/50 relative overflow-hidden animate-fade-in'>
              <div className='absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-indigo-100/30 blur-2xl pointer-events-none' />

              <div className='inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full shadow-sm'>
                <Sparkles className='w-3.5 h-3.5 text-indigo-600' />
                DataLens Workspace Node
              </div>

              <div className='space-y-4'>
                <h2 className='text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-transparent'>
                  Analytics Workspace
                </h2>
                <p className='text-slate-600 max-w-md mx-auto text-sm md:text-base leading-relaxed font-medium'>
                  We are building the next generation DataLens workspace. Upload,
                  clean, structure, and visualize your pipelines directly from
                  this console.
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
                  isDragOver
                    ? "border-indigo-500 bg-indigo-50/50"
                    : "border-slate-300 hover:border-indigo-400 bg-slate-50/50"
                } flex flex-col items-center justify-center gap-4 cursor-pointer`}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <label
                  htmlFor="file-upload"
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="p-4 bg-white rounded-full shadow-md border border-slate-100 text-indigo-600 mb-2">
                    <Upload className="w-8 h-8 animate-bounce" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    Drag and drop your CSV file here
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    or click to browse from device
                  </span>
                </label>
              </div>

              {/* Progress status loader mimicking workspace generation */}
              {uploading && (
                <div className='space-y-2 max-w-sm mx-auto'>
                  <div className='flex justify-between text-[11px] font-mono text-slate-500'>
                    <span className='flex items-center gap-1.5'>
                      <RefreshCw className='w-3 h-3 animate-spin text-indigo-500' />
                      compiling analytics dashboard
                    </span>
                    <span className='font-semibold'>In Progress</span>
                  </div>
                  <div className='w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 shadow-inner'>
                    <div className='h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-pulse w-full' />
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl max-w-md mx-auto">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Interactive Redirect Button to go straight into the Deep ML Dashboard */}
              <div className='pt-4'>
                <Link
                  to='/analytics/deep'
                  className='inline-block px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wider text-xs uppercase shadow-md shadow-indigo-600/10 transition-all cursor-pointer'>
                  Launch Deep Analysis Engine
                </Link>
              </div>
            </div>
          ) : (
            /* Results Dashboard Grid */
            <div className="w-full space-y-6 animate-fade-in pb-12">
              {/* Header Panel */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 truncate max-w-md">
                      {file ? file.name : savedFileName || "Dataset Profile"}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Analysis completed successfully. Outliers & null patterns resolved.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={clearAnalysis}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400" />
                    Reset Workspace
                  </button>

                  <Link
                    to="/analytics/deep"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/10"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    Run Deep Predictions
                  </Link>
                </div>
              </div>

              {/* Stats Counters Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Rows</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {analysisResult.data?.length || 0}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Numeric Fields</p>
                  <p className="text-2xl font-black text-indigo-600 mt-1">
                    {Object.keys(analysisResult.numeric_summary || {}).length}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Categorical Fields</p>
                  <p className="text-2xl font-black text-indigo-600 mt-1">
                    {Object.keys(analysisResult.categorical_summary || {}).length}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Datetime Fields</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {Object.keys(analysisResult.datetime_summary || {}).length}
                  </p>
                </div>
              </div>

              {/* Detail Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Column Types & Missingness Table */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden lg:col-span-5 flex flex-col">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Dataset Schema & Missing Metrics</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Summary of column types and percentage of nulls</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                          <th className="px-5 py-3">Field</th>
                          <th className="px-5 py-3">Type</th>
                          <th className="px-5 py-3 text-right">Missing %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {Object.entries(analysisResult.missing_summary || {}).map(([colName, metrics]) => {
                          const type = getColType(colName);
                          return (
                            <tr key={colName} className="hover:bg-slate-50/50">
                              <td className="px-5 py-3 font-semibold text-slate-900 truncate max-w-[120px]" title={colName}>
                                {colName}
                              </td>
                              <td className="px-5 py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  type === "numeric" ? "bg-blue-50 text-blue-700" :
                                  type === "categorical" ? "bg-purple-50 text-purple-700" :
                                  type === "datetime" ? "bg-amber-50 text-amber-700" :
                                  "bg-slate-100 text-slate-600"
                                }`}>
                                  {type}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-right font-mono">
                                <div className="flex items-center justify-end gap-1.5">
                                  <span>{metrics.missing_percent}%</span>
                                  <span className="text-[10px] text-slate-400">({metrics.missing_count})</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Side Stack: Tabbed Summaries + Visual Analytics Chart */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Tabbed Summaries */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center px-5 border-b border-slate-100 bg-slate-50/30">
                      <div className="flex gap-4">
                        <button
                          onClick={() => setActiveTab("numeric")}
                          className={`py-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                            activeTab === "numeric"
                              ? "border-indigo-600 text-indigo-600"
                              : "border-transparent text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          Numeric Stats
                        </button>
                        <button
                          onClick={() => setActiveTab("categorical")}
                          className={`py-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                            activeTab === "categorical"
                              ? "border-indigo-600 text-indigo-600"
                              : "border-transparent text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          Categorical Stats
                        </button>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        Descriptive distributions
                      </span>
                    </div>

                    <div className="p-5 flex-1 overflow-y-auto max-h-[350px]">
                      {activeTab === "numeric" ? (
                        Object.keys(analysisResult.numeric_summary || {}).length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-8">No numeric columns found in the dataset.</p>
                        ) : (
                          <div className="space-y-4">
                            {Object.entries(analysisResult.numeric_summary).map(([colName, stats]) => (
                              <div key={colName} className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-all">
                                <h4 className="font-bold text-slate-900 text-sm">{colName}</h4>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3 text-center">
                                  {[
                                    { label: "Count", val: stats.count },
                                    { label: "Mean", val: stats.mean !== null && stats.mean !== undefined ? stats.mean.toFixed(2) : "N/A" },
                                    { label: "Median", val: stats.median !== null && stats.median !== undefined ? stats.median.toFixed(2) : "N/A" },
                                    { label: "Std Dev", val: stats.std !== null && stats.std !== undefined ? stats.std.toFixed(2) : "N/A" },
                                    { label: "Min", val: stats.min !== null && stats.min !== undefined ? stats.min.toFixed(2) : "N/A" },
                                    { label: "Max", val: stats.max !== null && stats.max !== undefined ? stats.max.toFixed(2) : "N/A" },
                                  ].map((item, idx) => (
                                    <div key={idx} className="bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                                      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">{item.label}</p>
                                      <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{item.val}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      ) : (
                        Object.keys(analysisResult.categorical_summary || {}).length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-8">No categorical columns found in the dataset.</p>
                        ) : (
                          <div className="space-y-4">
                            {Object.entries(analysisResult.categorical_summary).map(([colName, stats]) => (
                              <div key={colName} className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-all">
                                <h4 className="font-bold text-slate-900 text-sm">{colName}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-center">
                                  {[
                                    { label: "Count", val: stats.count },
                                    { label: "Unique", val: stats.unique },
                                    { label: "Most Freq", val: stats.most_frequent || "N/A" },
                                    { label: "Freq Count", val: stats.freq },
                                  ].map((item, idx) => (
                                    <div key={idx} className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 flex flex-col justify-center">
                                      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">{item.label}</p>
                                      <p className="text-xs font-bold text-slate-800 mt-0.5 truncate font-mono" title={item.val}>{item.val}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* ═══ VISUAL ANALYTICS CHARTS ═══ */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[400px]">
                    <div className="flex justify-between items-center px-5 border-b border-slate-100 bg-slate-50/30 shrink-0 overflow-x-auto">
                      <div className="flex gap-3">
                        {["nulls","distribution","comparison","categorical","composition"].map(t=>(
                          <button key={t} onClick={()=>setVisualTab(t)} className={`py-3 whitespace-nowrap font-bold text-[10px] uppercase tracking-wider border-b-2 transition-all cursor-pointer ${visualTab===t?"border-indigo-600 text-indigo-600":"border-transparent text-slate-400 hover:text-slate-600"}`}>
                            {t==="nulls"?"Null Analysis":t==="distribution"?"Distribution":t==="comparison"?"Num Compare":t==="categorical"?"Cat Frequency":"Composition"}
                          </button>
                        ))}
                      </div>
                      {(visualTab==="distribution"||visualTab==="comparison") && numericCols.length>0 && (
                        <select value={selectedNumCol} onChange={e=>setSelectedNumCol(e.target.value)} className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 outline-none cursor-pointer ml-2 shrink-0">
                          {numericCols.map(c=>(<option key={c} value={c}>{c}</option>))}
                        </select>
                      )}
                      {visualTab==="categorical" && catCols.length>0 && (
                        <select value={selectedCatCol} onChange={e=>setSelectedCatCol(e.target.value)} className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 outline-none cursor-pointer ml-2 shrink-0">
                          {catCols.map(c=>(<option key={c} value={c}>{c}</option>))}
                        </select>
                      )}
                    </div>

                    <div className="p-5 flex-1 min-h-0">
                      {/* 1) NULL ANALYSIS BAR CHART */}
                      {visualTab==="nulls" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={missingChartData} margin={{top:20,right:10,left:-20,bottom:0}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                            <XAxis dataKey="name" stroke="#64748b" style={{fontSize:"10px",fontFamily:"sans-serif",fontWeight:500}}/>
                            <YAxis stroke="#64748b" style={{fontSize:"10px",fontFamily:"sans-serif",fontWeight:500}} unit="%"/>
                            <Tooltip content={({active,payload})=>{
                              if(active&&payload?.length){
                                const d=payload[0].payload;
                                return(
                                  <div className="bg-slate-900/95 text-white p-3 rounded-xl border border-slate-800 shadow-xl text-xs space-y-1.5 backdrop-blur-md">
                                    <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{d.name}</p>
                                    <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full ${d["Missing %"] > 30 ? "bg-rose-500 animate-pulse" : "bg-indigo-500"}`} />
                                      <span className="text-slate-400">Missing Rate:</span>
                                      <span className="font-mono font-bold text-slate-100">{payload[0].value}%</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400">
                                      Total Nulls: <span className="font-mono text-slate-200">{d["Missing Count"]} rows</span>
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}/>
                            <ReferenceLine y={30} stroke="#f43f5e" strokeDasharray="5 5" strokeWidth={1.5}>
                              <Label value="Warning Threshold (30%)" fill="#f43f5e" position="top" style={{fontSize:"9px",fontWeight:700,letterSpacing:"0.5px"}}/>
                            </ReferenceLine>
                            <Bar dataKey="Missing %" fill="#6366f1" radius={[6,6,0,0]} barSize={32}>
                              {missingChartData.map((e,i)=>(
                                <Cell key={i} fill={e["Missing %"]>30?"url(#nullRedGradient)":"url(#nullIndigoGradient)"}/>
                              ))}
                            </Bar>
                            <defs>
                              <linearGradient id="nullIndigoGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#818cf8"/>
                                <stop offset="100%" stopColor="#4f46e5"/>
                              </linearGradient>
                              <linearGradient id="nullRedGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fda4af"/>
                                <stop offset="100%" stopColor="#f43f5e"/>
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      )}

                      {/* 2) NUMERIC DISTRIBUTION AREA CHART */}
                      {visualTab==="distribution" && (
                        numericCols.length===0
                          ? <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No numeric columns.</div>
                          : <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={distributionChartData} margin={{top:20,right:10,left:-20,bottom:0}}>
                                <defs>
                                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                                <XAxis dataKey="index" stroke="#64748b" style={{fontSize:"10px",fontFamily:"monospace"}} tickFormatter={(tick)=>`R${tick}`}/>
                                <YAxis stroke="#64748b" style={{fontSize:"10px",fontFamily:"monospace"}}/>
                                <Tooltip content={({active,payload})=>{
                                  if(active&&payload?.length) {
                                    const val = payload[0].value;
                                    const diff = meanVal !== null ? (val - meanVal).toFixed(2) : null;
                                    const pctDiff = meanVal !== null && meanVal !== 0 ? (((val - meanVal) / meanVal) * 100).toFixed(1) : null;
                                    return (
                                      <div className="bg-slate-900/95 text-white p-3 rounded-xl border border-slate-800 shadow-xl text-xs space-y-1.5 backdrop-blur-md">
                                        <p className="font-mono text-slate-400 border-b border-slate-800 pb-1">Data Row: {payload[0].payload.index}</p>
                                        <p className="font-bold text-slate-200">Value: <span className="text-indigo-400 font-mono font-black">{val}</span></p>
                                        {meanVal !== null && (
                                          <p className="text-[10px] text-slate-400">
                                            Dev from Mean: <span className={`font-mono font-bold ${diff >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                              {diff >= 0 ? `+${diff}` : diff} ({pctDiff}%)
                                            </span>
                                          </p>
                                        )}
                                      </div>
                                    );
                                  }
                                  return null;
                                }}/>
                                {meanVal !== null && (
                                  <ReferenceLine y={meanVal} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5}>
                                    <Label value={`Mean: ${meanVal.toFixed(2)}`} fill="#ef4444" position="insideTopLeft" style={{fontSize:"9px",fontWeight:700,letterSpacing:"0.5px"}}/>
                                  </ReferenceLine>
                                )}
                                {medianVal !== null && (
                                  <ReferenceLine y={medianVal} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1.5}>
                                    <Label value={`Median: ${medianVal.toFixed(2)}`} fill="#f59e0b" position="insideBottomRight" style={{fontSize:"9px",fontWeight:700,letterSpacing:"0.5px"}}/>
                                  </ReferenceLine>
                                )}
                                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" name={selectedNumCol} activeDot={{ r: 6, strokeWidth: 0 }}/>
                              </AreaChart>
                            </ResponsiveContainer>
                      )}

                      {/* 3) NUMERIC COMPARISON - Mean/Median/Std grouped bar */}
                      {visualTab==="comparison" && (
                        numCompareData.length===0
                          ? <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No numeric columns.</div>
                          : <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={numCompareData} margin={{top:20,right:10,left:-10,bottom:0}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                                <XAxis dataKey="name" stroke="#64748b" style={{fontSize:"10px",fontWeight:600}}/>
                                <YAxis stroke="#64748b" style={{fontSize:"10px",fontFamily:"monospace"}}/>
                                <Tooltip content={({active,payload})=>{
                                  if(active&&payload?.length) {
                                    return (
                                      <div className="bg-slate-900/95 text-white p-3 rounded-xl border border-slate-800 shadow-xl text-xs space-y-1.5 backdrop-blur-md">
                                        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{payload[0].payload.name}</p>
                                        {payload.map((entry, idx) => (
                                          <div key={idx} className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-1.5">
                                              <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: entry.fill}}/>
                                              <span className="text-slate-400">{entry.name}:</span>
                                            </div>
                                            <span className="font-mono font-bold text-slate-100">{entry.value}</span>
                                          </div>
                                        ))}
                                      </div>
                                    );
                                  }
                                  return null;
                                }}/>
                                <Legend 
                                  verticalAlign="top" 
                                  height={36} 
                                  iconType="circle"
                                  iconSize={8}
                                  wrapperStyle={{fontSize:"11px",fontWeight:600,color:"#334155"}}
                                />
                                <Bar dataKey="Mean" fill="#6366f1" radius={[4,4,0,0]} barSize={16}/>
                                <Bar dataKey="Median" fill="#10b981" radius={[4,4,0,0]} barSize={16}/>
                                <Bar dataKey="StdDev" fill="#ec4899" radius={[4,4,0,0]} barSize={16}/>
                              </BarChart>
                            </ResponsiveContainer>
                      )}

                      {/* 4) CATEGORICAL FREQUENCY - horizontal bar */}
                      {visualTab==="categorical" && (
                        catCols.length===0
                          ? <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No categorical columns.</div>
                          : <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={catFreqData} layout="vertical" margin={{top:5,right:20,left:10,bottom:5}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false}/>
                                <XAxis type="number" stroke="#64748b" style={{fontSize:"10px",fontFamily:"monospace"}}/>
                                <YAxis dataKey="name" type="category" width={80} stroke="#64748b" style={{fontSize:"10px",fontWeight:500}}/>
                                <Tooltip content={({active,payload})=>{
                                  if(active&&payload?.length) {
                                    const total = analysisResult?.data?.length || 1;
                                    const count = payload[0].value;
                                    const pct = ((count / total) * 100).toFixed(1);
                                    return (
                                      <div className="bg-slate-900/95 text-white p-3 rounded-xl border border-slate-800 shadow-xl text-xs space-y-1.5 backdrop-blur-md">
                                        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{payload[0].payload.name}</p>
                                        <div className="flex items-center justify-between gap-4">
                                          <span className="text-slate-400">Frequency Count:</span>
                                          <span className="font-mono font-bold text-indigo-400">{count}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                          <span className="text-slate-400">Dataset Share:</span>
                                          <span className="font-mono font-bold text-emerald-400">{pct}%</span>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}/>
                                <Bar dataKey="count" fill="#8b5cf6" radius={[0,6,6,0]} barSize={18}>
                                  {catFreqData.map((_,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]}/>))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                      )}

                      {/* 5) DATA COMPOSITION PIE CHART */}
                      {visualTab==="composition" && (
                        compositionData.length===0
                          ? <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No data.</div>
                          : <div className="relative w-full h-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie 
                                    data={compositionData} 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={65} 
                                    outerRadius={95} 
                                    paddingAngle={4} 
                                    dataKey="value" 
                                    label={({name,value})=>`${name} (${value})`} 
                                    style={{fontSize:"10px",fontWeight:700,fill:"#334155"}}
                                  >
                                    {compositionData.map((_,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]}/>))}
                                  </Pie>
                                  <Tooltip content={({active,payload})=>{
                                    if(active&&payload?.length) {
                                      const data = payload[0].payload;
                                      const total = compositionData.reduce((acc,curr)=>acc+curr.value,0);
                                      const pct = ((data.value / total) * 100).toFixed(1);
                                      return (
                                        <div className="bg-slate-900/95 text-white p-3 rounded-xl border border-slate-800 shadow-xl text-xs space-y-1.5 backdrop-blur-md">
                                          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 uppercase">{data.name} Fields</p>
                                          <div className="flex justify-between gap-4">
                                            <span className="text-slate-400">Count:</span>
                                            <span className="font-mono font-bold text-indigo-400">{data.value}</span>
                                          </div>
                                          <div className="flex justify-between gap-4">
                                            <span className="text-slate-400">Proportion:</span>
                                            <span className="font-mono font-bold text-emerald-400">{pct}%</span>
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}/>
                                  <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{fontSize:"11px",fontWeight:600}}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{transform:"translateY(-12px)"}}>
                                <span className="text-2xl font-black text-slate-900 leading-none">
                                  {compositionData.reduce((acc, curr) => acc + curr.value, 0)}
                                </span>
                                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 mt-1">
                                  Total Fields
                                </span>
                              </div>
                            </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Background Mockup Grid Preview */}
          {!analysisResult && (
            <div className='w-full mt-12 grid grid-cols-3 gap-6 opacity-30 pointer-events-none'>
              <div className='h-28 rounded-2xl border border-slate-200/80 bg-white/60 p-4 space-y-2.5'>
                <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-semibold text-indigo-600 border border-indigo-100' />
                <div className='w-12 h-2.5 bg-slate-200 rounded' />
                <div className='w-20 h-2 bg-slate-150 rounded' />
              </div>
              <div className='h-28 rounded-2xl border border-slate-200/80 bg-white/60 p-4 space-y-2.5'>
                <div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-semibold text-blue-600 border border-blue-100' />
                <div className='w-12 h-2.5 bg-slate-200 rounded' />
                <div className='w-20 h-2 bg-slate-150 rounded' />
              </div>
              <div className='h-28 rounded-2xl border border-slate-200/80 bg-white/60 p-4 space-y-2.5'>
                <div className='w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-xs font-semibold text-emerald-600 border border-emerald-100' />
                <div className='w-12 h-2.5 bg-slate-200 rounded' />
                <div className='w-20 h-2 bg-slate-150 rounded' />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
