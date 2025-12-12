
export interface CSVData {
    [key: string]: string;
}

export const xuatTepCSV = (data: CSVData[], fileName: string) => {
    if (data.length === 0) {
        console.warn("Không có dữ liệu để xuất.");
        return;
    }
  
    const headers = Object.keys(data[0]);

    
    let csvContent = headers.map(header => `"${header}"`).join(';') + '\n';

    data.forEach(item => {
        const row = headers.map(header => {
            let value = String(item[header] ?? '');
            
            
            value = value.replace(/"/g, '""'); 
            
            return `"${value}"`;
        }).join(';');
        
        csvContent += row + '\n';
    });
    
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const duongdan = URL.createObjectURL(blob);
    const lienket = document.createElement('a');
    
    lienket.href = duongdan;
    lienket.setAttribute('download', fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
    
    document.body.appendChild(lienket);
    lienket.click();
    
    
    document.body.removeChild(lienket);
    URL.revokeObjectURL(duongdan);
};
