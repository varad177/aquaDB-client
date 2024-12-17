import React, { useEffect, useState, useRef } from "react";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ScatterChart,
    BarChart,
    Bar,
    Scatter,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF5733", "#33FF57"];

const FishCatchGraphs = ({ data , fileLoader , setfileLoader }) => {
    const [chartData, setChartData] = useState({
        byDate: [],
        bySpecies: [],
        bySea: [],
        byState: [],
        byDepth: [],
    });
    const graphContainerRef = useRef(null);

    useEffect(() => {
        const processData = () => {
            const byDate = data && data.map((record) => ({
                date: new Date(record.date).toLocaleDateString(),
                total_weight: record.total_weight,
            }));

            const bySpecies = [];
            data.forEach((record) => {
                record.species.forEach(({ name, catch_weight }) => {
                    bySpecies.push({ species: name, catch_weight });
                });
            });

            const bySea = Object.entries(
                data.reduce((acc, record) => {
                    acc[record.sea] = (acc[record.sea] || 0) + record.total_weight;
                    return acc;
                }, {})
            ).map(([sea, total_weight]) => ({ sea, total_weight }));

            const byState = data.reduce((acc, record) => {
                const stateData = acc.find((item) => item.state === record.state);
                if (stateData) {
                    stateData.total_weight += record.total_weight;
                } else {
                    acc.push({ state: record.state, total_weight: record.total_weight });
                }
                return acc;
            }, []);

            const byDepth = data &&  data.map((record) => ({
                depth: record.depth,
                total_weight: record.total_weight,
            }));

            return { byDate, bySpecies, bySea, byState, byDepth };
        };

        setChartData(processData());
    }, [data]);

    const handlePrint = () => {
        setfileLoader(true)
        const input = graphContainerRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const pdf = new jsPDF("portrait", "px", "a4");
            const imgData = canvas.toDataURL("image/png");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("FishCatchGraphs.pdf");
            setfileLoader(false)
        });
    };

    return (
        <div className="p-4 bg-white rounded-md">
            <div className="flex items-center justify-between p-4">
                <h1 className="text-2xl font-bold text-center mb-6">Fish Catch Data Visualization</h1>
                <div className="flex flex-col items-center justify-center gap-1 text-red-600 cursor-pointer hover:scale-110 duration-150 transition-all " onClick={handlePrint}>

                    <i className="text-red-600 text-2xl fa-solid fa-file-pdf"></i>
                    <p className="text-black font-bold text-center text-sm">DownLoad <br/>PDF</p>
                </div>
            </div>
            <div ref={graphContainerRef}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Catch Weight by Date */}
                    <div className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-xl font-semibold text-center mb-4">Catch Weight by Date</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            This graph shows the total weight of fish caught on different dates, allowing for analysis of trends over time.
                        </p>
                        <LineChart
                            width={450}
                            height={300}
                            data={chartData.byDate}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="total_weight" stroke="#82ca9d" />
                        </LineChart>
                    </div>

                    {/* Catch Weight by Species */}
                    <div className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-xl font-semibold text-center mb-4">Catch Weight by Species</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            This graph highlights the weight of fish caught for each species, enabling comparisons across different species.
                        </p>
                        <ScatterChart width={450} height={300}>
                            <CartesianGrid />
                            <XAxis type="category" dataKey="species" name="Species" />
                            <YAxis type="number" dataKey="catch_weight" name="Catch Weight" />
                            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                            <Scatter data={chartData.bySpecies} fill="#82ca9d" />
                        </ScatterChart>
                    </div>

                    {/* Catch Weight by Sea */}
                    <div className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-xl font-semibold text-center mb-4">Catch Weight by Sea</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            This pie chart visualizes the distribution of fish catch weights across different seas.
                        </p>
                        <PieChart width={400} height={400}>
                            <Pie
                                data={chartData.bySea}
                                dataKey="total_weight"
                                nameKey="sea"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                fill="#8884d8"
                                label={(entry) => `${entry.sea}: ${entry.total_weight}kg`}
                            >
                                {chartData.bySea.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>

                    {/* Catch Weight by State */}
                    <div className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-xl font-semibold text-center mb-4">Catch Weight by State</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            This bar chart provides insights into fish catch weights across different states.
                        </p>
                        <BarChart
                            width={450}
                            height={300}
                            data={chartData.byState}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="state" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total_weight" fill="#8884d8" />
                        </BarChart>
                    </div>

                    {/* Catch Weight by Depth */}
                    <div className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-xl font-semibold text-center mb-4">Catch Weight by Depth</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            This scatter plot visualizes the relationship between depth and the total weight of fish caught.
                        </p>
                        <ScatterChart width={450} height={250}>
                            <CartesianGrid />
                            <XAxis type="number" dataKey="depth" name="Depth" />
                            <YAxis type="number" dataKey="total_weight" name="Total Weight" />
                            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                            <Scatter data={chartData.byDepth} fill="#82ca9d" />
                        </ScatterChart>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FishCatchGraphs;
