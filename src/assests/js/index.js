const dateSelect = document.getElementById('date');

flatpickr("#date", {
    dateFormat: "Y/m/d",
    maxDate: "today"
});

const transactions = [];

function renderTransactions() {
    const tbody = document.getElementById('transactionsTable');
    tbody.innerHTML = '';
    transactions.forEach((tx, index) => {
        const color = tx.amount < 0 ? 'text-red-400' : 'text-green-300';
        const catColor = {
            Work: 'text-green-400',
            Food: 'text-red-400',
            Housing: 'text-red-400',
            Utilities: 'text-red-400',
            Transportation: 'text-yellow-400'
        }[tx.category] || 'text-gray-300';
        tbody.innerHTML += `
      <tr>
        <td class="py-2 px-4">${tx.date}</td>
        <td class="py-2 px-4">${tx.desc}</td>
        <td class="py-2 px-4 font-semibold ${color}">${tx.amount < 0 ? '-' : ''}$${Math.abs(tx.amount).toLocaleString()}</td>
        <td class="py-2 px-4 font-semibold ${catColor}">${tx.category}</td>
        <td class="py-2 px-4">
          <button class="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded" onclick="deleteTransaction(${index})">Delete</button>
        </td>
      </tr>
    `;
    });
}
renderTransactions();

// Add Transaction Form
const form = document.getElementById('transactionForm');
const cancelBtn = document.getElementById('cancelBtn');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = document.getElementById('desc').value.trim();
    const amount = Number(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = dateSelect.value;
    if (desc && amount && category && date) {
        transactions.unshift({ date, desc, amount, category });
        renderTransactions();
        updateExpensesChart(chart, transactions);
        form.reset();
    } else {
        alert('Please fill in all fields');
    }
});
cancelBtn.addEventListener('click', () => form.reset());

const ctx = document.getElementById('expensesChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Expenses',
            data: [],
            borderColor: '#f87171',
            backgroundColor: 'rgba(248,113,113,0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: '#a1a1aa' }, grid: { color: '#27272a' } },
            y: { ticks: { color: '#a1a1aa' }, grid: { color: '#27272a' } }
        },
        responsive: true,
        interaction: {
            intersect: false
        }
    }
});

function updateExpensesChart(chart, transactions) {
    console.log('Updating chart data...');
    const expenseMap = {};
    transactions.forEach(tx => {
        if (tx.amount < 0) {
            expenseMap[tx.date] = (expenseMap[tx.date] || 0) + Math.abs(tx.amount);
        }
    });
    const labels = Object.keys(expenseMap).reverse();
    const data = Object.values(expenseMap).reverse();
    console.log('Chart data:', labels, data);
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

updateExpensesChart(chart, transactions);

function deleteTransaction(index) {
    transactions.splice(index, 1);
    renderTransactions();
    updateExpensesChart(chart, transactions);
}