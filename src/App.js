import React, {useState, useEffect} from 'react';
import * as XLSX from 'xlsx';
import './App.css'

const App = () => {
  const [excelData, setExcelData] = useState([])
  
  useEffect(() => {}, [excelData])

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            let json = XLSX.utils.sheet_to_json(worksheet);
            // Filtering for labor
            json = json.filter(row => {
              return row['Cost Code'] !== undefined && row['Cost Code'].trim().slice(-3) === '020'
            })
            console.log(json);
            json = json.map(row => {
                let qBudget = 0
                let hoursBudget = 0
                let laborSpeed = 0
                let uom = ''
                if(row['Cost Code'].length > 0) {
                    qBudget = row['Q Budget']
                    hoursBudget = row['Hours Budget']
                    laborSpeed = Math.round((qBudget / hoursBudget * 100) / 100)
                    uom = 'lf/hr'
                }
                return {
                  costCode: row['Cost Code'].trim(),
                  uom: uom,
                  quantityBudget: qBudget,
                  hoursBudget: hoursBudget,
                  laborSpeed: laborSpeed,
                  todaysQuantity: 0,
                  laborHoursInDay: 8,
                  crewSize: 1,
                  daysOfWork: 0
                }
            })
            setExcelData(json)


        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
  }

  const handleTodaysQuantity = (e) => {
    // [value, id, name] = e.target
    const value = parseInt(e.target.value)
    const id = e.target.id
    const name = e.target.name
    let newExcel =[]
    console.log('old excel ',excelData)
    if(typeof value === 'number') {
      newExcel = excelData.filter(row => {
        if(row.costCode === id) {
          row[name] = value
        }
        
        return row
      })
      console.log('new excel ', newExcel)
      setExcelData(newExcel)
    } else {
      alert('INVALID INPUT: Please enter a valid positive number')
    }

    

    
  }

  return (
    <div>
      
        <form>
          <label htmlFor="upload" class="custom-file-upload">Upload File</label>
          <input
              type="file"
              name="upload"
              id="upload"
              onChange={readUploadFile}
          />
        </form>
        {excelData.length > 0 ?
        <div>
          <table>
            <tbody>
            <tr>
              <th>Cost Code</th>
              <th>Total Est Qty</th>
              <th>Est Speed</th>
              <th>Todays Est Qty</th>
              <th>Hours Needed</th>
              <th>Man Days</th>
              <th>Crew Size</th>
              <th>Days of Work</th>
            </tr>
              {excelData.map((row, index) => {
                return (
                  <tr key={index}>
                    <td>{row.costCode}</td>
                    <td>{row.quantityBudget}</td>
                    <td>{row.laborSpeed} {row.uom}</td>
                    <td>
                      <input type='text' id={row.costCode} name='todaysQuantity' max={parseInt(row.quantityBudget)} onChange={e => handleTodaysQuantity(e)}></input>
                    </td>
                    <td>{Math.round((row.todaysQuantity / row.laborSpeed) * 100)/100}</td>
                    <td>{(Math.round((row.todaysQuantity / row.laborSpeed) * 100)/100) / row.laborHoursInDay}</td>
                    <td>
                      <input type='text' id={row.costCode} name='crewSize' onChange={e => handleTodaysQuantity(e)}></input>
                    </td>
                    <td>{(Math.round((row.todaysQuantity / row.laborSpeed) * 100)/100) / row.laborHoursInDay / row.crewSize}</td>
                  </tr>
                )
              })}
                
              </tbody>
          </table>
        </div> : <div></div> }
      </div>
  )
}

export default App;
