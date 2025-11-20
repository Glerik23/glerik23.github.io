export class TableManager {
    constructor(tableId, options = {}) {
        this.table = document.getElementById(tableId);
        if (!this.table) return;

        this.tbody = this.table.querySelector('tbody');
        this.headers = this.table.querySelectorAll('thead th');
        this.rows = Array.from(this.tbody.querySelectorAll('tr'));
        this.sortDirection = 1; // 1 for asc, -1 for desc
        this.lastSortedColumn = -1;

        this.initHeaders();

        if (options.defaultSortColumn !== undefined) {
            let direction = 1;
            if (options.defaultSortDirection === 'desc') {
                direction = -1;
            }
            this.sort(options.defaultSortColumn, direction);
        }
    }

    initHeaders() {
        this.headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => this.sort(index));

            // Add sort icon placeholder
            const icon = document.createElement('span');
            icon.className = 'sort-icon';
            icon.style.marginLeft = '5px';
            header.appendChild(icon);
        });
    }

    sort(columnIndex, forceDirection = null) {
        // Toggle direction if clicking the same column, otherwise default to desc for numbers, asc for text
        if (forceDirection !== null) {
            this.sortDirection = forceDirection;
            this.lastSortedColumn = columnIndex;
        } else if (this.lastSortedColumn === columnIndex) {
            this.sortDirection *= -1;
        } else {
            this.sortDirection = 1;
            this.lastSortedColumn = columnIndex;
        }

        // Update icons
        this.headers.forEach((h, i) => {
            const icon = h.querySelector('.sort-icon');
            icon.textContent = '';
            if (i === columnIndex) {
                icon.textContent = this.sortDirection === 1 ? ' ▲' : ' ▼';
            }
        });

        this.rows.sort((a, b) => {
            const cellA = a.children[columnIndex].textContent.trim();
            const cellB = b.children[columnIndex].textContent.trim();

            // Try to parse as number (remove spaces and commas first)
            const numA = parseFloat(cellA.replace(/[,\s]/g, ''));
            const numB = parseFloat(cellB.replace(/[,\s]/g, ''));

            if (!isNaN(numA) && !isNaN(numB)) {
                return (numA - numB) * this.sortDirection;
            }

            return cellA.localeCompare(cellB) * this.sortDirection;
        });

        // Re-append rows
        this.rows.forEach(row => this.tbody.appendChild(row));
    }
}
