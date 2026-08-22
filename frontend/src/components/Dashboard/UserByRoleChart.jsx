import { Doughnut } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
export default function UserByRoleChart({ data }) {
    const order = ["student", "teacher", "admin"];
    const sorted = order.map((role) => data.find((d) => d.role === role) || { role, count: 0 });
    return (
        <div style={{ height: '260px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut
                data={{
                    labels: ["Students", "Teachers", "Admins"],
                    datasets: [{
                        data: sorted.map((data) => data.count),
                        backgroundColor: ["#318CE7","#93B8F0","#D6E4F7" ],
                        borderWidth: 0
                    }]
                }}
                options={{
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: { legend: { position: 'top' } }
                }}
            />
        </div>
    );
}