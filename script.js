// --- Create Title Bar ---
const titleBar = document.createElement('div');
titleBar.id = 'titleBar';
document.body.appendChild(titleBar);

// Hamburger icon
const menuIcon = document.createElement('div');
menuIcon.id = 'menuIcon';
menuIcon.innerHTML = '&#9776;';
titleBar.appendChild(menuIcon);

// Title text
const titleText = document.createElement('div');
titleText.id = 'titleText';
titleText.textContent = 'Test App';
titleBar.appendChild(titleText);

// Hamburger click event
menuIcon.addEventListener('click', () => {
    alert('Hamburger menu clicked!');
});

// --- Grid Container ---
const container = document.createElement('div');
container.className = 'grid-container';
document.body.appendChild(container);

const grid = document.createElement('div');
grid.id = 'excelGrid';
grid.className = 'excel-grid';
container.appendChild(grid);

// --- Headers ---
const headers = [
    '01/06', '01/13', '01/20', '01/27', 'January',
    '02/03', '02/10', '02/17', '02/24', 'February',
    '03/03', '03/10', '03/17', '03/24', '03/31', 'March',
    '04/07', '04/14', '04/21', '04/28', 'April',
    '05/05', '05/12', '05/19', '05/26', 'May',
    '06/02', '06/09', '06/16', '06/23', '06/30', 'June',
    '07/07', '07/14', '07/21', '07/28', 'July',
    '08/04', '08/11', '08/18', '08/25', 'August',
    '09/01', '09/08', '09/15', '09/22', '09/29', 'September',
    '10/06', '10/13', '10/20', '10/27', 'October',
    '11/03', '11/10', '11/17', '11/24', 'November'
];

// Sections
const sections = ['Safety', 'Quality', 'Delivery'];
const numRows = 25;

// Track collapsed sections
let collapsedSections = {
    Safety: false,
    Quality: true,
    Delivery: true
};

// Collapsible month columns
const collapsibleColumns = [
    { name: 'January', collapseRange: [0, 3] },
    { name: 'February', collapseRange: [5, 8] },
    { name: 'March', collapseRange: [10, 14] },
    { name: 'April', collapseRange: [16, 19] },
    { name: 'May', collapseRange: [21, 24] },
    { name: 'June', collapseRange: [26, 30] },
    { name: 'July', collapseRange: [32, 35] },
    { name: 'August', collapseRange: [37, 40] },
    { name: 'September', collapseRange: [42, 46] },
    { name: 'October', collapseRange: [48, 51] },
    { name: 'November', collapseRange: [53, 56] }
];

// Track collapsed state for months (all except last collapsed)
const totalCollapsedMap = {};
collapsibleColumns.forEach((col, idx) => {
    totalCollapsedMap[col.name] = idx !== collapsibleColumns.length - 1;
});

// Track all cells for each collapsible month
const collapsibleCellsMap = {};
collapsibleColumns.forEach(c => collapsibleCellsMap[c.name] = []);

// --- Create Header Row ---
headers.forEach((text, colIndex) => {
    const cell = document.createElement('div');
    cell.className = 'cell header';
    cell.textContent = text;
    grid.appendChild(cell);

    const collapsible = collapsibleColumns.find(c => c.name === text);
    if (collapsible) {
        cell.addEventListener('click', () => {
            totalCollapsedMap[text] = !totalCollapsedMap[text];
            applyColumnCollapse();
        });
    }
});

// --- Create Sections ---
function createSection(sectionName) {
    // Section header
    const sectionCell = document.createElement('div');
    sectionCell.className = 'cell section';
    sectionCell.textContent = sectionName;
    sectionCell.style.gridColumn = `span ${headers.length}`;
    grid.appendChild(sectionCell);

    // Section rows
    const sectionRows = [];
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < headers.length; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
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

    // Section toggle
    sectionCell.addEventListener('click', () => {
        Object.keys(collapsedSections).forEach(sec => {
            if (sec !== sectionName) collapsedSections[sec] = true;
        });
        collapsedSections[sectionName] = !collapsedSections[sectionName];
        applySectionCollapse();

        // Scroll to top when section is expanded
        if (!collapsedSections[sectionName]) {
            const container = document.querySelector('.grid-container');
            container.scrollTop = 0;
        }
    });

    return { sectionCell, sectionRows };
}

// --- Create all sections ---
const sectionRowsMap = {};
sections.forEach(sec => {
    sectionRowsMap[sec] = createSection(sec);
});

// --- Apply section collapse ---
function applySectionCollapse() {
    let stickyOffset = 40;
    sections.forEach(sec => {
        const { sectionCell, sectionRows } = sectionRowsMap[sec];
        if (!collapsedSections[sec]) {
            sectionCell.style.position = 'sticky';
            sectionCell.style.top = `${stickyOffset}px`;
            stickyOffset += 40;
        } else {
            sectionCell.style.position = '';
            sectionCell.style.top = '';
        }

        sectionRows.forEach(cell => {
            cell.style.display = collapsedSections[sec] ? 'none' : 'flex';
        });
    });
}

// --- Apply column collapse ---
function applyColumnCollapse() {
    const widths = headers.map((_, i) => {
        for (let c of collapsibleColumns) {
            if (i >= c.collapseRange[0] && i <= c.collapseRange[1] && totalCollapsedMap[c.name]) {
                return '0px'; // collapsed width
            }
        }
        return '120px'; // default width
    });
    grid.style.gridTemplateColumns = widths.join(' ');

   // Hide data cells and all header cells for collapsed columns
    collapsibleColumns.forEach(c => {
        const isCollapsed = totalCollapsedMap[c.name];

        // Hide data cells
        collapsibleCellsMap[c.name].forEach(cell => {
            cell.style.visibility = isCollapsed ? 'hidden' : 'visible';
        });

        // Hide all header cells in the collapse range
        for (let i = c.collapseRange[0]; i <= c.collapseRange[1]; i++) {
            const headerCell = grid.children[i]; // headers are at the start of the grid
            if (headerCell.classList.contains('header')) {
                headerCell.style.visibility = isCollapsed ? 'hidden' : 'visible';
            }
        }
    });
}



// --- Initial display ---
applySectionCollapse();
applyColumnCollapse();
