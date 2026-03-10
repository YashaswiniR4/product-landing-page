/**
 * SmartX Dashboard Logic - Buy/Sell Tracker
 * Following the requested flow: Add -> Validate -> Store -> Re-render -> Edit/Delete -> Update
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State from LocalStorage
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // UI Elements
    const transactionForm = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const totalBalanceEl = document.getElementById('total-balance');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpenseEl = document.getElementById('total-expense');
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');

    // 2. Validate and Add Transaction
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('item-name').value;
        const type = document.getElementById('transaction-type').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const date = document.getElementById('date').value;

        // Validation
        if (!name || isNaN(amount) || !date) {
            alert('Please fill in all fields correctly.');
            return;
        }

        const transaction = {
            id: Date.now(),
            name,
            type, // 'buy' (expense) or 'sell' (income)
            amount,
            date
        };

        // 3. Store Data in LocalStorage
        transactions.push(transaction);
        saveTransactions();

        // 4. Re-render UI
        updateUI();
        transactionForm.reset();

        // Success feedback
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.innerHTML = 'Transaction Added! ✅';
        setTimeout(() => {
            submitBtn.innerHTML = 'Record Transaction';
        }, 2000);
    });

    // 5. Update UI (Re-render List and Totals)
    function updateUI() {
        // Re-render Transaction List
        if (transactions.length === 0) {
            transactionList.innerHTML = '<p style="text-align: center; color: var(--text-muted); margin-top: 2rem;">No transactions recorded yet.</p>';
        } else {
            // Sort by date descending
            const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

            transactionList.innerHTML = sortedTransactions.map(t => `
                <div class="transaction-item glass">
                    <div class="transaction-info">
                        <h4>${t.name}</h4>
                        <p>${formatDate(t.date)} • ${t.type === 'buy' ? 'Purchase' : 'Sale'}</p>
                    </div>
                    <div class="transaction-amount">
                        <span class="${t.type === 'buy' ? 'amount-buy' : 'amount-sell'}">
                            ${t.type === 'buy' ? '-' : '+'}$${t.amount.toFixed(2)}
                        </span>
                        <div class="action-btns">
                            <button class="action-btn edit-btn" onclick="openEditModal(${t.id})">
                                <i data-lucide="edit-3"></i>
                            </button>
                            <button class="action-btn delete delete-btn" onclick="deleteTransaction(${t.id})">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            if (window.lucide) lucide.createIcons();
        }

        // Calculate Totals
        const { income, expense } = transactions.reduce((acc, t) => {
            if (t.type === 'sell') acc.income += t.amount;
            else acc.expense += t.amount;
            return acc;
        }, { income: 0, expense: 0 });

        totalIncomeEl.innerText = `$${income.toFixed(2)}`;
        totalExpenseEl.innerText = `$${expense.toFixed(2)}`;
        totalBalanceEl.innerText = `$${(income - expense).toFixed(2)}`;

        // Color balance
        totalBalanceEl.style.color = (income - expense) >= 0 ? 'var(--success)' : 'var(--accent)';
    }

    // Helper functions
    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    }

    function saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // 6. Global Switchers for Edit/Delete (attached to window for inline onclick)
    window.deleteTransaction = (id) => {
        if (confirm('Delete this transaction?')) {
            transactions = transactions.filter(t => t.id !== id);
            saveTransactions();
            updateUI();
        }
    };

    window.openEditModal = (id) => {
        const t = transactions.find(item => item.id === id);
        if (!t) return;

        document.getElementById('edit-id').value = t.id;
        document.getElementById('edit-name').value = t.name;
        document.getElementById('edit-amount').value = t.amount;

        editModal.classList.add('active');
    };

    // Update Transaction
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('edit-id').value);
        const name = document.getElementById('edit-name').value;
        const amount = parseFloat(document.getElementById('edit-amount').value);

        const index = transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            transactions[index].name = name;
            transactions[index].amount = amount;
            saveTransactions();
            updateUI();
            closeEditModal();
        }
    });

    const closeEditModal = () => {
        editModal.classList.remove('active');
    };

    document.getElementById('close-edit').addEventListener('click', closeEditModal);
    window.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });

    // Initial Load
    updateUI();
});
