import { Line } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);// active réellemnt categoryScale......
export default function GradeHistoryChart({ data }) {
    const chartData = {
        labels: data.map((item) => item.weekName),
        datasets: [{
            label: 'Score %',
            data: data.map((item) => item.quizScoreAverage),
            borderColor: '#318CE7',
            backgroundColor: 'rgba(49, 140, 231, 0.1)',
            fill: true,
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
                    scales: { y: { min: 0, max: 100 } },
                    plugins: { legend: { position: 'top', align: 'end' } }
                }}
            />
        </div>
    );
}