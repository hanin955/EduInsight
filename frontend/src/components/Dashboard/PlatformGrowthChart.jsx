import { Line } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);
export default function PlatformGrowthChart({ data }) {
    const chartData = {
        labels: data.map((item) => item.month),
        datasets: [{
            label: 'Users',
            data: data.map((item) => item.count),
            borderColor: '#318CE7',
            backgroundColor: 'rgba(49, 140, 231, 0.1)',
            tension: 0.3,
            pointBackgroundColor: '#318CE7'
        }]
    };
    return (
        <div style={{ height: '260px' }}>
            <Line
                data={chartData}
                options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', align: 'end' } }
                }}
            />
        </div>
    );
}