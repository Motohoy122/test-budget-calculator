import React, {useState, useEffect} from 'react';
import * as XLSX from 'xlsx';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    // width: '90%',
    // display: 'flex',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    display: 'grid', 
    gridTemplateColumns: 'repeat(9, 1fr)',
    gap: 8,
    alignItems: 'center',
    margin: 6,
  }));

const tableHeader = {fontWeight: 'bold', }
const mobileBox = {display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', margin: 'auto', }

const mobileLabel = {fontWeight: 'bold', textAlign: 'left', width: '50%', ml: 4}

const mobileValue = { width: '50%', mr: 4, fontSize: '1.6em', w: '100%', }

const BudgetList = () => {
  const [excelData, setExcelData] = useState([])
//   const [showPdf, setShowPdf] = useState(false)
  const [counter, setCounter] = useState(0)
  useEffect(() => {}, [])

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const readUploadFile = (e) => {
    console.log(e)
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
                  daysOfWork: 0,
                  errorTextCrewSize: "",
                  errorTextTodaysQty: "",
                  isErrorCrewSize: false,
                  isErrorTodaysQty: false
                }
            })
            setExcelData(json)


        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
  }

  const handleChange = (e) => {
    // [value, id, name] = e.target
    let value = parseInt(e.target.value)
    const id = e.target.id
    const name = e.target.name
    let newExcel =[]
    console.log(e.target)
    console.log('old excel ',excelData)
    if(typeof value === 'number') {
      newExcel = excelData.filter(row => {
        
        if(row.costCode === id) {

          // todaysQuantity Checks
          if(value < 0 && name==="todaysQuantity"){
            row.errorTextTodaysQty = "Add a positive integer"
            row.isErrorTodaysQty=true
            // return row
          }
          else if(isNaN(value) && name==="todaysQuantity"){
            value = 0
          }
          else if(name==='todaysQuantity' && row.quantityBudget < value) {
            row.isErrorTodaysQty=true
            row.errorTextTodaysQty="The entered value exceeds the total budgeted quantity"
            // return row
          }
          else if(name==='todaysQuantity' && (row.quantityBudget > value && value >= 0)) {
            row.isErrorTodaysQty=false
            row.errorTextTodaysQty=""
          }

          // crewSize checks
          if((value <= 0 || isNaN(value)) && name==="crewSize"){
            row.errorTextCrewSize="Add a positive integer"
            row.isErrorCrewSize=true
            return row
          }
          else if(name==="crewSize" && value > 0) {
            row.isErrorCrewSize=false
            row.errorTextCrewSize=""
          }
          
          // Updates row object if it passes validation checks
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

  const handleCount = () => {
    setCounter(counter => counter + 1)
  }
//   const handlePdfViewer = () => {
//     setShowPdf(!showPdf)
//   }

    return (
        <div>
            {/* <form> */}
            <Button variant="contained" component="label">
              Upload
              <input hidden type="file" name="upload" onChange={readUploadFile}/>
            </Button>
                {/* <input
                    type="file"
                    name="upload"
                    hidden
                    onChange={readUploadFile}
                />
            </button> */}
            {/* <h1>{counter}</h1> */}
            {/* </form> */}
            {excelData.length > 0 ?
            <Box
            
            >
                <Stack 
                    key='BudgetListStack'
                    sx={{
                        w: '100%',
                    }}
                >
                {matches ? <Item 
                    sx={{
                        backgroundColor: '#555555',
                        color: '#eeeeee',
                        borderRadius: 0,
                    }}
                >
                    <Typography sx={tableHeader}>Cost Code</Typography>
                    <Typography sx={tableHeader}>Total Est Qty</Typography>
                    <Typography sx={tableHeader}>Est Speed</Typography>
                    <Typography sx={tableHeader}>Todays Est Qty</Typography>
                    <Typography sx={tableHeader}>Hours Needed</Typography>
                    <Typography sx={tableHeader}>Man Days</Typography>
                    <Typography sx={tableHeader}>Crew Size</Typography>
                    <Typography sx={tableHeader}>Days of Work</Typography>
                </Item> : ''}
                {excelData.map((row, index) => {
                    return (
                    <Item 
                        key={index}
                        sx={index % 2 === 1 ? 
                            {
                                backgroundColor: '#bbbbbb',
                                gridTemplateColumns: matches ? '' : 'repeat(1, 1fr)',
                            } : 
                            {
                                gridTemplateColumns: matches ? '' : 'repeat(1, 1fr)',
                            }
                        }
                    >
                        <Box sx={mobileBox}>
                            {matches ? '' : <Typography variant="h6" sx={mobileLabel}>Cost Code: </Typography>}
                            <Typography key="costCode" sx={matches ? {fontWeight: 'bold'} : {...mobileValue, fontWeight: 'bold',}}>{row.costCode}</Typography>
                        </Box>
                        <Box sx={mobileBox}>
                            {matches ? '' : <Typography variant="h6" sx={mobileLabel}>Total Est Qty: </Typography>}
                            <Typography key="quantityBudget" sx={matches ? '' : mobileValue}>{row.quantityBudget}</Typography>
                        </Box>
                        <Box sx={mobileBox}>
                            {matches ? '' : <Typography variant="h6" sx={mobileLabel}>Labor Speed: </Typography>}
                            <Typography key="laborSpeed" sx={matches ? '' : mobileValue}>{row.laborSpeed} {row.uom}</Typography>
                        </Box>
                        <Box sx={mobileBox}>
                            {matches ? '' : <Typography variant="h6" sx={mobileLabel}>Today's Est Qty: </Typography>}
                                <TextField 
                                    id={row.costCode} 
                                    // id="todaysQuantity" 
                                    name='todaysQuantity' 
                                    // max={parseInt(row.quantityBudget)} 
                                    error={row.isErrorTodaysQty ? true : false}
                                    onChange={handleChange}
                                    // defaultValue={row.todaysQuantity}
                                    value={row.todaysQuantity === 0 ? '' : row.todaysQuantity}
                                    helperText={row.isErrorTodaysQty ? row.errorTextTodaysQty : ''}
                                    variant="filled"
                                    InputProps={matches ? '' : { style: { fontSize: '1em' } }}
                                    inputProps={matches ? { style: { padding: 4,} } : { style: { padding: 4 } }}
                                    size='small'
                                    sx={matches ? '' : mobileValue}
                                    fullWidth
                                />
                        </Box>
                        
                        <Box sx={mobileBox}>
                            {matches ? '' : <Typography variant="h6" sx={mobileLabel}>Hours Needed: </Typography>}
                            <Typography key="hoursNeeded" sx={matches ? '' : mobileValue}>{Math.round((row.todaysQuantity / row.laborSpeed) * 100)/100}</Typography>
                        </Box>
                        <Box sx={mobileBox}>
                            {matches ? '' : <Typography variant="h6" sx={mobileLabel}>Man Days: </Typography>}
                            <Typography key="manDays" sx={matches ? '' : mobileValue}> {(Math.round((row.todaysQuantity / row.laborSpeed) * 100/ row.laborHoursInDay))/100 }</Typography>
                        </Box>
                        <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', margin: 'auto'}}>
                            {matches ? '' : <Typography variant="h6" sx={mobileLabel}>Crew Size:  </Typography>}
                                <TextField 
                                id={row.costCode}
                                key="crewSize" 
                                error={row.isErrorCrewSize ? true : false}
                                name='crewSize' 
                                onChange={e => handleChange(e)} 
                                defaultValue={row.crewSize}
                                helperText={row.isErrorCrewSize ? row.errorTextCrewSize : ''}
                                variant="filled"
                                InputProps={matches ? '' : { style: { fontSize: '1em',} }}
                                inputProps={matches ? { style: { padding: 4,} }: { style: { padding: 4,} }}
                                size='xs'
                                sx={mobileValue}
                                />
                        </Box>
                        <Box sx={mobileBox}>
                            {matches ? '' : <Typography variant="h6" sx={mobileLabel}>Days of Work: </Typography>}
                            <Typography key="daysOfWork" sx={matches ? '' : mobileValue}>{row.isErrorCrewSize ? 'Error' : Math.round((row.todaysQuantity / row.laborSpeed) / row.laborHoursInDay / row.crewSize * 100) / 100}</Typography>
                        </Box>
                        <Button variant="contained" >Measure</Button>
                    </Item>)
                })}
                    </Stack>
                
            </Box> : <div></div> }
        </div>
    )
}

export default BudgetList
