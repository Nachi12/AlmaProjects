// chartcomponent.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

/**
 * ChartPanel
 * - Expects `cryptos` in redux (array of { id, name, market_cap }).
 *   If you don't have a redux store, replace the useSelector call with a prop.
 */
const CharComponent = () => {
  const { cryptos = [], baseCurrency } = useSelector((s) => s.crypto || {});
  // UI state
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [chartType, setChartType] = useState("line"); // "line" or "bar"
  const [timeRange, setTimeRange] = useState("30"); // days (string/int) or "" when custom date selected
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const currency = baseCurrency || "usd";

  // color palette (keeps consistent order)
  const COLOR_PALETTE = [
    "rgba(16, 91, 246, 1)", // blue
    "rgba(235, 88, 88, 1)", // red
    "rgba(88, 196, 180, 1)", // teal
    "rgba(255, 159, 64, 1)", // orange
    "rgba(153, 102, 255, 1)", // purple
    "rgba(255, 206, 86, 1)", // yellow
  ];

  const timeRangeMap = {
    "1D": 1,
    "1W": 7,
    "1M": 30,
    "6M": 180,
    "1Y": 365,
  };

  // helper: add / remove selected cryptos - FIXED
  const addCrypto = (id) => {
    if (!id) return;
    console.log("Adding crypto:", id); // Debug log
    setSelectedCryptos((prev) => {
      if (prev.includes(id)) {
        console.log("Crypto already selected:", id);
        return prev;
      }
      console.log("New selected cryptos:", [...prev, id]);
      return [...prev, id];
    });
  };
  
  const removeCrypto = (id) => {
    console.log("Removing crypto:", id); // Debug log
    setSelectedCryptos((prev) => prev.filter((x) => x !== id));
  };

  // Build API URL for coin
  const buildUrl = (id) => {
    // If custom date range provided, use /market_chart/range
    if (dateRange.start && dateRange.end) {
      const from = Math.floor(new Date(dateRange.start).getTime() / 1000);
      const to = Math.floor(new Date(dateRange.end).getTime() / 1000);
      return `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=${currency}&from=${from}&to=${to}`;
    }
    // otherwise use days param
    return `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${timeRange || 30}`;
  };

  // Fetch & align datasets when selectedCryptos/timeRange/dateRange/currency/cryptos change
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    console.log("useEffect triggered. Selected cryptos:", selectedCryptos); // Debug log
    let cancelled = false;
    const fetchAll = async () => {
      if (!selectedCryptos.length) {
        setChartData(null);
        return;
      }
      setLoading(true);

      try {
        // Fetch each coin's market_caps (timestamp, cap) series
        const responses = await Promise.all(
          selectedCryptos.map(async (id) => {
            try {
              const url = buildUrl(id);
              console.log("Fetching URL for", id, ":", url); // Debug log
              const res = await fetch(url);
              if (!res.ok) {
                console.warn("fetch failed for", id, res.status);
                return null;
              }
              const json = await res.json();
              // some endpoints return 'market_caps' array as expected
              if (!json || !Array.isArray(json.market_caps)) {
                console.warn("Invalid data structure for", id, json);
                return null;
              }

              // Filter and map to { ts, value }
              const points = json.market_caps
                .filter((it) => Array.isArray(it) && it.length >= 2 && it[1] != null)
                .map((it) => ({ ts: it[0], v: it[1] }));

              console.log("Points fetched for", id, ":", points.length); // Debug log
              return { id, points };
            } catch (err) {
              console.error("error fetching", id, err);
              return null;
            }
          })
        );

        if (cancelled) return;

        const valid = responses.filter(Boolean);
        console.log("Valid responses:", valid.length, "out of", responses.length); // Debug log
        
        if (valid.length === 0) {
          setChartData(null);
          setLoading(false);
          return;
        }

        // Build a unified sorted set of timestamps (union)
        const tsSet = new Set();
        valid.forEach((r) => r.points.forEach((p) => tsSet.add(p.ts)));
        const allTimestamps = Array.from(tsSet).sort((a, b) => a - b);

        // Align each dataset to the unified timestamps by nearest neighbor (within threshold).
        const THRESHOLD = 3 * 60 * 60 * 1000; // 3 hours
        const datasets = valid.map((r, idx) => {
          const mapTsToVal = new Map(r.points.map((p) => [p.ts, p.v]));
          const datasetData = allTimestamps.map((ts) => {
            // exact match
            if (mapTsToVal.has(ts)) return mapTsToVal.get(ts);
            // nearest neighbor
            let closest = null;
            let minDiff = Infinity;
            for (const p of r.points) {
              const d = Math.abs(p.ts - ts);
              if (d < minDiff) {
                minDiff = d;
                closest = p.v;
              }
            }
            if (minDiff <= THRESHOLD) return closest;
            return null; // gap -> null (Chart.js will leave gap unless spanGaps true)
          });

          const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
          const cryptoName = cryptos.find((c) => c.id === r.id)?.name || r.id;
          console.log("Creating dataset for", r.id, "with name:", cryptoName); // Debug log
          
          return {
            label: cryptoName,
            data: datasetData,
            borderColor: color,
            backgroundColor: color.replace(", 1)", ", 0.12)"),
            pointRadius: 0,
            pointHoverRadius: 6,
            tension: 0.18,
            borderWidth: 2,
            spanGaps: true,
          };
        });

        // Format labels as localized dates for x axis
        const labels = allTimestamps.map((ts) => {
          const d = new Date(ts);
          // Use short month/day for readability
          return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        });

        console.log("Final datasets:", datasets.map(d => ({ label: d.label, dataLength: d.data.length }))); // Debug log
        setChartData({ labels, datasets, rawTimestamps: allTimestamps });
      } catch (err) {
        console.error("fetchAll error", err);
        setChartData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCryptos, timeRange, dateRange.start, dateRange.end, currency, cryptos.length]);


// Chart options (line & bar share many options)
const chartOptions = useMemo(() => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      // we hide the built-in legend because we'll render a custom legend to the top-right (like your images)
      legend: { display: false },
      // Add this to disable data labels on the chart
      datalabels: {
        display: false
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (ctx) {
            const val = ctx.parsed.y;
            if (val === null || val === undefined) return `${ctx.dataset.label}: —`;
            return `${ctx.dataset.label}: ${new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currency.toUpperCase(),
              maximumFractionDigits: 2,
              notation: "compact",
            }).format(val)}`;
          },
        },
      },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { display: true, color: "rgba(0,0,0,0.04)" },
        ticks: { color: "#475569", maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
      },
      y: {
        grid: { display: true, color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#475569",
          callback: (val) =>
            new Intl.NumberFormat("en-US", {
              notation: "compact",
              maximumFractionDigits: 1,
              style: "currency",
              currency: currency.toUpperCase(),
            }).format(Number(val)),
        },
      },
    },
    elements: {
      point: { radius: 0 }, // hides dots
      line: { borderWidth: 2 },
      bar: { borderWidth: 1 },
    },
    // make lines visually smooth and connect small gaps
    spanGaps: true,
  };

  // Add bar-specific configuration for less congested bars
  if (chartType === "bar") {
    return {
      ...baseOptions,
      scales: {
        ...baseOptions.scales,
        x: {
          ...baseOptions.scales.x,
          categoryPercentage: 0.6,  // Controls spacing between groups of bars (0.6 = more spacing)
          barPercentage: 0.8,       // Controls width of individual bars (0.8 = slightly thinner)
        },
      },
    };
  }

  return baseOptions;
}, [currency, chartType]);



  // small helper to render our legend resembling your design (colored circle + label)
  const LegendBlock = ({ datasets = [] }) => {
    if (!datasets || !datasets.length) return null;
    return (
      <div className="flex items-center gap-4">
        {datasets.map((ds, idx) => (
          <div key={`${ds.label}-${idx}`} className="flex items-center gap-2 text-sm text-gray-700">
            <span
              aria-hidden
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: ds.borderColor }}
            />
            <span>{ds.label}</span>
          </div>
        ))}
      </div>
    );
  };

  // FIXED: Handle dropdown selection properly
  const handleCryptoSelection = (e) => {
    const selectedValue = e.target.value;
    console.log("Dropdown selection changed to:", selectedValue); // Debug log
    if (selectedValue && selectedValue !== "") {
      addCrypto(selectedValue);
    }
    // Reset dropdown to show placeholder
    e.target.value = "";
  };

  return (
    <div className="bg-white  rounded-xl p-5 shadow-md border-2  border-gray-200 lg:max-w-6xl lg:mx-content sm:max-w-3xl sm:mx-content">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center sm:items-start   gap-4 justify-between  flex-wrap" id="sub-container">
        {/* Left: Time range */}
        <div className="flex items-center gap-3 ">
          {Object.keys(timeRangeMap).map((k) => {
            const days = timeRangeMap[k];
            return (
              <button
                key={k}
                onClick={() => {
                  setTimeRange(days.toString());
                  setDateRange({ start: "", end: "" });
                }}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-shadow ${
                  String(timeRange) === String(days) && !dateRange.start
                    ? "bg-blue-50  text-blue-700 ring-2 ring-blue-100"
                    : "bg-white border hover:bg-blue-100 border-gray-100 text-gray-700"
                }`}
              >
                {k}
              </button>
            );
          })}

          {/* custom date button (shows calendar inputs) */}
          <div className="flex items-center gap-2 ml-2 bg-white border sm:flex-wrap border-gray-100 rounded-xl p-2">
            <input
              type="date"
              className="text-sm px-2 py-1 border border-transparent rounded-md focus:outline-none hover:bg-blue-100 "
              value={dateRange.start}
              onChange={(e) => {
                setDateRange((p) => ({ ...p, start: e.target.value }));
                setTimeRange("");
              }}
            />
            <span className="text-sm text-gray-400 ">—</span>
            <input
              type="date"
              className="text-sm px-2 py-1 border border-transparent rounded-md focus:outline-none hover:bg-blue-100"
              value={dateRange.end}
              onChange={(e) => {
                setDateRange((p) => ({ ...p, end: e.target.value }));
                setTimeRange("");
              }}
            />
          </div>
        </div>

        {/* Right: Crypto selector & Chart type */}
        <div className="flex items-center gap-3">
          {/* FIXED: Multi-select dropdown */}
          <div className="relative">
            <select
              onChange={handleCryptoSelection}
              value="" // Always keep it empty to show placeholder
              className="px-4 py-2 rounded-xl border-1 border-gray-100 bg-white text-sm hover:bg-blue-100 selected:border-0"
            >
              <option value="" disabled>
                Add cryptocurrency
              </option>
              {cryptos
                .filter((c) => !selectedCryptos.includes(c.id))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Chart type selector */}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-100 bg-white text-sm hover:bg-blue-100"
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
          </select>
        </div>
      </div>

      {/* Selected chips and legend row */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {selectedCryptos.map((id) => {
            const meta = cryptos.find((c) => c.id === id) || { name: id };
            return (
              <div
                key={id}
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full text-sm"
              >
                <span>{meta.name}</span>
                <button
                  onClick={() => removeCrypto(id)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label={`Remove ${meta.name}`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom legend (top-right like your example) */}
        <div className="hidden sm:flex items-center">
          <LegendBlock datasets={chartData?.datasets || []} />
        </div>
      </div>

      {/* Chart area */}
      <div className="mt-4 h-96 bg-white border border-gray-50 rounded-lg p-4">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : !chartData || !chartData.datasets.length ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
            <div className="text-3xl mb-2">📉</div>
            <div>Select at least one cryptocurrency to see the chart</div>
          </div>
        ) : chartType === "line" ? (
          <Line data={{ labels: chartData.labels, datasets: chartData.datasets }} options={chartOptions} />
        ) : (
          // for bar chart we want grouped bars (datasets as is)
          <Bar data={{ labels: chartData.labels, datasets: chartData.datasets }} options={chartOptions} />
        )}
      </div>

      {/* Mobile legend under chart for smaller screens */}
      <div className="mt-3 sm:hidden">
        <LegendBlock datasets={chartData?.datasets || []} />
      </div>
    </div>
  );
};

export default CharComponent;
