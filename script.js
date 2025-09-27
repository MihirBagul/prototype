const grid = document.getElementById('excelGrid');

// Headers (can extend in future)
const headers = [
    '09/01', '09/08', '09/15', '09/22', 'September',
    '09/29', '10/06', '10/13', '10/20', 'October',
    '11/03', '11/10', '11/17', '11/24', 'November'
];

// Sections
const sections = ['Safety', 'Quality', 'Delivery'];
const numRows = 15; // rows per section

// Track collapsed sections
let collapsedSections = {
    Safety: false,
    Quality: true,
    Delivery: true
};

// Define collapsible total columns dynamically
const collapsibleColumns = [
    { name: 'September', collapseRange: [0, 3] },
    { name: 'October', collapseRange: [5, 8] },
    { name: 'November', collapseRange: [10, 13]}
];

// Track collapsed state
const totalCollapsedMap = {};
collapsibleColumns.forEach(col => totalCollapsedMap[col.name] = false);

// Track all cells in each collapsible column
const collapsibleCellsMap = {};
collapsibleColumns.forEach(c => collapsibleCellsMap[c.name] = []);

// --- Create Header Row ---
headers.forEach((text, colIndex) => {
    const cell = document.createElement('div');
    cell.className = 'cell header';
    cell.textContent = text;

    // Check if this is a collapsible total column
    const collapsible = collapsibleColumns.find(c => c.name === text);
    if (collapsible) {
        cell.addEventListener('click', () => {
            // Toggle collapsed state
            totalCollapsedMap[text] = !totalCollapsedMap[text];

            // Update column widths dynamically
            const widths = headers.map((_, i) => {
                for (let c of collapsibleColumns) {
                    if (i >= c.collapseRange[0] && i <= c.collapseRange[1] && totalCollapsedMap[c.name]) {
                        return '0px';
                    }
                }
                return '120px'; // default width
            });
            grid.style.gridTemplateColumns = widths.join(' ');

            // Also hide/show corresponding cells
            collapsibleCellsMap[text].forEach(c => {
                c.style.display = totalCollapsedMap[text] ? 'none' : 'flex';
            });
        });
    }

    grid.appendChild(cell);
});

// --- Function to create a section ---
function createSection(sectionName) {
    // Section row (spanning all columns)
    const sectionCell = document.createElement('div');
    sectionCell.className = 'cell section';
    sectionCell.textContent = sectionName;
    sectionCell.style.gridColumn = `span ${headers.length}`;
    grid.appendChild(sectionCell);

    // Rows in this section
    const sectionRows = [];
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < headers.length; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            // Random value and background color
            const value = Math.floor(Math.random() * 101);
            cell.textContent = value;
            cell.style.backgroundColor = value > 60 ? 'lightgreen' : 'lightcoral';

            grid.appendChild(cell);
            sectionRows.push(cell);

            // Track collapsible cells
            const collapsible = collapsibleColumns.find(c => col >= c.collapseRange[0] && col <= c.collapseRange[1]);
            if (collapsible) {
                collapsibleCellsMap[collapsible.name].push(cell);
            }
        }
    }

    // Collapse/expand on section click
    sectionCell.addEventListener('click', () => {
        // Collapse all other sections
        Object.keys(collapsedSections).forEach(sec => {
            if (sec !== sectionName) collapsedSections[sec] = true;
        });

        // Toggle this section
        collapsedSections[sectionName] = !collapsedSections[sectionName];

        applySectionCollapse();
    });

    return { sectionCell, sectionRows };
}

// --- Create all sections ---
const sectionRowsMap = {};
sections.forEach(sec => {
    sectionRowsMap[sec] = createSection(sec);
});

// --- Apply collapse state and sticky headers ---
function applySectionCollapse() {
    let stickyOffset = 40; // header row height

    sections.forEach(sec => {
        const { sectionCell, sectionRows } = sectionRowsMap[sec];

        if (!collapsedSections[sec]) {
            sectionCell.style.position = 'sticky';
            sectionCell.style.top = `${stickyOffset}px`;
            stickyOffset += 40; // section row height
        } else {
            sectionCell.style.position = '';
            sectionCell.style.top = '';
        }

        // Show/hide rows
        sectionRows.forEach(cell => {
            cell.style.display = collapsedSections[sec] ? 'none' : 'flex';
        });
    });
}

// --- Initial display: Safety expanded ---
applySectionCollapse();
