import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);// dit a chartJs nous utilise seleument ArcElement Toolip legend
export default function CourseCompletionChart({ data }) {
    const order = ["Completed", "In Progress", "Not Started"];
    const sorted = order.map((status) => data.find((d) => d.status === status) || { status, count: 0 });
    return (
        <div style={{ height: '260px', display: 'flex', justifyContent: 'center' }}>
            <Pie
                data={{
                    labels: order,
                    datasets: [{
                        data: sorted.map((status) => status.count),
                        backgroundColor: ["#318CE7", "#93B8F0", "#E2E8F0"],
                        borderWidth: 0
                    }]
                }}
                options={{
                    maintainAspectRatio: false,//remplir espace de cadre
                }}
            />
        </div>
    );
}