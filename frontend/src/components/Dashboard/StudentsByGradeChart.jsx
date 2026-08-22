import { Bar } from 'react-chartjs-2';
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
export default function StudentsByGradeChart({ data }) {
    const chartData = {
        labels: data.map((item) => item.grade),
        datasets: [{
            label: 'Students',
            data: data.map((item) => item.count),
            backgroundColor: '#318CE7',
            borderRadius: 4
        }]
    };
    return (
        <div style={{ height: '260px' }}>
            <Bar
                data={chartData}
                options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }}
            />
        </div>
    );
}