// This is a placeholder page. You would fetch report data and display multiple charts.
import Card from "../components/ui/Card";
import BarChart from "../components/charts/BarChart";

const Reports = () => {
  const monthlyTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Monthly Spending",
        data: [6500, 5900, 8000, 8100],
        backgroundColor: "rgba(79, 70, 229, 0.8)",
      },
    ],
  };

  return (
    <Card>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="h-96">
        <BarChart chartData={monthlyTrendData} title="Monthly Spending Trend" />
      </div>
      {/* You can add more charts here */}
    </Card>
  );
};
export default Reports;
